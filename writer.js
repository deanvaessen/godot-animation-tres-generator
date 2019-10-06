import fs from "fs-extra";
import { isNull } from "util";

//@TODO: to separate class TresSomething
const br = "";
const getResourceDeclaration = () => "[gd_resource type=\"SpriteFrames\" load_steps=18 format=2]";
const buildResource = ( godotResPath, animation, file, i ) => {

    return `[ext_resource path="${godotResPath}/${animation}/${file}" type="Texture" id=${i + 1}]`;
};

const buildHeader = ( godotResPath, files ) => {

    return [
        getResourceDeclaration(),
        br,
        ...files.map( file => buildResource( godotResPath, file.animation, file.fileName, file.i ) )
    ];
};

const buildAnimationDefinition = ( summary ) => {
    let totalAnimationSets = [];

    for ( const animation of summary ) {
        const { name, path, animations } = animation;

        totalAnimationSets = totalAnimationSets.concat( animations );
    }

    return [
        ...totalAnimationSets.map( ( animationSet, i ) => {
            const { animations, orientation, animation } = animationSet;
            const isLast = i === animationSet.length - 1;

            return [
                "{",
                "\"frames\" : [",
                ...animations.map( ( animation, i ) => {
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

const buildBody = ( summary ) => {


    return [
        "[resource]",
        "animations = [",
        ...buildAnimationDefinition( summary ).flatMap( x => x ),
        "]"
    ];
};

export class Writer {
    constructor( output, godotResPath ) {
        this.output = output;
        this.godotResPath = godotResPath;
    }

    generateTres = ( index ) => {
        const { summary, files, orientations, animations, animationsPerOrientation } = index;
        const sections = [
            ...buildHeader( this.godotResPath, files ),
            ...buildBody( summary )
        ];

        const stream = fs.createWriteStream( "animation.tres", { flags : "a" } );
        sections.forEach( function ( item,index ) {
            stream.write( item + "\n" );
        } );
        stream.end();
    }
}