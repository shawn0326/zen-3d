import {InterleavedBuffer} from './InterleavedBuffer.js';

function InstancedInterleavedBuffer(array, itemSize, meshPerAttribute) {

    InterleavedBuffer.call( this, array, itemSize );

    this.meshPerAttribute = meshPerAttribute || 1;

}

InstancedInterleavedBuffer.prototype = Object.assign( Object.create( InterleavedBuffer.prototype ), {

    constructor: InstancedInterleavedBuffer,

    isInstancedInterleavedBuffer: true

});

export {InstancedInterleavedBuffer};