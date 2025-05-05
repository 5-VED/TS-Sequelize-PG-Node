import { Sequelize } from 'sequelize-typescript'
import { config } from '../Config/config';
import logger from '../Config/Logger';
import { RoleModel, UserModel } from '../Models';

const sequelize = new Sequelize(
	config.database.name as string,
	config.database.username as string,
	config.database.password as string,
	{
		dialect: 'postgres',
		host: config.database.host as string,
		port: config.database.port as number,
		logging: config.isDevelopment ? true : false,
		// models: [__dirname + '../Models'],
		models: [UserModel, RoleModel]
	}
);

export const connection = async () => {
	try {
		await sequelize.authenticate();
		logger.info('Connection has been established successfully.');
	} catch (error) {
		logger.error('Unable to connect to database:-->', error);
		process.exit(1);
	}
};

export default sequelize;