import express from 'express';
export abstract class RoutesConfig {
    app: express.Application;
    name: string;
    path: string;
    rootPath = '/api';

    constructor(app: express.Application, path: string, name: string) {
        this.app = app;
        this.path = `${this.rootPath}/${path}`;
        this.name = name;
        this.configureRoutes();
    }
    getName(): string {
        return this.name;
    }
    abstract configureRoutes(): express.Application;
}
