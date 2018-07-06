(function() {
    function InstancedInterleavedBuffer(array, itemSize, meshPerAttribute) {

        zen3d.InterleavedBuffer.call( this, array, itemSize );

        this.meshPerAttribute = meshPerAttribute || 1;

    }

    InstancedInterleavedBuffer.prototype = Object.assign( Object.create( zen3d.InterleavedBuffer.prototype ), {

        constructor: InstancedInterleavedBuffer,

        isInstancedInterleavedBuffer: true
    
    });

    zen3d.InstancedInterleavedBuffer = InstancedInterleavedBuffer;
})();