import { Router } from "express";
import { rateLimit } from 'express-rate-limit'
import multer from "multer";
import { createAccountController } from "../controller/registration";
import { accessHistory, createLoginController } from "../controller/login";
import { authTokenChecker } from "../middleware/auth";
import { changePasswordController, getUserController, updateAboutController, updatePhoto, updateVisibility, wakeupUserController } from "../controller/user";
import { createDeviceController } from "../controller/device";



const storage = multer.memoryStorage()
const upload = multer({ storage });


const v1Account = Router();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})


v1Account.get('/', authTokenChecker, async (req, res) => {
    const uid: string = req.headers["x-uid"] as string
    const data = await getUserController(uid)
    res.status(data.code).send(data.data)
})

v1Account.get('/:username', authTokenChecker, async (req, res) => {
    const uid: string = req.params.username as string
    const data = await getUserController(uid)
    res.status(data.code).send(data.data)
})

v1Account.post('/register', limiter, async (req, res) => {
    const { username, password } = req.body
    const ip: string = (req.headers['x-forwarded-for'] as string) || (req.ip as string);
    const response = await createAccountController(username, password, ip)

    if (response.code === 200) {
        res.status(response.code).json(response.data)
    } else {
        res.status(response.code).send(response.data)
    }
})

v1Account.post('/login', limiter, async (req, res) => {
    const { username, password } = req.body
    const ip: string = (req.headers['x-forwarded-for'] as string) || (req.ip as string);
    const login = await createLoginController(username, password, ip)

    if (login.code === 200) {
        res.status(login.code).json(login.data)
    } else {
        res.status(login.code).send(login.data)
    }
})

v1Account.put('/presence', authTokenChecker, async (req, res) => {
    const uid: string = req.headers["x-uid"] as string
    const ip: string = (req.headers['x-forwarded-for'] as string) || (req.ip as string)
    accessHistory(ip, uid)
    res.sendStatus(200)
})

v1Account.post('/install', authTokenChecker, async (req, res) => {
    const { fcm_token, public_key, platform } = req.body
    const uid: string = req.headers["x-uid"] as string
    createDeviceController(uid, fcm_token, public_key, platform)
    res.sendStatus(200)
})

v1Account.patch('/password', authTokenChecker, async (req, res) => {
    const { current, updated } = req.body
    const uid: string = req.headers["x-uid"] as string
    const response = await changePasswordController(uid, current, updated)
    res.status(response.code).send(response.data)
})

v1Account.patch('/about', authTokenChecker, async (req, res) => {
    const { data } = req.body
    const uid: string = req.headers["x-uid"] as string
    const response = await updateAboutController(uid, data)
    res.status(response.code).send(response.data)
})

v1Account.patch('/visibility', authTokenChecker, async (req, res) => {
    const { data }: { data: boolean } = req.body
    const uid: string = req.headers["x-uid"] as string
    const response = await updateVisibility(uid, data)
    res.status(response.code).send(response.data)
})

v1Account.patch('/photo', authTokenChecker, upload.single('file'), async (req, res) => {
    const uid: string = req.headers["x-uid"] as string
    const file = req.file;
    if (file) {
        const remotePath = await updatePhoto(uid, file.buffer)
        res.status(remotePath.code).send(remotePath.data)
    } else {
        res.sendStatus(404)
    }
})

v1Account.post('/wakeup/:username', async (req, res) => {
    const username: string = req.params.username as string
    wakeupUserController(username)
    res.sendStatus(200)
})

export default v1Account;