
import { Router } from "express";
import { authTokenChecker } from "../middleware/auth";
import { createCall } from "../controller/call";


const v1Call = Router()

v1Call.post('/', authTokenChecker, async (req, res) => {
    const { to, from, call_id, mode, timestamp } = req.body
    createCall(to, from, call_id, mode, timestamp)
    res.sendStatus(200)
})

export default v1Call;