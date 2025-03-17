import {Sequelize} from 'sequelize-typescript'
import { config } from '../Config/config';
import logger from '../Config/Logger';

const sequelizeConfig = new Sequelize({
	// dialect: 'postgres',
	// host: config.database.host ,
	// port: config.database.port,
	// username: config.database.username,
	// password: config.database.password,
	// database: config.database.name,
	// logging: config.isDevelopment ? true : false,
	// models: [__dirname + '../Models'],
});

// Expost this function to index.ts
export const connection = async () => {
	try {
		await sequelizeConfig.authenticate();        
		logger.info('Connection has been established successfully.');
	} catch (error) {
		logger.error('Unable to connect to database:-->', error);
        process.exit(1);
	}
};
