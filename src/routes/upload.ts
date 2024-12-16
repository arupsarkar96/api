import { Router } from "express";
import multer from 'multer';
import { authTokenChecker } from "../middleware/auth";
import { transferToColdStorage } from "../controller/upload";


const v1Upload = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage });


v1Upload.post('/', authTokenChecker, upload.single('file'), async (req, res) => {
    // const sender: string = req.headers["x-uid"] as string;
    const file = req.file;
    if (file) {
        const remotePath = await transferToColdStorage(file.buffer)
        res.json({
            url: remotePath,
            size: file.size,
            mimetype: file.mimetype
        })
    } else {
        res.sendStatus(404)
    }
})



export default v1Upload;