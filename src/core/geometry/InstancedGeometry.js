(function() {

    // imports
    var Geometry = zen3d.Geometry;

    function InstancedGeometry() {

        Geometry.call( this );

        this.maxInstancedCount = undefined;

    }

    InstancedGeometry.prototype = Object.assign( Object.create( Geometry.prototype ), {

        constructor: InstancedGeometry,

        isInstancedGeometry: true
    
    });

    // exports
    zen3d.InstancedGeometry = InstancedGeometry;
    
})();