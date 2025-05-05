import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../Models/User.model';
import logger from '../Config/Logger';
import { RoleModel } from '../Models';
import jwt from 'jsonwebtoken';
import message from '../Common/Constants/Messages';
import { ROLE } from '../Common/Constants/enums';
import { HTTP_CODES } from '../Common/Constants/enums';
import { sendResponse } from '../Utils/Auth_Methods';
export interface AuthOptions {
	isTokenRequired?: boolean;
	usersAllowed?: string[];
}

export interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		role?: string;
		email?: string;
	};
}

export const auth = ({ isTokenRequired = true, usersAllowed = [] }: AuthOptions = {}) => {
	return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			let token = (req.header('x-auth-token') || req.header('Authorization'))?.replace(/Bearer +/g, '') as string;

			if (isTokenRequired && !token) {				
				return sendResponse(res, isTokenRequired, message.TOKEN_REQUIRED, false, HTTP_CODES.BAD_REQUEST)
			}

			if (!isTokenRequired && !token) return next();

			let decoded: any = jwt.decode(token);
			logger.info(`[DECODED] [CONTENT: ${JSON.stringify(decoded)}]`);

			if (!decoded?.id) {				
				return sendResponse(res, decoded, message.INVALID_TOKEN, false, HTTP_CODES.UNAUTHORIZED)
			}

			const user = await UserModel.findOne({
				where: {
					id: decoded.id,
					isActive: true,
				},
				include: [{ model: RoleModel, as: 'roleData' }],
				raw: true,
				nest: true,
			});

			if (!user) {				
				return sendResponse(res, user, message.INVALID_TOKEN, false, HTTP_CODES.UNAUTHORIZED)
			}

			req.user = {
				...decoded,
				// ...user,
				id: user?.id,
				role: user?.roleData?.role,
				email: user?.email,
			};

			if (req?.user?.role === ROLE.ADMIN || usersAllowed.includes('*')) {
				return next();
			}

			if (usersAllowed.includes(req?.user?.role as string)) return next();

			// APIResponse.sendError(res, HTTP_CODES.UNAUTHORIZED, message.UNAUTHORIZED, decoded);
			return sendResponse(res, decoded, message.UNAUTHORIZED, false, HTTP_CODES.UNAUTHORIZED)
		} catch (error: any) {
			logger.error(`[AUTH ERROR]: ${error.message}`);			
			return sendResponse(res, error.stack, error.message, false, HTTP_CODES.INTERNAL_SERVER_ERROR)
		}
	};
};
