(function() {

    var TouchPhase = {
        BEGAN: "began",
        MOVED: "moved",
        STATIONARY: "stationary",
        ENDED: "ended",
        CANCELED: "canceled"
    }

    zen3d.TouchPhase = TouchPhase;

    /**
     * @name TouchPoint
     * @class A Touch Point.
     * @description Create a new Touch Point
     */
    var TouchPoint = function() {
        this.altitudeAngle = Math.PI / 2; // Value of 0 radians indicates that the stylus is parallel to the surface, pi/2 indicates that it is perpendicular.
        this.azimuthAngle = 0; // Value of 0 radians indicates that the stylus is pointed along the x-axis of the device.
        this.deltaPosition = {x: 0, y: 0}; // The position delta since last change.
        // this.deltaTime = 0; // TODO Amount of time that has passed since the last recorded change in Touch values.
        this.fingerId = 0; // The unique index for the touch.
        this.maximumPossiblePressure = 1.0; // The maximum possible pressure value for a platform. If Input.touchPressureSupported returns false, the value of this property will always be 1.0f.
        this.phase = ""; //	Describes the phase of the touch.
        this.position = {x: 0, y: 0}; // The position of the touch in pixel coordinates.
        this.pressure = 1.0; //	The current amount of pressure being applied to a touch. 1.0f is considered to be the pressure of an average touch. If Input.touchPressureSupported returns false, the value of this property will always be 1.0f.

        this.radius = {x: 0, y: 0}; // ADD: different from Unity
        // this.radius = 0; // DELETE: An estimated value of the radius of a touch. Add radiusVariance to get the maximum touch size, subtract it to get the minimum touch size.
        // this.radiusVariance = 0; // DELETE: The amount that the radius varies by for a touch.
        // this.rawPosition = {x: 0, y: 0}; // DELETE: The raw position used for the touch.

        // this.tapCount = 0; // TODO Number of taps.
        this.type = "Direct"; // A value that indicates whether a touch was of Direct, Indirect (or remote), or Stylus type.
    }

    TouchPoint.prototype.set = function(touch, phase) {
        this.altitudeAngle = touch.rotationAngle;
        this.azimuthAngle = touch.rotationAngle;

        if(phase === TouchPhase.BEGAN || phase === TouchPhase.STATIONARY) {
            this.deltaPosition.x = 0;
            this.deltaPosition.y = 0;
        } else {
            this.deltaPosition.x = touch.clientX - this.position.x;
            this.deltaPosition.y = touch.clientY - this.position.y;
        }

        // this.deltaTime;
        this.fingerId = touch.identifier;
        this.phase = phase;
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.pressure = touch.force;
        this.radius.x = touch.radiusX;
        this.radius.y = touch.radiusY;
        // this.tapCount;
    }

    TouchPoint._pointPool = [];

    TouchPoint.create = function() {
        return this._pointPool.pop() || new TouchPoint();
    }

    TouchPoint.release = function(touchPoint) {
        this._pointPool.push(touchPoint);
    }

    zen3d.TouchPoint = TouchPoint;

    /**
     * @name Touch
     * @class A Touch Device, bound to a DOM Element.
     * @description Create a new Touch
     * @param {Element} [element] The Element that the touch events are attached to
     */
    var Touch = function(element) {
        this._touchesMap = {};
        this._touches = [];
        this.touchCount = 0; // the count of touch points

        this._startHandler = this._handleTouchStart.bind(this);
        this._endHandler = this._handleTouchEnd.bind(this);
        this._moveHandler = this._handleTouchMove.bind(this);
        this._cancelHandler = this._handleTouchCancel.bind(this);

        if (element) {
            this.attach(element);
        }
    }

    /**
     * @function
     * @name Touch#attach
     * @description Attach the Touch event handlers to an Element
     * @param {Element} element The element to listen for touch events on.
     */
    Touch.prototype.attach = function(element) {
        if (this._element) {
            this.detach();
        }

        this._element = element;

        this._element.addEventListener('touchstart', this._startHandler, false);
        this._element.addEventListener('touchend', this._endHandler, false);
        this._element.addEventListener('touchmove', this._moveHandler, false);
        this._element.addEventListener('touchcancel', this._cancelHandler, false);
    }

    /**
     * @function
     * @name Touch#detach
     * @description Detach the Touch event handlers from the element it is attached to.
     */
    Touch.prototype.detach = function() {
        if (this._element) {
            this._element.removeEventListener('touchstart', this._startHandler, false);
            this._element.removeEventListener('touchend', this._endHandler, false);
            this._element.removeEventListener('touchmove', this._moveHandler, false);
            this._element.removeEventListener('touchcancel', this._cancelHandler, false);
        }
        this._element = null;
    }

    /**
     * @function
     * @name Touch#update
     * @description Update method, should be called once per frame
     */
    Touch.prototype.update = function () {
        for(var i in this._touchesMap) {
            var touch = this._touchesMap[i];

            if(touch.phase === TouchPhase.BEGAN) {
                touch.phase = TouchPhase.STATIONARY;
            }

            if(touch.phase === TouchPhase.ENDED || touch.phase === TouchPhase.CANCELED) {
                delete this._touchesMap[i];
                var index = this._touches.indexOf(touch);
                if(index > -1) {
                    this._touches.splice(index, 1);
                }
                this.touchCount--;
            }
        }
    }

    /**
     * @function
     * @name Touch#getTouch
     * @description get a touch by index
     */
    Touch.prototype.getTouch = function(index) {
        return this._touches[index];
    }

    Touch.prototype._getTouch = function(identifier) {
        var touchPoint = this._touchesMap[identifier];
        if(!touchPoint) {
            touchPoint = TouchPoint.create();
            this._touchesMap[identifier] = touchPoint;
            this._touches.push(touchPoint);
            this.touchCount++;
        }

        return touchPoint;
    }

    Touch.prototype._handleTouchStart = function (event) {
        for(var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var identifier = touch.identifier;
            var touchPoint = this._getTouch(identifier);

            touchPoint.set(touch, TouchPhase.BEGAN);
        }
    }

    Touch.prototype._handleTouchEnd = function (event) {
        for(var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var identifier = touch.identifier;
            var touchPoint = this._getTouch(identifier);

            touchPoint.set(touch, TouchPhase.ENDED);
        }
    }

    Touch.prototype._handleTouchMove = function (event) {
        // call preventDefault to avoid issues in Chrome Android:
        // http://wilsonpage.co.uk/touch-events-in-chrome-android/
        event.preventDefault();

        for(var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var identifier = touch.identifier;
            var touchPoint = this._getTouch(identifier);

            touchPoint.set(touch, TouchPhase.MOVED);
        }
    }

    Touch.prototype._handleTouchCancel = function (event) {
        for(var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var identifier = touch.identifier;
            var touchPoint = this._getTouch(identifier);

            touchPoint.set(touch, TouchPhase.CANCELED);
        }
    }

    zen3d.Touch = Touch;
})();