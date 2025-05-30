import message from '../Common/Constants/Messages';
import { ErrorExtractor } from '../Utils/ErrorExtractor';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { RequestHandler } from 'express';
import ApiError from '../Common/ErrorResponse';
import { HTTP_CODES } from '..//Common/Constants/enums';
import logger from '../Config/Logger';

const errorExtractor = new ErrorExtractor();

const ValidationMiddleware = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: any,
    value: string | 'body' | 'query' | 'params' = 'body',
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true,
): RequestHandler => {
    return (req, res, next) => {
        const reqValue = value === 'body' ? req.body : value === 'query' ? req.query : req.params;
        validate(plainToInstance(type, reqValue), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                let msg: string = '';
                errors.map((error: ValidationError) => {
                    if (error.constraints) {
                        msg = Object.values(error.constraints).join(', ');
                        logger.error(msg);
                    }
                });
                if (msg) {
                    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${HTTP_CODES.BAD_REQUEST}, Message:: ${msg}`);
                    next(new ApiError(HTTP_CODES.BAD_REQUEST, msg, false));
                } else {
                    msg = `${message.INVALID_PAYLOAD}` + `${value}`;
                    const errorStack = errorExtractor.extractDeepestErrors(errors);
                    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${HTTP_CODES.BAD_REQUEST}, Message:: ${msg}, Error:: ${errorStack}`);
                    next(new ApiError(HTTP_CODES.BAD_REQUEST, msg, false));
                }
            } else {
                next();
            }
        });
    };
};

export default ValidationMiddleware;
