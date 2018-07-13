import {Geometry} from './Geometry.js';

function InstancedGeometry() {

    Geometry.call( this );

    this.maxInstancedCount = undefined;

}

InstancedGeometry.prototype = Object.assign( Object.create( Geometry.prototype ), {

    constructor: InstancedGeometry,

    isInstancedGeometry: true

});

export {InstancedGeometry};