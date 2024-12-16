import { ApiResponse } from "../interface/login"
import { Device } from "../model/Device";
import { User } from "../model/User"
import bcrypt from "bcryptjs"
import { Op, Sequelize } from "sequelize";
import { getLocation } from "../service/location";
import { wakeupUserDevice } from "../service/firebase";
import { Ad } from "../model/Ad";
import { removeFromColdStorage, transferToColdStorage } from "./upload";



export const updatePhoto = async (uid: string, buffer: Buffer) => {
    const photoId = await transferToColdStorage(buffer)
    const photoUrl = `https://cdn.messant.in/${photoId}`

    try {
        // Fetch user password hash from the database
        const userdb = await User.findOne({
            where: { uid },
            attributes: ["photo", "photo_id"], // Only fetch the necessary field
        });

        if (!userdb) {
            return { code: 404, data: "User not found" };
        }

        const user = userdb.toJSON()

        if (user.photo_id != null) {
            removeFromColdStorage(user.photo_id)
        }

        // Update the about in the database
        const [affectedRows] = await User.update(
            { photo: photoUrl, photo_id: photoId },
            { where: { uid } }
        );

        if (affectedRows === 0) {
            return { code: 500, data: "Failed to update visibility" }; // Fallback in case of an unexpected issue
        }

        return { code: 200, data: photoUrl };
    } catch (error) {
        console.error("Error updating visibility:", error);
        return { code: 500, data: "Internal Server Error" };
    }

}

export const getNearbyUsers = async (page: number, limit: number, ip: string, radius: number, uid: string): Promise<{ users: User[], ads: Ad[] }> => {
    const offset = (page - 1) * limit;
    const ipdata = await getLocation(ip)
    const location = `ST_GeomFromText('POINT(${ipdata?.lon} ${ipdata?.lat})', 0)`;

    const users = await User.findAll({
        attributes: [
            'username',
            'photo',
            'about',
            'verified',
            [Sequelize.literal(`ST_Distance_Sphere(location, ${location})`), 'distance'], // Calculate distance
        ],
        where: {
            uid: { [Op.ne]: uid },
            visibility: false
        },
        order: Sequelize.literal('distance ASC'),
        limit: limit,
        offset: offset,
    });

    const ads = await Ad.findAll({
        limit: 5
    })

    return { users: users, ads: ads }
}

export const getUserController = async (uid: string): Promise<ApiResponse> => {
    try {
        // Fetch user password hash from the database
        const userdb = await User.findOne({
            include: {
                model: Device,
                required: false, // This ensures it's a LEFT JOIN
                attributes: ["publicKey", "platform"], // Only fetch necessary fields from Device
                order: [['id', 'DESC']], // Corrected: 'order' should be part of the 'include' block
                limit: 1
            },
            where: {
                [Op.or]: [
                    { uid: uid },
                    { username: uid }
                ]
            },
            attributes: ["uid", "username", "photo", "about", "verified"], // Only fetch the necessary fields
        });

        if (!userdb) {
            return { code: 404, data: "User not found" };
        }

        return { code: 200, data: JSON.stringify(userdb.toJSON()) };
    } catch (error) {
        console.error("Error updating visibility:", error);
        return { code: 500, data: "Internal Server Error" };
    }
}

export const updateVisibility = async (uid: string, data: boolean) => {
    try {
        // Fetch user password hash from the database
        const userdb = await User.findOne({
            where: { uid },
            attributes: ["password"], // Only fetch the necessary field
        });

        if (!userdb) {
            return { code: 404, data: "User not found" };
        }

        // Update the about in the database
        const [affectedRows] = await User.update(
            { visibility: data },
            { where: { uid } }
        );

        if (affectedRows === 0) {
            return { code: 500, data: "Failed to update visibility" }; // Fallback in case of an unexpected issue
        }

        return { code: 200, data: "Visibility updated successfully!" };
    } catch (error) {
        console.error("Error updating visibility:", error);
        return { code: 500, data: "Internal Server Error" };
    }
}

export const updateAboutController = async (uid: string, data: string) => {
    try {
        // Fetch user password hash from the database
        const userdb = await User.findOne({
            where: { uid },
            attributes: ["password"], // Only fetch the necessary field
        });

        if (!userdb) {
            return { code: 404, data: "User not found" };
        }

        // Update the about in the database
        const [affectedRows] = await User.update(
            { about: data },
            { where: { uid } }
        );

        if (affectedRows === 0) {
            return { code: 500, data: "Failed to update about" }; // Fallback in case of an unexpected issue
        }

        return { code: 200, data: "About updated successfully!" };
    } catch (error) {
        console.error("Error updating about:", error);
        return { code: 500, data: "Internal Server Error" };
    }
}

export const changePasswordController = async (uid: string, current: string, updated: string): Promise<ApiResponse> => {
    try {
        // Fetch user password hash from the database
        const userdb = await User.findOne({
            where: { uid },
            attributes: ["password"], // Only fetch the necessary field
        });

        if (!userdb) {
            return { code: 404, data: "User not found" };
        }

        const isMatch = await bcrypt.compare(current, userdb.toJSON().password);

        if (!isMatch) {
            return { code: 403, data: "Wrong password" };
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(updated, 10);

        // Update the password in the database
        const [affectedRows] = await User.update(
            { password: hashedPassword },
            { where: { uid } }
        );

        if (affectedRows === 0) {
            return { code: 500, data: "Failed to update password" }; // Fallback in case of an unexpected issue
        }

        return { code: 200, data: "Password updated successfully!" };
    } catch (error) {
        console.error("Error updating password:", error);
        return { code: 500, data: "Internal Server Error" };
    }
}


export const wakeupUserController = async (username: string) => {
    const userdb: any | null = await User.findOne({
        include: {
            model: Device,
            required: false, // This ensures it's a LEFT JOIN
            attributes: ["fcmToken", "platform"], // Only fetch necessary fields from Device
            order: [['id', 'DESC']], // Corrected: 'order' should be part of the 'include' block
            limit: 1
        },
        where: { username: username },
        attributes: ["uid", "username"], // Only fetch the necessary fields
    });

    if (userdb) {
        const user = userdb.toJSON()
        const token = user.devices[0].fcmToken
        wakeupUserDevice(token)
    }
}