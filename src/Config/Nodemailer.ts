import nodemailer from 'nodemailer';
import logger from '@/Config/Logger';

// Define the type for the environment variables to ensure they are strings
const emailHost = process.env.EMAIL_HOST as string;
const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
const emailUser = process.env.EMAIL_USER as string;
const emailPassword = process.env.EMAIL_PASSWORD as string;

const transporter = nodemailer.createTransport({
	host: emailHost,
	port: emailPort,
	secure: true, // Ensure this is set as per your server's requirement
	auth: {
		user: emailUser,
		pass: emailPassword,
	},
});

transporter.verify((error: Error | null, success: any) => {
	if (error) {
		logger.error('✘ UNABLE TO CONNECT TO THE MAIL SERVER');
		logger.error(error);
	} else {
		logger.info('✔ MAIL SERVER IS READY TO SEND MAILS');
	}
});

export default transporter;
