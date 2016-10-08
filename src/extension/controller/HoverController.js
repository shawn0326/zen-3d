(function() {
    /**
     * HoverController Class
     * @class
     */
    var HoverController = function(camera, lookAtPoint) {
        this.camera = camera;

        this.lookAtPoint = lookAtPoint;

        this.up = new zen3d.Vector3(0, 1, 0);

        this.distance = 300;

        this._panAngle = 0;
        this._panRad = 0;
        this.minPanAngle = -Infinity;
        this.maxPanAngle = Infinity;

        this._tiltAngle = 0;
        this._tiltRad = 0;
        this.minTileAngle = -90;
        this.maxTileAngle = 90;
    }

    Object.defineProperties(HoverController.prototype, {
        panAngle: {
            get: function() {
                return this._panAngle;
            },
            set: function(value) {
                this._panAngle = Math.max(this.minPanAngle, Math.min(this.maxPanAngle, value));
                this._panRad = this._panAngle * Math.PI / 180;
            }
        },
        tiltAngle: {
            get: function() {
                return this._tiltAngle;
            },
            set: function(value) {
                this._tiltAngle = Math.max(this.minTileAngle, Math.min(this.maxTileAngle, value));
                this._tiltRad = this._tiltAngle * Math.PI / 180;
            }
        }
    });

    HoverController.prototype.update = function() {
        var distanceX = this.distance * Math.sin(this._panRad) * Math.cos(this._tiltRad);
        var distanceY = this.distance * Math.sin(this._tiltRad);
        var distanceZ = this.distance * Math.cos(this._panRad) * Math.cos(this._tiltRad);

        var camera = this.camera;
        var target = this.lookAtPoint;
        camera.position.set(distanceX + target.x, distanceY + target.y, distanceZ + target.z);
        camera.setLookAt(target, this.up);
    }

    zen3d.HoverController = HoverController;
})();