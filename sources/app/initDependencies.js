// We need to have these dependencies loaded before the application starts

require( "reflect-metadata" );

// Init Babel
require( "@babel/register" );
require( "@babel/polyfill" );

// Now start through the entry file
require( "./src/entry.ts" );
