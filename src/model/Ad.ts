import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

export interface AdAttributes {
    id: number;
    title: string;
    body: string;
    image: string;
    ratio: string;
    price: number;
    url: string;
    active: boolean;
}

export class Ad extends Model<AdAttributes> { }

Ad.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED, // Use INTEGER for auto-increment
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(64), // Assuming `uid` is a UUID, use 36 characters for UUID
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ratio: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: "ad",
        tableName: "ads",
        timestamps: true,
    }
);
