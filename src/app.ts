import express, { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import cookieParser from 'cookie-parser';
import moment from 'moment';
import { readFileSync, writeFileSync } from 'fs';
import { freemem } from 'os';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './Config/config';
import logger from './Config/Logger';
import { connection } from './Database/PostgresConnection';
import errorHandler from "./Middlewares/ErrorHandler";
import { IndexRoute } from './Routers';
import { IRoutes } from './Common/interfaces/IRoutes';
import { ILooseObject } from './Common/interfaces/ILooseObject';
import { sendResponse } from './Utils/Auth_Methods';
import { HTTP_CODES } from './Common/Constants/enums';
import message from './Common/Constants/Messages';
import ApiError from './Common/ErrorResponse';
import swaggerOptions from './Config/swagger.config';

const FILE_PATH = '';

export default class App {
    public app: express.Application;
    public port: string | number;
    public env: string;
    private server?: any;

    constructor() {
        this.app = express();
        this.port = config.port;
        this.env = config.env;
        this.initializeMiddlewares();
        this.initializeSwagger();
    }

    public async initialize(): Promise<void> {
        await this.connect();
        this.initializeRoutes(new IndexRoute(this.app));
        this.initializeErrorHandling();
    }

    public async connect(): Promise<void> {
        try {
            await connection();
            logger.info('Database connected successfully');
        } catch (error) {
            logger.error('Database connection failed:', error);
            process.exit(1);
        }
    }

    public async start(): Promise<void> {
        this.server = this.app.listen(this.port, () => {
            logger.info('='.repeat(50));
            logger.info(`🚀 Server running in ${this.env} mode on port ${this.port}`);
            logger.info(`👉 http://localhost:${this.port}`);
            logger.info(`📝 API Documentation: http://localhost:${this.port}/api-docs`);
            logger.info(`🔰 Node version: ${process.version}`);
            logger.info('='.repeat(50));

            // Monitor memory usage every 5 minutes
            setInterval(() => {
                const used = process.memoryUsage();
                logger.info('Memory Usage Stats:');
                for (const key in used) {
                    const memoryKey = key as keyof typeof used;
                    logger.info(`${memoryKey}: ${Math.round((used[memoryKey] / 1024 / 1024) * 100) / 100} MB`);
                }
                logger.info(`Free Memory: ${Math.round((freemem() / 1024 / 1024) * 100) / 100} MB`);
            }, 300000);
        });
    }

    private initializeMiddlewares() {
        // Security middlewares
        this.app.use(helmet({
            contentSecurityPolicy: this.env === 'production',
            crossOriginEmbedderPolicy: this.env === 'production',
        }));
        this.app.use(hpp());
        this.app.use(cors({
            origin: this.env === 'production' ? process.env.CORS_ORIGIN : '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        }));

        // Request parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(cookieParser());

        // Request statistics
        if (FILE_PATH) {
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
    }

    private initializeSwagger() {
        const specs = swaggerJsdoc(swaggerOptions);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    public initializeRoutes(routes: IRoutes) {
        // JWT error handler
        this.app.use((err: ILooseObject, req: Request, res: Response, next: NextFunction) => {
            if (err.name === 'UnauthorizedError') {
                logger.error('JWT validation failed:', err);
                return sendResponse(res, {}, message.UNAUTHORIZED, false, HTTP_CODES.UNAUTHORIZED);
            }
            next(err);
        });

        // API routes
        this.app.use('/api/v1', routes.router);

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                success: true,
                timestamp: new Date(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                status: 'OK'
            });
        });

        // Stats endpoint (if enabled)
        if (FILE_PATH) {
            this.app.get('/stats', (req, res) => {
                res.json(this.readStats());
            });
        }
    }

    private initializeErrorHandling() {
        // Handle 404 errors
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            next(ApiError.notFound(`Endpoint ${req.method} ${req.path} not found`));
        });

        // Global error handler
        this.app.use(errorHandler as ErrorRequestHandler);
    }

    public async disconnect(): Promise<void> {
        if (this.server) {
            await new Promise<void>((resolve, reject) => {
                this.server.close((err?: Error) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            logger.info('Server stopped gracefully');
        }
    }

    private getRoute = (req: Request): string => {
        const route = req.route ? req.route.path : '';
        const baseUrl = req.baseUrl ? req.baseUrl : '';
        return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route';
    };

    private readStats = (): object => {
        if (!FILE_PATH) return {};
        try {
            return JSON.parse(readFileSync(FILE_PATH, 'utf8'));
        } catch (err) {
            logger.error('Error reading stats file:', err);
            return {};
        }
    };

    private dumpStats = (stats: any): void => {
        if (!FILE_PATH) return;
        try {
            writeFileSync(FILE_PATH, JSON.stringify(stats), { flag: 'w+' });
        } catch (err) {
            logger.error('Error writing stats file:', err);
        }
    };
}
