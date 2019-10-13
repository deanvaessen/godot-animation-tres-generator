/**
 * App.ts
 *
 * Main instantiation of the application is done here
 */

import fs from "fs-extra";
import { DEPS, IConfig, ILoggerService, WatcherContainer } from "../";
import { inject, injectable, Container } from "inversify";

import { IApp } from "./";



@injectable()
export class App implements IApp {
    protected _dependencyContainer : Container
    protected _logger : ILoggerService
    protected _fs : typeof fs
    protected _config : IConfig

    constructor (
        @inject( DEPS.LoggerService ) logger : ILoggerService,
        @inject( DEPS.DependencyContainer ) dependencyContainer : Container,
        @inject( DEPS.Fs ) Fs : typeof fs,
        @inject( DEPS.Config ) config : IConfig
    ) {
        this._logger = logger;
        this._dependencyContainer = dependencyContainer;
        this._fs = Fs;
        this._config = config;

        this.init();
    }

    // Some components need to be initiated, we do this by spinning up their containers.
    private init = () : void => {
        /*eslint-disable*/
        /*
            process.on( "unhandledRejection", ( reason : any, promise : Promise<any> ) : void => {
                console.log( "Unhandled Rejection at:", reason.stack || reason );
            } );
        */
        /*eslint-enable*/

        this._dependencyContainer.resolve<WatcherContainer>( WatcherContainer );
    };
}
