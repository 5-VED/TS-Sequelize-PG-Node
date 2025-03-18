import winston from 'winston';
import path from 'path';
import fs from 'fs';

interface Colors {
	[key: string]: string;
}

// Function to get today's date in YYYY-MM-DD format
const getCurrentDate = (): string => {
	return new Date().toISOString().split('T')[0];
};

// Function to get the directory path for today's logs
const getLogDirectory = (): string => {
	const logDir = path.join('logs', getCurrentDate()); // logs/YYYY-MM-DD/
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir, { recursive: true });
	}
	return logDir;
};

// Function to generate a log file name inside the date-wise directory
const getLogFileName = (level: string): string => {
	return path.join(getLogDirectory(), `${level}.log`);
};

const colors: Colors = {
	error: '\x1b[31m',
	warn: '\x1b[33m',
	info: '\x1b[32m',
	debug: '\x1b[36m',
	trace: '\x1b[90m',
	verbose: '\x1b[35m',
};

function customLogger(level: string, message: string): string {
	const color = colors[level] || '\x1b[0m';
	const logMessage = `${color}[${level.toUpperCase()}]: ${message}\x1b[0m`;

	return logMessage;
}

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		// new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: getLogFileName('error'), level: 'error' }),
		new winston.transports.File({ filename: getLogFileName('combined') }),

		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(info => {
					return customLogger(info.level, `[${info.timestamp}] ${info.message}`);
				}),
			),
		}),
	],
});

export default logger;
