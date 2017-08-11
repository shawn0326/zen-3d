(function() {

    var _keyCodeToKeyIdentifier = {
        'TAB': 9,
        'ENTER': 13,
        'SHIFT': 16,
        'CONTROL': 17,
        'ALT': 18,
        'ESCAPE': 27,

        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40,

        'DELETE': 46,

        'WIN': 91
    };

    function toKeyCode(s){
        if (typeof(s) == "string") {
            s = s.toUpperCase();
            return _keyCodeToKeyIdentifier[s] || s.charCodeAt(0);
        }
        else {
            return s;
        }
    }

    function toKeyIdentifier(keyCode) {
        keyCode = toKeyCode(keyCode);
        var count;
        var hex;
        var length;

        // Convert to hex and add leading 0's
        hex = keyCode.toString(16).toUpperCase();
        length = hex.length;
        for (count = 0; count < (4 - length); count++) {
            hex = '0' + hex;
        }

        return 'U+' + hex;
    }

    /**
     * @name Keyboard
     * @class A Keyboard device bound to an Element. Allows you to detect the state of the key presses.
     * Note, Keyboard object must be attached to an Element before it can detect any key presses.
     * @description Create a new Keyboard object
     * @param {Element} [element] Element to attach Keyboard to. Note that elements like &lt;div&gt; can't
     * accept focus by default. To use keyboard events on an element like this it must have a value of 'tabindex' e.g. tabindex="0". For more details: <a href="http://www.w3.org/WAI/GL/WCAG20/WD-WCAG20-TECHS/SCR29.html">http://www.w3.org/WAI/GL/WCAG20/WD-WCAG20-TECHS/SCR29.html</a>
     * @param {Object} [options]
     * @param {Boolean} [options.preventDefault] Call preventDefault() in key event handlers. This stops the default action of the event occuring. e.g. Ctrl+T will not open a new browser tab
     * @param {Boolean} [options.stopPropagation] Call stopPropagation() in key event handlers. This stops the event bubbling up the DOM so no parent handlers will be notified of the event
     * @example
     * var keyboard = new Keyboard(window); // attach keyboard listeners to the window
     */
    var Keyboard = function(element, options) {
        options = options || {};
        this._element = null;

        this._keyDownHandler = this._handleKeyDown.bind(this);
        this._keyUpHandler = this._handleKeyUp.bind(this);
        this._keyPressHandler = this._handleKeyPress.bind(this);

        this._keymap = {};
        this._lastmap = {};

        if (element) {
            this.attach(element);
        }

        this.preventDefault = options.preventDefault || false;
        this.stopPropagation = options.stopPropagation || false;
    }

    /**
     * @function
     * @name Keyboard#attach
     * @description Attach the keyboard event handlers to an Element
     * @param {Element} element The element to listen for keyboard events on.
     */
    Keyboard.prototype.attach = function(element) {
        if (this._element) {
            // remove previous attached element
            this.detach();
        }
        this._element = element;
        this._element.addEventListener("keydown", this._keyDownHandler, false);
        this._element.addEventListener("keypress", this._keyPressHandler, false);
        this._element.addEventListener("keyup", this._keyUpHandler, false);
    };

    /**
     * @function
     * @name Keyboard#detach
     * @description Detach the keyboard event handlers from the element it is attached to.
     */
    Keyboard.prototype.detach = function() {
        this._element.removeEventListener("keydown", this._keyDownHandler);
        this._element.removeEventListener("keypress", this._keyPressHandler);
        this._element.removeEventListener("keyup", this._keyUpHandler);
        this._element = null;
    };

    Keyboard.prototype._handleKeyDown = function(event) {
        var code = event.keyCode || event.charCode;
        var id = toKeyIdentifier(code);

        this._keymap[id] = true;

        if (this.preventDefault) {
            event.preventDefault();
        }
        if (this.stopPropagation) {
            event.stopPropagation();
        }
    }

    Keyboard.prototype._handleKeyUp = function(event) {
        var code = event.keyCode || event.charCode;
        var id = toKeyIdentifier(code);

        delete this._keymap[id];

        if (this.preventDefault) {
            event.preventDefault();
        }
        if (this.stopPropagation) {
            event.stopPropagation();
        }
    }

    Keyboard.prototype._handleKeyPress = function(event) {
        var code = event.keyCode || event.charCode;
        var id = toKeyIdentifier(code);

        // do nothing

        if (this.preventDefault) {
            event.preventDefault();
        }
        if (this.stopPropagation) {
            event.stopPropagation();
        }
    }

    /**
     * @function
     * @name Keyboard#update
     * @description Called once per frame to update internal state.
     */
    Keyboard.prototype.update = function () {
        var prop;

        // clear all keys
        for (prop in this._lastmap) {
            delete this._lastmap[prop];
        }

        for(prop in this._keymap) {
            if(this._keymap.hasOwnProperty(prop)) {
                this._lastmap[prop] = this._keymap[prop];
            }
        }
    }

    /**
     * @function
     * @name Keyboard#isPressed
     * @description Return true if the key is currently down.
     * @param {Number} key The keyCode of the key to test.
     * @return {Boolean} True if the key was pressed, false if not.
     */
    Keyboard.prototype.isPressed = function (key) {
        var id = toKeyIdentifier(key);

        return !!(this._keymap[id]);
    }

    /**
     * @function
     * @name Keyboard#wasPressed
     * @description Returns true if the key was pressed since the last update.
     * @param {Number} key The keyCode of the key to test.
     * @return {Boolean} true if the key was pressed.
     */
    Keyboard.prototype.wasPressed = function (key) {
        var id = toKeyIdentifier(key);

        return (!!(this._keymap[id]) && !!!(this._lastmap[id]));
    };

    /**
     * @function
     * @name Keyboard#wasReleased
     * @description Returns true if the key was released since the last update.
     * @param {Number} key The keyCode of the key to test.
     * @return {Boolean} true if the key was pressed.
     */
    Keyboard.prototype.wasReleased = function (key) {
        var id = toKeyIdentifier(keyCode);

        return (!!!(this._keymap[id]) && !!(this._lastmap[id]));
    };

    zen3d.Keyboard = Keyboard;
})();
(function() {
    /**
     * @name Mouse
     * @class A Mouse Device, bound to a DOM Element.
     * @description Create a new Mouse device
     * @param {Element} [element] The Element that the mouse events are attached to
     */
    var Mouse = function(element) {
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

    zen3d.Mouse = Mouse;
})();