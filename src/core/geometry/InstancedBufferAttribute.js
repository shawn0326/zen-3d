(function() {
    function InstancedBufferAttribute(array, itemSize, meshPerAttribute) {

        zen3d.BufferAttribute.call( this, array, itemSize );

        this.meshPerAttribute = meshPerAttribute || 1;

    }

    InstancedBufferAttribute.prototype = Object.assign( Object.create( zen3d.BufferAttribute.prototype ), {

        constructor: InstancedBufferAttribute,

        isInstancedBufferAttribute: true
    
    });

    zen3d.InstancedBufferAttribute = InstancedBufferAttribute;
})();