import { Sequelize } from "sequelize";
import configuration from './config';


const sequelize = new Sequelize(configuration.MYSQL, {
    pool: {
        max: 10,
        min: 1,
        acquire: 30000, // Maximum time to acquire a connection in ms
        idle: 10000,    // Time before releasing an idle connection
    },
    logging: false,
});

export default sequelize;