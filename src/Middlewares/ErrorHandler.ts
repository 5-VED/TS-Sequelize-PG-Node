import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../Common/HttpExpectations';
import logger  from '../Config/Logger';

const errorHandler = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
        const status: number = error.status || 500;
        const message: string = error.message || 'Something went wrong';

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        if (error.stack) {
            logger.debug(`[${req.method}] ${req.path} >> Stack:: ${error.stack}`);
        }
        res.status(status).json({ message });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export default errorHandler;
