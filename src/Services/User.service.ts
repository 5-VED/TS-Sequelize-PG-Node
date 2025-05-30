import { HTTP_CODES } from '../Common/Constants/enums';
import message from '../Common/Constants/Messages';
import ApiError from '../Common/ErrorResponse';
import logger from '../Config/Logger';
import { UserAttributes, UserCreatinAttributes } from '../Models/User.model';
import { UserRepository } from '../Repository/User.repository';
import sequelize from '../Database/PostgresConnection';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../Config/config';

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
                throw new ApiError(HTTP_CODES.BAD_REQUEST, message.USER_ALREADY_EXISTS, false, { email: payload.email });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(payload.password, 10);
            const user = await UserRepository.create(
                {
                    ...payload,
                    password: hashedPassword,
                },
                transaction,
            );

            await transaction.commit();
            return user;
        } catch (error) {
            logger.error('SERVICE LAYER Error:', error);
            await transaction.rollback();
            throw new ApiError(HTTP_CODES.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, false);
        }
    }

    public static async login(email: string, password: string): Promise<{ user: Partial<UserAttributes> | null; token: string }> {
        const transaction = await sequelize.transaction();
        try {
            const user = await UserRepository.findUserByEmail(email, transaction);

            if (!user) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, message.USER_NOT_FOUND, false);
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new ApiError(HTTP_CODES.UNAUTHORIZED, message.INVALID_PASSWORD, false);
            }

            // Generate JWT token
            const tokenPayload: TokenPayload = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            const signOptions: SignOptions = {
                expiresIn: UserService.JWT_EXPIRES_IN,
            };

            const token = jwt.sign(tokenPayload, UserService.JWT_SECRET, signOptions);

            // Remove password from response
            const userResponse = {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };

            await transaction.commit();
            return {
                user: userResponse,
                token,
            };
        } catch (error) {
            logger.error('SERVICE LAYER :-->', error);
            await transaction.rollback();
            throw new ApiError(HTTP_CODES.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR, false);
        }
    }
}
