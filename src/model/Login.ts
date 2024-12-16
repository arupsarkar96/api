import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { User } from "./User";

interface LoginAttributes {
    id: number; // Auto-incremented unique identifier for the login record
    uid: string; // User ID associated with the login
    ip: string; // IP address of the user
    country?: string; // Country name
    cc?: string; // Country code (optional)
    region?: string; // Region name (optional)
    rc?: string; // Region code (optional)
    city?: string; // City name (optional)
    location?: { type: "Point"; coordinates: [number, number] }; // GeoJSON object for the user's location
}

export class Login extends Model<LoginAttributes> { }

Login.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED, // Use INTEGER for auto-increment
            autoIncrement: true,
            primaryKey: true,
        },
        uid: {
            type: DataTypes.STRING(20), // Assuming `uid` is a UUID, use 36 characters for UUID
            allowNull: false,
            references: {
                model: User, // Reference the User model
                key: 'uid', // Reference the id field in the User model
            },
            onDelete: 'CASCADE', // Optional: When a User is deleted, delete their Posts
            onUpdate: 'CASCADE',
        },
        ip: {
            type: DataTypes.STRING(16), // Adjust length to support both IPv4 and IPv6
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cc: {
            type: DataTypes.STRING(4),
            allowNull: true,
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rc: {
            type: DataTypes.STRING(4),
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        location: {
            type: DataTypes.GEOMETRY("POINT"), // Store geographical data as POINT
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "login",
        tableName: "logins",
        timestamps: true, // Automatically handle createdAt and updatedAt
    }
);
