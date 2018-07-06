(function() {
    function InstancedGeometry() {

        zen3d.Geometry.call( this );

        this.maxInstancedCount = undefined;

    }

    InstancedGeometry.prototype = Object.assign( Object.create( zen3d.Geometry.prototype ), {

        constructor: InstancedGeometry,

        isInstancedGeometry: true
    
    });

    zen3d.InstancedGeometry = InstancedGeometry;
})();