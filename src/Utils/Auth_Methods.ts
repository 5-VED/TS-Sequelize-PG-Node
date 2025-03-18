import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
// import { JwtToken } from 'Interface/helper.interface';
import { IResponse } from '../Common/interfaces/IResponse';
import { Response } from 'express';

export const generateGetFilter = async ({
    isPermanentDelete = true,
    query = {},
    regexFields = [],
    searchFields = [],
    rangeFields = [],
    inFields = [],
}: {
    isPermanentDelete?: Boolean;
    query?: { [key: string]: any };
    regexFields?: string[];
    searchFields?: string[];
    rangeFields?: string[];
    inFields?: string[];
}) => {
    if (!isPermanentDelete && !query.isAll) query.isActive = true;
    query['$or'] = [];
    query['$and'] = [];
    query.page = +query.page;
    query.skip = query.page ? (query.page - 1) * query.limit : 0;
    query.limit = +query.limit;
    query.sortBy = query.sortBy;
    query.sortOrder = query.sortOrder;

    if (regexFields.length) for await (const key of regexFields) if (query[key]) query[key] = { $regex: query[key], $options: 'i' };

    if (searchFields.length && query.search)
        for await (const key of searchFields)
            query['$or'].push({
                ...(key.startsWith('+') && typeof +query.search === 'number' && isNaN(+query.search)
                    ? { [key.substring(1)]: +query.search }
                    : { [key]: { $regex: query.search, $options: 'i' } }),
            });

    if (rangeFields.length)
        for await (const key of rangeFields)
            if (query[key])
                query['$and'].push({
                    [key.split('Range')[0]]: {
                        $gte: query[key][0],
                        $lte: query[key][1],
                    },
                });

    if (inFields.length) for await (const key of inFields) if (query[key]) query['$and'].push({ [key.split('In')[0]]: { $in: query[key] } });

    if (query['$or'].length === 0) delete query['$or'];
    if (query['$and'].length === 0) delete query['$and'];

    return query;
};

export const comparePassword = async ({ password, hashedPassword }: { password: string; hashedPassword: string }): Promise<boolean> => {
    const isMatch: boolean = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

export const decodeToken = async ({ token }: { token: string }):Promise<string | JWT.JwtPayload> => {
    if (!process.env.JWT_SECRET_KEY) throw new Error('JWT_SECRET_KEY environment variable is not defined');

    const decoded = await JWT.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
};

export const isEmpty = (value: any): boolean => {
    if (value == null || value == 'null') {
        return true;
    }
    if (typeof value == 'object') {
        return Object.keys(value).length == 0;
    }
    return (Array.isArray(value) && value.length == 0) || value == undefined || value == 'undefined' || value == null || value == '';
};

export const hashPassword = async ({ password }: { password: string }): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

export async function sendResponse(res: Response, data: any, message: string | undefined, success: boolean, code = 200):Promise<void> {
    const responseObj: IResponse = {
        data: data,
        message: message ? message : 'undefined',
        success: success,
    };
    res.status(code).json(responseObj);
}