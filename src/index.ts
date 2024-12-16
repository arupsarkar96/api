import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import configuration from './config/config';
import v1Route from './routes/v1route';
import sequelize from './config/db';

const app = express();

app.set('trust proxy', 1);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public', { maxAge: '1d' }));

app.use('/v1', v1Route);


(async () => {
    try {
        if (!configuration.PORT || !configuration.MYSQL) {
            throw new Error('Missing required environment variables.');
        }

        await sequelize.authenticate();
        console.log("DATABASE 🟢");

        await sequelize.sync({ alter: true });
        console.log("SYNC 🟢");

        app.listen(configuration.PORT, '0.0.0.0', () => {
            console.log("🚀 Server running on port", configuration.PORT);
        });

        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received. Closing database connection...');
            await sequelize.close();
            process.exit(0);
        });
    } catch (error: any) {
        console.error("DATABASE 🔴", error.message);
    }
})();