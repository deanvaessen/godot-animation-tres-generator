import fs from "fs-extra";

import { injectable, inject, Container } from "inversify";
import { DEPS, GeneratorService, ParserService } from "../";

import {
    IProducerService
} from "./Service.d";
import {
    ILoggerService,
    IConfig,
    IIndex
} from "..";

import { IJob } from "..";

@injectable()
export class ProducerService implements IProducerService {
    protected _config : IConfig
    protected _logger : ILoggerService
    protected _fs : typeof fs
    protected _dependencyContainer : Container

    constructor(
        @inject( DEPS.Config ) config : IConfig,
        @inject( DEPS.LoggerService ) logger : ILoggerService,
        @inject( DEPS.DependencyContainer ) dependencyContainer : Container,
        @inject( DEPS.Fs ) Fs : typeof fs,
    ) {
        this._logger = logger;
        this._config = config;
        this._dependencyContainer = dependencyContainer;
        this._fs = Fs;
    }

    public produce = async ( path : string ) : Promise<void> => {
        const job : IJob = await this.getJob( path );

        this.runJob( path, job );
    }

    private runJob = ( path : string, job : IJob ) : void => {
        let { output_frames, godot_res_path, output_tres, input_folder, animations } = job;
        const { input, output } = this._config;

        // Make absolute
        input_folder = `${input}/${input_folder}`;
        output_tres = `${output}/${output_tres}`;

        const parser = this._dependencyContainer.resolve<ParserService>( ParserService );
        const generator = this._dependencyContainer.resolve<GeneratorService>( GeneratorService );

        this.removeTres( output_tres )
            .then( () : Promise<IIndex> => parser.buildIndex( input_folder ) )
            .then( ( index : IIndex ) : void => generator.generateTres( index, godot_res_path, output_tres ),  )
            //@TODO: copy the images over, remove old images
            .then( () : void => console.log( "'t was a pleasure, good chap!" ) )
            .catch( ( err : Error ) : void => console.warn( err ) );
    }

    private removeTres = ( path : string ) : Promise<void> => {
        return this._fs.remove( path );

        /*
        return this._fs.ensureDir( path )
            .then( () : Promise<void> => this._fs.remove( path ) );
        */
    }

    private getJob = ( path : string ) : Promise<IJob> => {

        return this._fs.readJson( path + "/job.json" )
            .catch( ( err ) : void=> {
                console.error( err );
            } );
    }
}