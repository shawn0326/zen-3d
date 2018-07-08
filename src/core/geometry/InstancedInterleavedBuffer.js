(function() {

    // imports
    var InterleavedBuffer = zen3d.InterleavedBuffer;

    function InstancedInterleavedBuffer(array, itemSize, meshPerAttribute) {

        InterleavedBuffer.call( this, array, itemSize );

        this.meshPerAttribute = meshPerAttribute || 1;

    }

    InstancedInterleavedBuffer.prototype = Object.assign( Object.create( InterleavedBuffer.prototype ), {

        constructor: InstancedInterleavedBuffer,

        isInstancedInterleavedBuffer: true
    
    });

    // exports
    zen3d.InstancedInterleavedBuffer = InstancedInterleavedBuffer;
    
})();