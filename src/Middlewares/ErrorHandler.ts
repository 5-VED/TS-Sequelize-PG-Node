import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../Common/HttpExpectations';
import logger from '../Config/Logger';
import { HTTP_CODES } from '../Common/Constants/enums';
import { sendResponse } from '../Utils/Auth_Methods';


const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    try {        
        const commonErrorMessage = 'Something went wrong';
        if (error instanceof HttpException) {
            const status = error.status || HTTP_CODES.INTERNAL_SERVER_ERROR;
            const message = error.message || commonErrorMessage;
            const data = error.stack || null;
            logger.error(
                `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}${data ? `, Data:: ${JSON.stringify(data)}` : ''}${error && error.stack ? `, Location: ${JSON.stringify(error.stack)}` : ''
                }`,
            );
            return sendResponse(res, error.stack, message, false, status)
        } else {
            logger.error(
                `[${req.method}] ${req.path} >> StatusCode:: ${HTTP_CODES.INTERNAL_SERVER_ERROR}, Message:: ${JSON.stringify(error)}. Location: ${JSON.stringify(
                    error.stack,
                )}`,
            );
            return sendResponse(res, error.message, commonErrorMessage, false, HTTP_CODES.INTERNAL_SERVER_ERROR)
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export default errorHandler;
