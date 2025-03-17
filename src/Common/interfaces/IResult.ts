import { ILooseObject } from "./ILooseObject";

export default interface IResult {
    status: 'success' | 'fail',
    message: string,
    result?: boolean,
    statusCode?: number,
    data?: ILooseObject
}

export function isIResult(arg: ILooseObject): boolean {
    return arg.status != undefined && (arg.status == 'success' || arg.status == 'fail') && arg.result != undefined && typeof arg.result == 'boolean' && typeof arg.message == 'string';
}