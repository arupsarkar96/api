
import { Device } from "../model/Device"


export const createDeviceController = async (uid: string, fcmToken: string, publicKey: string, platform: string) => {
    try {
        Device.create({
            id: 0,
            uid: uid,
            fcmToken: fcmToken,
            publicKey: publicKey,
            platform: platform
        })
    } catch (error) {
        console.log(error)
    }
}