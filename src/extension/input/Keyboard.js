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
function Keyboard(element, options) {
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

export {Keyboard};