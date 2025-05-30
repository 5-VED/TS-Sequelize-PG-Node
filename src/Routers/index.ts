import { IRoutes } from '@/Common/interfaces/IRoutes';
// import { RoutesConfig } from '@common/RoutesConfig';

import  logger  from '../Config/Logger';
import { Application, Router } from 'express';

import UserRoutes from './User.routes';

export class IndexRoute implements IRoutes {
    public router = Router({ mergeParams: true });    
    constructor(app: Application) {
        this.initializeRoutes(app);
    }

    private initializeRoutes(app: Application) {

        this.router.use('/user',UserRoutes); 
        
        logger.info('Routes initiated...');

        // this.routerArray.forEach((route: any) => {
        //     logger.debug(`Routes configured for ${route.getName()}`);
        // });
    }
}
