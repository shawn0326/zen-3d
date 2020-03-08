/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

var fs = require( 'fs' );
zen3d = require( '../build/zen3d.js' );

var srcFolder = __dirname + '/../examples/js/';
var dstFolder = __dirname + '/../examples/jsm/';

var files = [
	// { path: 'loaders/GLTFLoader.js', dependencies: [], ignoreList: [] },

	// { path: 'controls/FlyControls.js', dependencies: [], ignoreList: [] },
	// { path: 'controls/FreeControls.js', dependencies: [], ignoreList: [] },
	// { path: 'controls/OrbitControls.js', dependencies: [], ignoreList: [] },
];

for ( var i = 0; i < files.length; i ++ ) {

	var file = files[ i ];
	convert( file.path, file.dependencies, file.ignoreList );

}

//

function convert( path, exampleDependencies, ignoreList ) {

	var contents = fs.readFileSync( srcFolder + path, 'utf8' );

	var classNames = [];
	var coreDependencies = {};

	// imports

	// contents = contents.replace( /^\/\*+[^*]*\*+(?:[^/*][^*]*\*+)*\//, function ( match ) {

	// 	return `${match}\n\n_IMPORTS_`;

	// } );

	contents = `_IMPORTS_\n\n${contents}`;

	// class name

	contents = contents.replace( /zen3d\.([a-zA-Z0-9]+) = /g, function ( match, p1 ) {

		classNames.push( p1 );

		console.log( p1 );

		return `var ${p1} = `;

	} );

	contents = contents.replace( /(\'?)zen3d\.([a-zA-Z0-9]+)(\.{0,1})/g, function ( match, p1, p2, p3 ) {

		if ( p1 === '\'' ) return match; // Inside a string
		if ( classNames.includes( p2 ) ) return `${p2}${p3}`;

		return match;

	} );

	// methods

	contents = contents.replace( /new zen3d\.([a-zA-Z0-9]+)\(/g, function ( match, p1 ) {

		if ( ignoreList.includes( p1 ) ) return match;

		if ( p1 in zen3d ) coreDependencies[ p1 ] = true;

		return `new ${p1}(`;

	} );

	// constants

	contents = contents.replace( /(\'?)zen3d\.([a-zA-Z0-9_]+)/g, function ( match, p1, p2 ) {

		if ( ignoreList.includes( p2 ) ) return match;
		if ( p1 === '\'' ) return match; // Inside a string
		if ( classNames.includes( p2 ) ) return p2;

		if ( p2 in zen3d ) coreDependencies[ p2 ] = true;

		// console.log( match, p2 );

		return `${p2}`;

	} );

	//

	var keys = Object.keys( coreDependencies )
		.filter( value => ! classNames.includes( value ) )
		.map( value => '\n\t' + value )
		.sort()
		.toString();

	var imports = '';

	// compute path prefix for imports/exports

	var level = path.split( '/' ).length - 1;
	var pathPrefix = '../'.repeat( level );

	// core imports

	if ( keys ) imports += `import {${keys}\n} from "${pathPrefix}../../build/zen3d.module.js";`;

	// example imports

	for ( var dependency of exampleDependencies ) {

		imports += `\nimport { ${dependency.name} } from "${pathPrefix}${dependency.path}";`;

	}

	// exports

	var exports = `export { ${classNames.join( ", " )} };\n`;

	var output = contents.replace( '_IMPORTS_', imports ) + '\n' + exports;
	// console.log( output );

	fs.writeFileSync( dstFolder + path, output, 'utf-8' );

}
