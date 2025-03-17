class ApiError extends Error {
	public readonly statusCode: number;
	isOperational?: boolean;
	override stack?: string;

	constructor(statusCode: number, message: string, isOperational = true, stack?: string) {
		super(message);
		
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
