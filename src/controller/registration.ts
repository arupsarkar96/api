
import bcrypt from "bcryptjs"
import IceId from "iceid";
import configuration from "../config/config";
import { createLoginController } from './login';
import { getLocation } from '../service/location';
import { ApiResponse } from "../interface/login";
import { User } from "../model/User";

const generator = new IceId(configuration.DATACENTER, configuration.MACHINE_ID);


function getRandomColor() {
    const colors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function getRandomCharacter() {
    const characters = ['lorelei', 'micah', 'open-peeps', 'croodles', 'adventurer'];
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
}

const privacyQuotes = [
    "Privacy is not something that I’m merely entitled to, it’s an absolute prerequisite. – Marlon Brando",
    "The right to privacy is the most important thing, not just for individuals but for society at large. – Bruce Schneier",
    "Privacy is dead, and social media hold the smoking gun. – Pete Cashmore",
    "Those who would give up essential Liberty, to purchase a little temporary Safety, deserve neither Liberty nor Safety. – Benjamin Franklin",
    "In the end, privacy is not something that you can demand from others. It's something that you have to protect and guard yourself. – Tim Cook",
    "The greatest threat to privacy is not the government, it's the individual who leaks our personal data. – Shoshana Zuboff",
    "When you are in the public eye, your privacy is a luxury you can't afford. – Elena Ferrante",
    "To be left alone is the most precious thing one can ask of the modern world. – Anthony Burgess",
    "Surveillance is the business model of the Internet. – Shoshana Zuboff",
    "Privacy is not about hiding; it's about control. – Edward Snowden"
];

function getRandomPrivacyQuote() {
    const randomIndex = Math.floor(Math.random() * privacyQuotes.length);
    const quote = privacyQuotes[randomIndex];

    // Ensure the quote doesn't exceed 255 characters
    if (quote.length > 255) {
        return quote.substring(0, 255);
    }

    return quote;
}

export const createAccountController = async (username: string, password: string, ip: string): Promise<ApiResponse> => {

    if (!username || !password) {
        return { code: 400, data: "Username and password are required" };
    }

    const databaseuser = await User.findOne({ where: { username: username } });

    if (!databaseuser) {

        const hashedPassword = await bcrypt.hash(password, 10);
        const ipdata = await getLocation(ip)
        const photo: string = `https://api.dicebear.com/9.x/${getRandomCharacter()}/png?seed=${username}&backgroundColor=${getRandomColor()}`
        const about: string = getRandomPrivacyQuote()

        await User.create({
            uid: generator.generate(),
            username: username,
            password: hashedPassword,
            photo: photo,
            photo_id: null,
            about: about,
            verified: false,
            visibility: false,
            location: { type: "Point", coordinates: [ipdata?.lon!!, ipdata?.lat!!] },
        });

        return await createLoginController(username, password, ip)

    } else {
        return { code: 409, data: "Account already in use" };
    }
}