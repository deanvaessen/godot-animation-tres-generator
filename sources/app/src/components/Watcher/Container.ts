import { Container, injectable, inject } from "inversify";
import { WatcherService } from ".";
import { DEPS, ILoggerService } from "../";

@injectable()
export class WatcherContainer {
    protected _logger : ILoggerService
    protected _dependencyContainer : Container

    constructor (
        @inject( DEPS.LoggerService ) logger : ILoggerService,
        @inject( DEPS.DependencyContainer ) dependencyContainer : Container,
    ) {
        this._logger = logger;
        this._dependencyContainer = dependencyContainer;

        this.init();
    }

    private init() : void {
        this._logger.log( "info", "Initialising watcher container" );

        const watcher = this._dependencyContainer.resolve<WatcherService>( WatcherService );
        watcher.init();
    }
}