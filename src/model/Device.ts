import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { User } from "./User";

export interface DeviceAttributes {
    id: number;
    uid: string;
    fcmToken: string;
    publicKey: string;
    platform: string;
}

export class Device extends Model<DeviceAttributes> { }

Device.init(
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
                model: User,
                key: 'uid',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        fcmToken: {
            type: DataTypes.TEXT, // Adjust length to support both IPv4 and IPv6
            allowNull: false,
        },
        publicKey: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "device",
        tableName: "devices",
        timestamps: true, // Automatically handle createdAt and updatedAt
    }
);

// Device.belongsTo(User, { foreignKey: "uid" });