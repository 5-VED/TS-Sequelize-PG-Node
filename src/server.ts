import App from './app';
import logger from './Config/Logger';
const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`App exiting due to an unhandled promise: ${JSON.stringify(promise)} and reason: ${reason}`);
});

process.on('uncaughtException', error => {
    logger.error(`App exiting due to an uncaught exception: ${error}`);    
    process.exit(1);        
});

(async (): Promise<void> => {
    try {        
        const server = new App();
        await server.initialize();
        server.start();
        

        for (const exitSignal of exitSignals) {
            process.on(exitSignal, async () => {
                try {
                    await server.disconnect();
                    logger.info(`App exited with success`);
                    process.exit(1);
                } catch (error) {
                    logger.error(`App exited with error: ${error}`);
                    process.exit(0);
                }
            });
        }
    } catch (error) {
        logger.error(`App exited with error: ${error}`);
        process.exit(1);
    }
})();



