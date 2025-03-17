import { HTTP_CODES } from "../Common/Constants/enums";
import message from "../Common/Constants/Messages";
import ApiError from "../Common/ErrorResponse";
import logger from "../Config/Logger";
import { UserAttributes, UserCreatinAttributes } from "../Models";
import { UserRepository } from "../Repository/User.repository";

export default class UserService {
	public static async create(payload: UserCreatinAttributes): Promise<UserAttributes> {
		try {
			const result = await UserRepository.findUserByEmail(payload.email);
			if (result) {
				throw new ApiError(HTTP_CODES.BAD_REQUEST, message.USER_ALREADY_EXISTS, false, result.toString());
			}    
			return await UserRepository.create(payload);
		} catch (error: any) {
			logger.error('SERVICE LAYER:CREATE USER API:', error);
			throw new ApiError(HTTP_CODES.INTERNAL_SERVER_ERROR, error.message, false, error.stack);
		}
	}

	// public static async loginUser(email: string, password: string) {
	// 	try {
	// 		const user = await UserRepository.findUserByEmail(email);

	// 		if (!user) {
	// 			throw new ApiError(HTTP_CODES.BAD_REQUEST, message.USER_NOT_FOUND, false);
	// 		}

	// 		// const isPasswordCorrect = await TokenService.comparePassword({
	// 		//   password,
	// 		//   hashedPassword: user.password,
	// 		// })

	// 		// if (!isPasswordCorrect) {
	// 		//   throw new ApiError(
	// 		//     HTTP_CODES.UNAUTHORIZED,
	// 		//     message.INVALID_PASSWORD,
	// 		//     false
	// 		//   )
	// 		// }

	// 		const tokenPayload = {
	// 			id: user?.id,
	// 			email: user?.email,
	// 			role: user?.roleData?.role,
	// 		};

	// 		const token = await TokenService.generateToken({ data: tokenPayload });

	// 		return { user, token };
	// 	} catch (error: any) {
	// 		logger.error('SERVICE LAYER:LOGIN USER API:-->', error);
	// 		throw new ApiError(HTTP_CODES.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, false, error.stack);
	// 	}
	// }
}
