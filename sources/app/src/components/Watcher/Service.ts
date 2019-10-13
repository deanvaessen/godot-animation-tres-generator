import fs from "fs-extra";
import chokidar from "chokidar";

import { injectable, inject } from "inversify";
import { DEPS } from "../";

import {
    IWatcherService,
    IUpdateLog
} from "./Service.d";
import {
    ILoggerService,
    IProducerService,
    IConfig,
} from "..";

@injectable()
export class WatcherService implements IWatcherService {
    protected _config : IConfig
    protected _logger : ILoggerService
    protected _producerService : IProducerService
    protected _fs : typeof fs
    protected _chokidar : typeof chokidar
    protected _updateLog : IUpdateLog = {}

    constructor(
        @inject( DEPS.Config ) config : IConfig,
        @inject( DEPS.LoggerService ) logger : ILoggerService,
        @inject( DEPS.ProducerService ) ProducerService : IProducerService,
        @inject( DEPS.Fs ) Fs : typeof fs,
        @inject( DEPS.Chokidar ) Chokidar : typeof chokidar,
    ) {
        this._logger = logger;
        this._config = config;
        this._fs = Fs;
        this._chokidar = Chokidar;
        this._producerService = ProducerService;
    }

    //

    // from: "/usr/app/input/mcv/renders/tests/animations/moving/10_000.png" has been added
    // to: "mcv"
    //@ts-ignore
    private getInputSubdir = ( path : string ) : string => path.split( "/input/" ).pop().split( "/" ).shift() || ""
    private getAbsoluteInputSubDir = ( path : string ) : string => {
        const header = path.split( "/input/" )[0];
        const subDir = path.split( "/input/" )[1].split( "/" ).shift();

        return header + "/input/" + subDir;
    }

    public init = () : void => {
        const { rootDir } = this._config;

        const watchDir = rootDir + "/input/mcv/";

        // Initialize watcher.
        const watcher = this._chokidar.watch( watchDir, {
            ignored : /(^|[\/\\])\../, // ignore dotfiles
            persistent : true,
            usePolling : true
        } );

        console.log( "Watching ", watchDir );

        // Something to use when events are received.
        const log = console.log.bind( console );
        let isInitialising = true;

        // Add event listeners.
        watcher
            .on( "add", ( path ) : void => {
                if ( isInitialising ) return;

                log( `File ${path} has been added` );
                this.onUpdate( path );
            }  )
            .on( "change", ( path ) : void => {
                if ( isInitialising ) return;

                log( `File ${path} has been changed` );
                this.onUpdate( path );
            }  )
            .on( "unlink", ( path ) : void => {
                if ( isInitialising ) return;

                log( `File ${path} has been removed` );
                this.onUpdate( path );
            }  )
            .on( "ready", () : void => {
                isInitialising = false;
                log( "Initial scan complete. Ready for changes" );
            } );
    }

    private recordUpdate = ( subDir : string ) : number => {
        if ( !this._updateLog[subDir] ) this._updateLog[subDir] = 1;
        else ++this._updateLog[ subDir ];

        return this._updateLog[ subDir ];
    }

    private getUpdateCount = ( subDir : string ) : number | undefined => this._updateLog[subDir]

    private onUpdate = ( path : string ) : void => {
        const inputSubDir = this.getAbsoluteInputSubDir( path );

        const count = this.recordUpdate( inputSubDir );

        // If no changes for n milliseconds, then request a new job.
        //@TODO: If new job meanwhile, cancel old?
        const updateTimeout = 2000;
        setTimeout( () : void => {
            const newCount = this.getUpdateCount( inputSubDir );

            // Someone else called again for this dir, let him continue
            if ( newCount !== count ) return;

            this.update( inputSubDir );
        }, updateTimeout );
    }

    private update = ( dir : string ) : void => {
        console.log( "updated warranted for ", dir );

        this._producerService.produce( dir );
    }
}
