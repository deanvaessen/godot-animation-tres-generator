import through2 from "through2";
import klaw from "klaw";

import { injectable, inject } from "inversify";
import { DEPS } from "../";

import {
    IIndex,
    IFileSummary,
    IAnimationsPerOrientation,
    IAnimation,
    IParserService
} from "./Service.d";
import { ILoggerService, IConfig  } from "..";

@injectable()
export class ParserService implements IParserService {
    protected _config : IConfig
    protected _logger : ILoggerService
    protected _klaw : typeof klaw
    protected _through2 : typeof through2

    constructor(
        @inject( DEPS.Config ) config : IConfig,
        @inject( DEPS.LoggerService ) logger : ILoggerService,
        @inject( DEPS.Klaw ) Klaw : typeof klaw,
        @inject( DEPS.Through2 ) Through2 : typeof through2,
    ) {
        this._logger = logger;
        this._config = config;
        this._klaw = Klaw;
        this._through2 = Through2;
    }

    private indexSets = ( path : string ) : Promise<string[]> => {
        const excludeFilesFilter = this._through2.obj( function( item, enc, next ) : void {
            if ( item.stats.isDirectory() ) this.push( item );
            next();
        } );

        return new Promise( ( resolve, reject ) : void => {
            const hits : string[] = [];

            this._klaw( path )
                .pipe( excludeFilesFilter )
                .on( "data", ( item ) : number => hits.push( item.path ) )
                .on( "end", () : void => resolve( hits ) )
                .on( "error", ( error : Error ) : void  => reject( error ) );
        } );
    }

    private indexAnimations = ( path : string ) : Promise<string[]> => {
        const excludeDirsFilter = this._through2.obj( function( item, enc, next ) : void {
            if ( !item.stats.isDirectory() ) this.push( item );
            next();
        } );

        return new Promise( ( resolve, reject ) : void => {
            const hits : string[] = [];

            this._klaw( path )
                .pipe( excludeDirsFilter )
                .on( "data", ( item ) : number => hits.push( item.path ) )
                .on( "end", () : void => resolve( hits ) )
                .on( "error", ( error : Error ) : void  => reject( error ) );
        } );
    }

    public buildIndex = async ( path : string ) : Promise<IIndex> => {
        const removeRoot = ( animations : string[] ) : string[] => animations.splice( 1 );
        const getDirName = ( path : string ) : string => path.split( "/" ).pop() || "";
        const getFileName = ( path : string ) : string => path.split( "/" ).pop() || "";
        const getOrientation = ( name : string ) : string => name.split( "_" ).shift() || "";
        const removeExtension = ( name : string ) : string => name.split( "." ).shift() || "";
        const summariseFile = ( path : string, animation : string, i : number ) : IFileSummary => {
            const fileName = getFileName( path );
            const name = removeExtension( fileName );
            const orientation = getOrientation( name );

            return {
                i,
                path,
                name,
                fileName,
                animation,
                orientation
            };
        };

        const indexedSets = await this.indexSets( path );
        const sets = removeRoot( indexedSets  );
        const animationNames = sets.map( getDirName );
        const summary : IAnimation[] = [];
        const orientations : string[] = [];
        let totalFiles : IFileSummary[] = [];

        for await ( const path of sets ) {
            const animationName = getDirName( path );

            const files = await this.indexAnimations( path );
            const summarisedFiles : IFileSummary[] = files.map( ( file, i ) : IFileSummary => summariseFile( file, animationName, i + totalFiles.length ) );
            totalFiles = totalFiles.concat( summarisedFiles );

            for ( const file of summarisedFiles ) {
                const { orientation } = file;

                if ( !orientations.includes( orientation ) ) orientations.push( orientation );
            }

            const animationsPerOrientation = orientations.map( ( orientation ) : IAnimationsPerOrientation => {

                return {
                    animation : animationName,
                    animations : summarisedFiles.filter( ( file ) : boolean => file.orientation == orientation ),
                    orientation
                };
            } );

            summary.push( { name : animationName, path, animations : animationsPerOrientation } );
        }

        return {
            summary,
            files : totalFiles,
            orientations : orientations,
            animations : animationNames
        };
    }
}
