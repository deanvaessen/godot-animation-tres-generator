/*******************************
 * [logger.ts]
 * Unified logging entry-point for the application
 *
 ******************************/
import { injectable, inject } from "inversify";
import { DEPS } from "../";
import { ILoggerService } from ".";

import fs from "fs";

@injectable()
export class LoggerService implements ILoggerService {
    protected _fs : typeof fs

    constructor(
        @inject( DEPS.Fs ) Fs : typeof fs
    ) {
        this._fs = Fs;
    }

    public log( level : string, message : string, attachment ? : object ) : void {
        switch ( level ) {
            case "info":
                console.info( `ℹ️\tINFO: ${message}` );
                if ( attachment ) console.info( "↪\t", attachment );

                break;
            case "warning":
                console.warn( `\n⚠️\tWARNING: ${message}\n` );
                if ( attachment ) console.warn( "↪\t", attachment );

                break;

            case "success":
                console.info( `🎉\tSUCCESS: ${message}\t🎉` );
                if ( attachment ) console.info( "↪\t", attachment );

                break;

            case "exception":
            // Used for times when you do not want the application to throw
                console.warn( `\n❌\tEXCEPTION: ${message}\t❌\n` );
                console.warn( "↪\t", attachment || "No full error provided" );
                break;

            default:
                console.log( message );
                break;
        }
    }

    public persist( level : string, message : string ) : void {
        const stream = this._fs.createWriteStream( `${level}.txt`, { flags : "a" } );

        this.log( "info", "Persisting a message..." );

        stream.write( `\r\n---${level.toUpperCase()} @ ${new Date( Date.now() )}---\r\n` );
        stream.write( message.toString() );
    }
}
