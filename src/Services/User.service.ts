import { HTTP_CODES } from "../Common/Constants/enums";
import message from "../Common/Constants/Messages";
import ApiError from "../Common/ErrorResponse";
import logger from "../Config/Logger";
import { UserAttributes, UserCreatinAttributes } from "../Models/User.model";
import { UserRepository } from "../Repository/User.repository";
import sequelize from "../Database/PostgresConnection";
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from "../Config/config";

interface TokenPayload {
	id: string;
	email: string;
	role?: string;
}

export default class UserService {
	
	private static readonly JWT_SECRET = config.jwt.secret as string;		
	private static readonly JWT_EXPIRES_IN = '24h'; // Set to 24 hours

	public static async create(payload: UserCreatinAttributes): Promise<UserAttributes> {	
		const transaction = await sequelize.transaction();
		try {
			const existingUser = await UserRepository.findUserByEmail(payload.email, transaction);
			
			if (existingUser) {
				throw ApiError.conflict(message.USER_ALREADY_EXISTS, { email: payload.email });
			}    

			// Hash the password before saving
			const hashedPassword = await bcrypt.hash(payload.password, 10);
			const user = await UserRepository.create({
				...payload,
				password: hashedPassword
			}, transaction);
			
			await transaction.commit();
			return user;

		} catch (error) {
			await transaction.rollback();						
			throw ApiError.internal('Failed to create user');
		}	
	}

	public static async login(email: string, password: string) {
		try {
			const user = await UserRepository.findUserByEmail(email);

			if (!user) {
				throw ApiError.notFound(message.USER_NOT_FOUND);
			}

			// Verify password
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				throw ApiError.unauthorized(message.INVALID_PASSWORD);
			}

			// Generate JWT token
			const tokenPayload: TokenPayload = {
				id: user.id,
				email: user.email,
				role: user.role
			};

			const signOptions: SignOptions = {
				expiresIn: UserService.JWT_EXPIRES_IN
			};

			const token = jwt.sign(
				tokenPayload, 
				UserService.JWT_SECRET,
				signOptions
			);

			// Remove password from response
			const userResponse = {
				id: user.id,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			};

			return {
				user: userResponse,
				token
			};
		} catch (error) {
			throw ApiError.internal('Failed to login user');
		}
	}
}
