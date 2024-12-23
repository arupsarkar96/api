import { generateToken } from '../config/token';
import bcrypt from "bcryptjs"

import { getLocation } from '../service/location';
import { ApiResponse } from '../interface/login';
import { User } from '../model/User';
import { Login } from '../model/Login';




const ACCESS_TOKEN_TTL = "36h"

export const createLoginController = async (username: string, password: string, ip: string): Promise<ApiResponse> => {

    if (!username || !password) {
        return { code: 400, data: "Username and password are required" };
    }

    try {
        const userdb = await User.findOne({ where: { username: username }, attributes: ["uid", "username", "password", "photo", "about", "verified", "visibility"] });

        if (userdb) {
            const user = userdb.toJSON();
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return { code: 403, data: "Wrong password" };
            }

            const token = generateToken({ username: username }, ACCESS_TOKEN_TTL, user.uid);
            accessHistory(ip, user.uid)


            return {
                code: 200, data: {
                    token: token,
                    user: {
                        uid: user.uid,
                        username: user.username,
                        photo: user.photo,
                        about: user.about,
                        verified: user.verified,
                        visibility: user.visibility
                    }
                }
            }


        } else {
            console.log("Username not found");
            return { code: 404, data: "Username not found" };
        }
    } catch (error) {
        console.error("Error finding user:", error);
        return { code: 500, data: "Internal server error" };
    }
};



export const accessHistory = async (ip: string, userId: string) => {
    const ipdata = await getLocation(ip)
    await Login.create({
        id: 0,
        uid: userId,
        ip: ip,
        country: ipdata?.country,
        cc: ipdata?.countryCode,
        region: ipdata?.regionName,
        rc: ipdata?.region,
        city: ipdata?.city,
        location: { type: "Point", coordinates: [ipdata?.lon!!, ipdata?.lat!!] }
    })
}