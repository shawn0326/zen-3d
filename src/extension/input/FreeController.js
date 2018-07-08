(function() {
    /**
     * FreeController Class
     * @class
     */
    var FreeController = function(camera) {
        this.camera = camera;
        this.camera.euler.order = 'YXZ'; // the right order?

        this.bindKeyboard = undefined;
        this.bindMouse = undefined;
        this._lastMouseX, this._lastMouseY, this._mouseDown = false;

        this._lastPosition = new zen3d.Vector3();
        this._lastQuaternion = new zen3d.Quaternion();
    }

    var EPS = 0.000001;

    FreeController.prototype.update = function() {
        this.bindKeyboard && this.keyboardUpdate();
        this.bindMouse && this.mouseUpdate();

        var camera = this.camera;

        if(
            this._lastPosition.distanceToSquared(camera.position) > EPS ||
            8 * ( 1 - this._lastQuaternion.dot( camera.quaternion ) ) > EPS
        ) {
            this._lastPosition.copy(camera.position);
            this._lastQuaternion.copy(camera.quaternion);
            return true;
        }
        return false;
    }

    var forward = new zen3d.Vector3();
    var up = new zen3d.Vector3();
    var right = new zen3d.Vector3();

    FreeController.prototype.keyboardUpdate = function() {
        var keyboard = this.bindKeyboard;

        forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
        up.set(0, 1, 0).applyQuaternion(this.camera.quaternion);
        right.set(1, 0, 0).applyQuaternion(this.camera.quaternion);

        if(keyboard.isPressed("W")) {
            this.camera.position.add(forward);
        }
        if(keyboard.isPressed("A")) {
            this.camera.position.sub(right);
        }
        if(keyboard.isPressed("S")) {
            this.camera.position.sub(forward);
        }
        if(keyboard.isPressed("D")) {
            this.camera.position.add(right);
        }
        if(keyboard.isPressed("E")) {
            this.camera.position.add(up);
        }
        if(keyboard.isPressed("Q")) {
            this.camera.position.sub(up);
        }
    }

    FreeController.prototype.mouseUpdate = function() {
        var mouse = this.bindMouse;

        if(mouse.isPressed(0)) {
            if(!this._mouseDown || this._lastMouseX == undefined || this._lastMouseY == undefined) {
                this._mouseDown = true;
                this._lastMouseX = mouse.position.x;
                this._lastMouseY = mouse.position.y;
            } else {
                var moveX = mouse.position.x - this._lastMouseX;
                var moveY = mouse.position.y - this._lastMouseY;

                this.camera.euler.x -= moveY * 0.01;
                this.camera.euler.y -= moveX * 0.01;

                this._lastMouseX = mouse.position.x;
                this._lastMouseY = mouse.position.y;
            }
        } else if(mouse.wasReleased(0)) {
            this._mouseDown = false;
        }
        if(mouse.wheel !== 0) {
            forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion).multiplyScalar(mouse.wheel);
            this.camera.position.add(forward);
        }
    }

    zen3d.FreeController = FreeController;
})();