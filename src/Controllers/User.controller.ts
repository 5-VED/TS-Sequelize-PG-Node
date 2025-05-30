import { HTTP_CODES } from '../Common/Constants/enums';
import message from '../Common/Constants/Messages';
import logger from '../Config/Logger';
import UserService from '../Services/User.service';
import { sendResponse } from '../Utils/Auth_Methods';
import { NextFunction, Request, Response } from 'express';

export default class UserController {
    public static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await UserService.create(req.body);

            return sendResponse(res, response, message.USER_CREATED_SUCCESSFULLY, true, HTTP_CODES.OK);
        } catch (error) {
            logger.error('CONTROLLER LAYER:-->', error);
            next(error);
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await UserService.login(req.body.email, req.body.password);
            return sendResponse(res, response, message.USER_CREATED_SUCCESSFULLY, true, HTTP_CODES.OK);
        } catch (error) {
            logger.error('CONTROLLER LAYER:-->', error);
            next(error);
        }
    }
}
