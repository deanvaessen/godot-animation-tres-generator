/**
 * index.js
 *
 * Actual entry point for the application
 */

import * as path from "path";
import { dependencyContainer } from "./dependencyContainer";
import { App, DEPS, IConfig } from "./components";
import { Container } from "inversify";

/*eslint-disable*/
let config = require( `../config/${process.env.NODE_ENV}.json` );
config.rootDir = path.resolve( path.join( __dirname, '..' ) );
config.input = path.resolve( path.join( __dirname, '../input' ) );
config.output = path.resolve( path.join( __dirname, '../output' ) );
dependencyContainer.bind<IConfig>( DEPS.Config ).toConstantValue( config );
/*eslint-enable*/

dependencyContainer.bind<Container>( DEPS.DependencyContainer ).toConstantValue( dependencyContainer );

// Init app
dependencyContainer.resolve<App>( App );