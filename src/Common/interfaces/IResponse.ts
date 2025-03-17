import { AxiosResponse } from 'axios';
import { ILooseObject } from './ILooseObject';

export interface IResponse {
    data?: ILooseObject;
    message?: string;
    success: boolean;
}

export interface IAxiosResponse<T> extends AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
}
