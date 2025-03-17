import express, { NextFunction, Request, Response } from 'express';
import helmet from "helmet";
import hpp from "hpp";
import errorHandler from "./Middlewares/ErrorHandler";
import {IndexRoute} from './Routers'
import * as http from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { freemem } from 'os';
import { sendResponse } from './Utils/Auth_Methods';
import { HTTP_CODES } from './Common/Constants/enums';
import message from './Common/Constants/Messages';
// const FILE_PATH = `${config.server.root}/statics/stats.json` || '';
import logger from './Config/Logger';
import { IRoutes } from './Common/interfaces/IRoutes';
import { ILooseObject } from './Common/interfaces/ILooseObject';
import cors from "cors"
import { config } from './Config/config';
import {connection} from './Database/PostgresConnection';
import moment from 'moment';
import cookieParser from 'cookie-parser';
import client from './Database/RedisConnection';


const FILE_PATH =  '';


export default class App extends http.Server {
    public app: express.Application;
    public port: string | number;
    public env: string;
    private server?: http.Server;

    constructor() {
        super();
        // if (config.server.activateNewRelic && config.env !== 'local' &&  .CONF_ENV !== 'test') {
        //     try {
        //         require('newrelic');
        //         logger.info('Newrelic enabled');
        //     } catch (error) {
        //         logger.info('newrelic not found');
        //     }
        // }
        this.app = express();
        this.port = config.port;
        this.env = config.env;
    }

    public async initialize(): Promise<void> {
        // await Database.open();
        this.initializeMiddlewares();
        this.initializeErrorHandling();
        this.initializeRoutes(new IndexRoute(this.app));        
    }

    public async start() {
        this.server = this.app.listen(this.port, () => {
            logger.info(`==========================================`);
            logger.info(`NODE version ${process.version}`);
            logger.info(`🚀 API (${this.env}) listening on the port ${this.port}`);
            logger.info(`==========================================`);
            // connection.authenticate();
            setInterval(() => {
                logger.info(`----------------MEMORY_USAGE----------------`);
                const used = process.memoryUsage();
                for (const key in used) {
                    const memoryKey = key as keyof typeof used;
                    logger.info(`${memoryKey} ${Math.round((used[memoryKey] / 1024 / 1024) * 100) / 100} MB`);
                  }
                logger.info(`reeMemory ${Math.round((freemem() / 1024 / 1024) * 100) / 100} MB`);
            }, 300000);
            // this.initializeApiDocs(this.app);
        });
    }

    public async disconnect(): Promise<void> {
        if (this.server) {
            await new Promise((resolve, reject) => {
                this.server?.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            });
        }
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(hpp());
        this.app.use(helmet());
        // this.app.use(compression());
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cookieParser());

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.on('finish', () => {
                const stats: any = this.readStats();
                const event = `${moment().format('YYYY-MM-DD')} : ${req.method} ${this.getRoute(req)} ${res.statusCode}`;
                stats[event] = stats[event] ? stats[event] + 1 : 1;
                this.dumpStats(stats);
            });
            next();
        });
    }

    public initializeRoutes(routes: IRoutes) {
        this.app.use('/', routes.router);

        this.app.use(function (err: ILooseObject, req: Request, res: Response, next: NextFunction) {
            if (err.name === 'UnauthorizedError') {
                logger.error('invalid token...');
                return sendResponse(res, {}, message.UNAUTHORIZED, false, HTTP_CODES.UNAUTHORIZED);
            }
            next();
        });

        this.app.get('/stats/', (req, res) => {
            res.json(this.readStats());
        });

        this.app.get('/health', (req, res) => {
            const data = {
                uptime: process.uptime(),
                message: 'Ok',
                date: new Date(),
            };

            res.status(200).send(data);
        });
    }

    getRoute = (req: Request) => {
        const route = req.route ? req.route.path : ''; // check if the handler exist
        const baseUrl = req.baseUrl ? req.baseUrl : ''; // adding the base url if the handler is child of other handler
        return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route';
    };
    // read json object from file
    readStats = () => {
        let result = {};
        try {
            result = JSON.parse(readFileSync(FILE_PATH, 'utf8'));
        } catch (err) {
            logger.error(err);
        }
        return result;
    };

    // dump json object to file
    dumpStats = (stats: any) => {
        try {
            writeFileSync(FILE_PATH, JSON.stringify(stats), { flag: 'w+' });
        } catch (err) {
            logger.error(err);
        }
    };

    // private async initializeApiDocs(app: express.Application) {
    //     const swagger = await import('./config/swagger');
    //     swagger.apiDoc(app);
    // }

    private initializeErrorHandling() {
        this.app.use(errorHandler);
    }
}
