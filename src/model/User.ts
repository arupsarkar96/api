import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { Device } from "./Device";

interface UserAttributes {
    uid: string; // Unique user identifier
    username: string;
    password: string;
    photo: string; // Optional field
    photo_id: string | null;
    about: string; // Optional field
    verified: boolean;
    visibility: boolean;
    location: { type: "Point"; coordinates: [number, number] }; // GeoJSON object for the user's location
}

export class User extends Model<UserAttributes> { }



User.init(
    {
        uid: {
            type: DataTypes.STRING(20),
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true, // Ensure unique usernames
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        photo_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        about: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        visibility: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Default visibility
        },
        location: {
            type: DataTypes.GEOMETRY("POINT"), // Store as a geographical POINT
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "user",
        tableName: "users",
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

User.hasMany(Device, { foreignKey: "uid" });
