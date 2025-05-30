import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';
import path from 'path';

// Load environment variables from the .env file
const envResult = dotenv.config({ path: '.env' });

if (envResult.error) {
  throw new Error("Couldn't load environment variables");
}

// Parse environment variables to their correct types
const parsedEnv = dotenvParseVariables(envResult.parsed || {});

const env = process.env.NODE_ENV || 'development';


export const config	 = {
	env,
	isDevelopment: env === 'development',
	isProduction: env === 'production',
	isTest: env === 'test',
	port: parsedEnv.PORT,
	database: {
		host: parsedEnv.DB_HOST,  
		port: parsedEnv.DB_PORT,
		name: parsedEnv.DB_NAME,
		username: parsedEnv.DB_USER,
		password: parsedEnv.DB_PASSWORD,
	},
	server: {
		memoryUsageTimeOut: (parsedEnv.MEMORY_USAGE_TIMEOUT),
		activateNewRelic: true	
	},
	jwt: {
		secret: parsedEnv.JWT_SECRET,
		expiresIn: parsedEnv.JWT_EXPIRES_IN,
	},
};
