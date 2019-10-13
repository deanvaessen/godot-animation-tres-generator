import fs from "fs-extra";

import { injectable, inject } from "inversify";
import { DEPS } from "../";

import {
    IGeneratorService
} from "./Service.d";
import {
    ILoggerService,
    IConfig,
    IIndex,
    IFileSummary,
    IAnimationsPerOrientation,
    IAnimation,
} from "..";

@injectable()
export class GeneratorService implements IGeneratorService {
    protected _config : IConfig
    protected _logger : ILoggerService
    protected _fs : typeof fs
    protected _br = "";

    constructor(
        @inject( DEPS.Config ) config : IConfig,
        @inject( DEPS.LoggerService ) logger : ILoggerService,
        @inject( DEPS.Fs ) Fs : typeof fs,
    ) {
        this._logger = logger;
        this._config = config;
        this._fs = Fs;
    }

    private getResourceDeclaration = () : string => "[gd_resource type=\"SpriteFrames\" load_steps=18 format=2]";
    private buildResource = ( godotResPath : string, animation : string, file : string, i : number ) : string => {

        return `[ext_resource path="${godotResPath}/${animation}/${file}" type="Texture" id=${i + 1}]`;
    };

    private buildHeader = ( godotResPath : string, files : IFileSummary[] ) : string[] => {

        return [
            this.getResourceDeclaration(),
            this._br,
            ...files.map( ( file ) : string => this.buildResource( godotResPath, file.animation, file.fileName, file.i ) )
        ];
    };

    private getFrame = ( name : string ) : number => Number( name.split( "_" ).pop() );
    private sortAnimations = ( animations : IFileSummary[] ) : IFileSummary[] => animations.sort( ( a, b ) : number => this.getFrame( a.name ) - this.getFrame( b.name ) );
    private buildAnimationDefinition = ( summary : IAnimation[] ) : string[][] => {
        let totalAnimationSets : IAnimationsPerOrientation[] = [];

        for ( const animation of summary ) {
            const { animations } = animation;

            totalAnimationSets = totalAnimationSets.concat( animations );
        }

        return [
            ...totalAnimationSets.map( ( animationSet, i ) : string[] => {
                const { animations, orientation, animation } = animationSet;
                const isLast = i === totalAnimationSets.length - 1;

                return [
                    "{",
                    "\"frames\" : [",
                    ...this.sortAnimations( animations ).map( ( animation, i ) : string => {
                        const isLast = i === animations.length - 1;

                        return `ExtResource( ${animation.i + 1} ) ${!isLast ? "," : ""}`;
                    } ),
                    "],",
                    "\"loop\" : true,",
                    `"name": "${animation}_${orientation}",`,
                    "\"speed\": 5.0",
                    `}${!isLast ? "," : ""}`,
                ];
            } )
        ];
    };

    private buildBody = ( summary : IAnimation[] ) : string[] => {

        return [
            "[resource]",
            "animations = [",
            ...this.buildAnimationDefinition( summary ).flatMap( ( x : any ) : any => x ),
            "]"
        ];
    };

    public generateTres = ( index : IIndex, godotResPath : string, outputTresPath : string ) : void => {
        const { summary, files } = index;
        const sections = [
            ...this.buildHeader( godotResPath, files ),
            ...this.buildBody( summary )
        ];

        const stream = fs.createWriteStream( outputTresPath, { flags : "a" } );
        sections.forEach( ( item ) : void => {
            stream.write( item + "\n" );
        } );
        stream.end();
    }
}
