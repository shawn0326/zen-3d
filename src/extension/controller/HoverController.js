(function() {
    /**
     * HoverController Class
     * @class
     */
    var HoverController = function(camera, lookAtPoint) {
        this.camera = camera;

        this.lookAtPoint = lookAtPoint;

        this.up = new zen3d.Vector3(0, 1, 0);

        this.distance = 100;

        this._panAngle = 0;
        this._panRad = 0;
        this.minPanAngle = -Infinity;
        this.maxPanAngle = Infinity;

        this._tiltAngle = 0;
        this._tiltRad = 0;
        this.minTileAngle = -90;
        this.maxTileAngle = 90;

        this.bindMouse = undefined;
        this._lastMouseX, this._lastMouseY, this._mouseDown = false;

        this.bindTouch = undefined;
        this._lastTouchX, this._lastTouchY, this._fingerTwo = false, this._lastDistance;
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
        this.bindMouse && this._updateMouse();
        this.bindTouch && this._updateTouch();

        var distanceX = this.distance * Math.sin(this._panRad) * Math.cos(this._tiltRad);
        var distanceY = this.distance * Math.sin(this._tiltRad);
        var distanceZ = this.distance * Math.cos(this._panRad) * Math.cos(this._tiltRad);

        var camera = this.camera;
        var target = this.lookAtPoint;
        camera.position.set(distanceX + target.x, distanceY + target.y, distanceZ + target.z);
        camera.lookAt(target, this.up);
    }

    HoverController.prototype._updateMouse = function() {
        var mouse = this.bindMouse;
        if(mouse.isPressed(0)) {
            if(!this._mouseDown || this._lastMouseX == undefined || this._lastMouseY == undefined) {
                this._mouseDown = true;
                this._lastMouseX = mouse.position.x;
                this._lastMouseY = mouse.position.y;
            } else {
                var moveX = mouse.position.x - this._lastMouseX;
                var moveY = mouse.position.y - this._lastMouseY;

                this.panAngle -= moveX;
                this.tiltAngle += moveY;

                this._lastMouseX = mouse.position.x;
                this._lastMouseY = mouse.position.y;
            }
        } else if(mouse.wasReleased(0)) {
            this._mouseDown = false;
        }
        this.distance = Math.max(this.distance - mouse.wheel * 2, 1);
    }

    var hVec2_1 = new zen3d.Vector2();
    var hVec2_2 = new zen3d.Vector2();

    HoverController.prototype._updateTouch = function(touch) {
        var touch = this.bindTouch;
        if(touch.touchCount > 0) {
            if(touch.touchCount == 1) {
                var _touch = touch.getTouch(0);
                if(_touch.phase == zen3d.TouchPhase.BEGAN || this._fingerTwo || this._lastTouchX == undefined || this._lastTouchY == undefined) {
                    this._lastTouchX = _touch.position.x;
                    this._lastTouchY = _touch.position.y;
                } else {
                    var moveX = _touch.position.x - this._lastTouchX;
                    var moveY = _touch.position.y - this._lastTouchY;

                    this.panAngle -= moveX * 0.5;
                    this.tiltAngle += moveY * 0.5;

                    this._lastTouchX = _touch.position.x;
                    this._lastTouchY = _touch.position.y;
                }
                this._fingerTwo = false;
            } else if(touch.touchCount == 2) {
                var _touch1 = touch.getTouch(0);
                var _touch2 = touch.getTouch(1);
                if(_touch1.phase == zen3d.TouchPhase.BEGAN || _touch2.phase == zen3d.TouchPhase.BEGAN || this._fingerTwo == false || this._lastDistance == undefined) {
                    hVec2_1.set(_touch1.position.x, _touch1.position.y);
                    hVec2_2.set(_touch2.position.x, _touch2.position.y);
                    this._lastDistance = hVec2_1.distanceTo(hVec2_2);
                } else {
                    hVec2_1.set(_touch1.position.x, _touch1.position.y);
                    hVec2_2.set(_touch2.position.x, _touch2.position.y);
                    var distance = hVec2_1.distanceTo(hVec2_2);

                    var deltaDistance = distance - this._lastDistance;

                    this.distance = Math.max(this.distance - deltaDistance, 1);

                    this._lastDistance = distance;
                }
                this._fingerTwo = true;
            } else {
                this._fingerTwo = false;
            }
        }
    }

    zen3d.HoverController = HoverController;
})();