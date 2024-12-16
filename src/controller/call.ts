import { Device } from "../model/Device";
import { User } from "../model/User";
import { sendPushCallNotification } from "../service/firebase"


export const createCall = async (to: string, from: string, call_id: string, mode: string, timestamp: string) => {
    const userdb: any | null = await User.findOne({
        include: {
            model: Device,
            required: false, // This ensures it's a LEFT JOIN
            attributes: ["fcmToken", "platform"], // Only fetch necessary fields from Device
            order: [['id', 'DESC']], // Corrected: 'order' should be part of the 'include' block
            limit: 1
        },
        where: { username: to },
        attributes: ["uid", "username"], // Only fetch the necessary fields
    });

    if (userdb) {
        const user = userdb.toJSON()
        const token = user.devices[0].fcmToken
        sendPushCallNotification(token, from, call_id, mode, timestamp)
    }
}