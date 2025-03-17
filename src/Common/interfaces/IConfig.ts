export interface IToken {
    secret: string;
    expireTime: string;
}

export interface DataStoredInToken {
    _id: string;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export type LogLevel = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug';

export interface IAuth0 {
    domain: string;
    managementDomain: string;
    clientId: string;
    scope: string;
    responseType: string;
    realm: string;
    audience: string;
    managementClientId: string;
    managementClientSecret: string;
    urlLifeTime: number;
}

export interface IAws {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    endPoint: string;
}

export interface IConfig {  
    env: string;
    mongo: {
        url: string;
        useCreateIndex: boolean;
        autoIndex: boolean;
        debug: boolean;
    };
    server: {
        cors: {
            origin: boolean;
            credentials: boolean;
        };
        root: string;
        userRoles: string[];
        port: number;
        host: string;
        logLevel: LogLevel;
        activateNewRelic: boolean;
        axiosTimeout: number;
        memoryUsageTimeOut: number;
    };
    modules: {
        main: string;
        cron: string;
        cron2: string;
        jlWeb: string;
        messageCentre: string;
        formBuilder: string;
    };
    auth0: IAuth0;
    token: IToken;
    caching: {
        local: {
            ttl: number;
        };
    };
    aws: IAws;
    smtp2go: {
        key: string;
        testingEmail: string;
        fromEmail: string;
    };
    invoice: {
        startDate: string;
    };
}
