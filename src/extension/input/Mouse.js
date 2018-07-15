/**
 * @name Mouse
 * @class A Mouse Device, bound to a DOM Element.
 * @description Create a new Mouse device
 * @param {Element} [element] The Element that the mouse events are attached to
 */
function Mouse(element) {
    // mouse position
    this.position = {
        x: 0,
        y: 0
    };
    // mouse wheel value
    this.wheel = 0;

    this._upHandler = this._handleUp.bind(this);
    this._downHandler = this._handleDown.bind(this);
    this._moveHandler = this._handleMove.bind(this);
    this._wheelHandler = this._handleWheel.bind(this);
    this._contextMenuHandler = function (event) { event.preventDefault(); };

    this._buttons = [false, false, false];
    this._lastbuttons = [false, false, false];

    if (element) {
        this.attach(element);
    }
}

/**
 * @function
 * @name Mouse#disableContextMenu
 * @description Disable the context menu usually activated with right-click
 */
Mouse.prototype.disableContextMenu = function () {
    if (! this._element) return;
    this._element.addEventListener("contextmenu", this._contextMenuHandler);
}

/**
 * @function
 * @name Mouse#enableContextMenu
 * @description Enable the context menu usually activated with right-click. This option is active by default.
 */
Mouse.prototype.enableContextMenu = function () {
    if (! this._element) return;
    this._element.removeEventListener("contextmenu", this._contextMenuHandler);
}

/**
 * @function
 * @name Mouse#attach
 * @description Attach the Mouse event handlers to an Element
 * @param {Element} element The element to listen for mouse events on.
 */
Mouse.prototype.attach = function(element) {
    if (this._element) {
        // remove previous attached element
        this.detach();
    }
    this._element = element;
    this._element.addEventListener("mouseup", this._upHandler, false);
    this._element.addEventListener("mousedown", this._downHandler, false);
    this._element.addEventListener("mousemove", this._moveHandler, false);
    this._element.addEventListener("mousewheel", this._wheelHandler, false); // WekKit
    this._element.addEventListener("DOMMouseScroll", this._wheelHandler, false); // Gecko
}

/**
 * @function
 * @name Mouse#detach
 * @description Detach the Mouse event handlers from the element it is attached to.
 */
Mouse.prototype.detach = function() {
    if (! this._element) return;
    this._element.removeEventListener("mouseup", this._upHandler, false);
    this._element.removeEventListener("mousedown", this._downHandler, false);
    this._element.removeEventListener("mousemove", this._moveHandler, false);
    this._element.removeEventListener("mousewheel", this._wheelHandler, false); // WekKit
    this._element.removeEventListener("DOMMouseScroll", this._wheelHandler, false); // Gecko
    this._element = null;
}

/**
 * @function
 * @name Mouse#update
 * @description Update method, should be called once per frame
 */
Mouse.prototype.update = function () {
    // Copy current button state
    this._lastbuttons[0] = this._buttons[0];
    this._lastbuttons[1] = this._buttons[1];
    this._lastbuttons[2] = this._buttons[2];
    // set wheel to 0
    this.wheel = 0;
}

/**
 * @function
 * @name Mouse#isPressed
 * @description Returns true if the mouse button is currently pressed
 * @param {pc.MOUSEBUTTON} button
 * @returns {Boolean} True if the mouse button is current pressed
 */
Mouse.prototype.isPressed = function (button) {
    return this._buttons[button];
}

/**
 * @function
 * @name Mouse#wasPressed
 * @description Returns true if the mouse button was pressed this frame (since the last call to update).
 * @param {pc.MOUSEBUTTON} button
 * @returns {Boolean} True if the mouse button was pressed since the last update
 */
Mouse.prototype.wasPressed = function (button) {
    return (this._buttons[button] && !this._lastbuttons[button]);
}

/**
 * @function
 * @name Mouse#wasReleased
 * @description Returns true if the mouse button was released this frame (since the last call to update).
 * @param {pc.MOUSEBUTTON} button
 * @returns {Boolean} True if the mouse button was released since the last update
 */
Mouse.prototype.wasReleased = function (button) {
    return (!this._buttons[button] && this._lastbuttons[button]);
}

Mouse.prototype._handleUp = function(event) {
    // disable released button
    this._buttons[event.button] = false;
}

Mouse.prototype._handleDown = function(event) {
    // Store which button has affected
    this._buttons[event.button] = true;
}

Mouse.prototype._handleMove = function(event) {
    this.position.x = event.clientX;
    this.position.y = event.clientY;
}

Mouse.prototype._handleWheel = function(event) {
    // FF uses 'detail' and returns a value in 'no. of lines' to scroll
    // WebKit and Opera use 'wheelDelta', WebKit goes in multiples of 120 per wheel notch
    if (event.detail) {
        this.wheel = -1 * event.detail;
    } else if (event.wheelDelta) {
        this.wheel = event.wheelDelta / 120;
    } else {
        this.wheel = 0;
    }
}

export {Mouse};