(function() {
    var LightShadow = function() {
        this.camera = new zen3d.Camera();
        this.matrix = new zen3d.Matrix4();

        this.bias = 0.0003;
	    this.radius = 2;

        this.cameraNear = 1;
        this.cameraFar = 500;

        this.mapSize = new zen3d.Vector2(512, 512);

        this.renderTarget = null;
        this.map = null;
    }

    LightShadow.prototype.update = function(light, face) {

    }

    LightShadow.prototype.copy = function(source) {
        this.camera.copy(source.camera);
        this.matrix.copy(source.matrix);

        this.bias = source.bias;
        this.radius = source.radius;

        this.cameraNear = source.cameraNear;
        this.cameraFar = source.cameraFar;

        this.mapSize.copy(source.mapSize);

        return this;
    }

    LightShadow.prototype.clone = function() {
        return new this.constructor().copy( this );
    }

    zen3d.LightShadow = LightShadow;
})();