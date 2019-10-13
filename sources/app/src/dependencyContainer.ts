import { Container } from "inversify";

import * as path from "path";
import fs from "fs-extra";
import klaw from "klaw";
import through2 from "through2";
import chokidar from "chokidar";

import { DEPS, ILoggerService, IParserService, IProducerService, IWatcherService, IGeneratorService } from "./components";
import { LoggerService, ParserService, ProducerService, WatcherService, GeneratorService } from "./components";

const dependencyContainer = new Container();
dependencyContainer.bind<ILoggerService>( DEPS.LoggerService ).to( LoggerService );
dependencyContainer.bind<IParserService>( DEPS.ParserService ).to( ParserService );
dependencyContainer.bind<IProducerService>( DEPS.ProducerService ).to( ProducerService );
dependencyContainer.bind<IGeneratorService>( DEPS.GeneratorService ).to( GeneratorService );
dependencyContainer.bind<IWatcherService>( DEPS.WatcherService ).to( WatcherService );
dependencyContainer.bind<typeof fs>( DEPS.Fs ).toConstantValue( fs );
dependencyContainer.bind<typeof path>( DEPS.Path ).toConstantValue( path );
dependencyContainer.bind<typeof klaw>( DEPS.Klaw ).toConstantValue( klaw );
dependencyContainer.bind<typeof through2>( DEPS.Through2 ).toConstantValue( through2 );
dependencyContainer.bind<typeof chokidar>( DEPS.Chokidar ).toConstantValue( chokidar );

/*
    Note on binding:
    toSelf() is without a manually written type, example:
        dependencyContainer.bind<Logger>( Logger ).toSelf();
*/

export { dependencyContainer };