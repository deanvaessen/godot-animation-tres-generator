import fs from "fs-extra";
import params from "./params.json";
import { Parser } from "./parser";
import { Writer } from "./writer";


function prepareFs( output ) {

    return fs.ensureDir( output ).
        then( fs.remove( output + "/animation.tres" ) );
}


export function main() {
    const { input, output, godotResPath } = params;

    const parser = new Parser( input );
    const writer = new Writer( output, godotResPath );

    prepareFs( output )
        .then( () => parser.buildIndex( input ) )
        .then( writer.generateTres )
        .then( () => console.log( "'t was a pleasure, good chap!" ) )
        .catch( err => console.warn( err ) );
}