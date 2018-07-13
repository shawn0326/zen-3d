(function() {

    // imports
    var Camera = zen3d.Camera;
    var Matrix4 = zen3d.Matrix4;
    var Vector2 = zen3d.Vector2;

    function LightShadow() {
        this.camera = new Camera();
        this.matrix = new Matrix4();

        this.bias = 0.0003;
	    this.radius = 2;

        this.cameraNear = 1;
        this.cameraFar = 500;

        this.mapSize = new Vector2(512, 512);

        this.renderTarget = null;
        this.map = null;
    }

    LightShadow.prototype = Object.assign(LightShadow.prototype, {

        update: function(light, face) {

        },

        copy: function(source) {
            this.camera.copy(source.camera);
            this.matrix.copy(source.matrix);
    
            this.bias = source.bias;
            this.radius = source.radius;
    
            this.cameraNear = source.cameraNear;
            this.cameraFar = source.cameraFar;
    
            this.mapSize.copy(source.mapSize);
    
            return this;
        },

        clone: function() {
            return new this.constructor().copy( this );
        }

    });

    // exports
    zen3d.LightShadow = LightShadow;
    
})();