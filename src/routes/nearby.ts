

import { Router } from "express";
import { authTokenChecker } from "../middleware/auth";
import { getNearbyUsers } from "../controller/user";

const v1Nearby = Router()


v1Nearby.get('/', authTokenChecker, async (req, res) => {
    const uid: string = req.headers["x-uid"] as string
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const radius = parseInt(req.query.radius as string) || 100;
    const ip: string = (req.headers['x-forwarded-for'] as string) || (req.ip as string);
    const data = await getNearbyUsers(page, limit, ip, radius, uid)
    res.json(data)
})

export default v1Nearby