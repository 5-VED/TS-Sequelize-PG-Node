import { HttpException } from "./HttpExpectations";

class ApiError extends HttpException {
	public readonly statusCode: number;
	isOperational?: boolean;
	override stack!: string;
	
	constructor(statusCode: number, message: string, isOperational = true, stack?: any) {
		super(statusCode,message,stack);
		
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export default ApiError;
