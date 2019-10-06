import through2 from "through2";
import klaw from "klaw";

export class Parser {
    constructor( input ) {
        this.input = input;
    }

    indexSets = ( path ) => {
        const excludeFilesFilter = through2.obj( function ( item, enc, next ) {
            if ( item.stats.isDirectory() ) this.push( item );
            next();
        } );

        return new Promise( ( resolve, reject ) => {
            const hits = [];

            klaw( path )
                .pipe( excludeFilesFilter )
                .on( "data", item => hits.push( item.path ) )
                .on( "end", () => resolve( hits ) )
                .on( "error", error => reject( error ) );
        } );
    }

    indexAnimations = ( path ) => {
        const excludeDirsFilter = through2.obj( function ( item, enc, next ) {
            if ( !item.stats.isDirectory() ) this.push( item );
            next();
        } );

        return new Promise( ( resolve, reject ) => {
            const hits = [];

            klaw( path )
                .pipe( excludeDirsFilter )
                .on( "data", item => hits.push( item.path ) )
                .on( "end", () => resolve( hits ) )
                .on( "error", error => reject( error ) );
        } );
    }

    async buildIndex() {
        const removeRoot = animations => animations.splice( 1 );
        const getDirName = path => path.split( "\\" ).pop();
        const getFileName = path => path.split( "\\" ).pop();
        const getOrientation = name => name.split( "_" ).shift();
        const removeExtension = name => name.split( "." ).shift();
        const summariseFile = ( path, animation, i ) => {
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

        const sets = removeRoot( await this.indexSets( this.input ) );
        const animationNames = sets.map( getDirName );
        const summary = [];
        let totalFiles = [];
        let orientations;

        for await ( const path of sets ) {
            const animationName = getDirName( path );
            let files = await this.indexAnimations( path );
            files = files.map( ( file, i ) => summariseFile( file, animationName, i + totalFiles.length ) );
            totalFiles = totalFiles.concat( files );

            orientations = files.reduce( ( total, current ) => {
                const { orientation } = current;

                if ( !total.includes( orientation ) ) total.push( orientation );

                return total;
            }, [] );

            const animationsPerOrientation = orientations.map( orientation => {

                return {
                    animation : animationName,
                    animations : files.filter( file => file.orientation == orientation ),
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