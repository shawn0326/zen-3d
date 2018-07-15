import {Object2D} from './Object2D.js';

function Sprite2D() {
    Object2D.call(this);

    this.texture = null;
}

Sprite2D.prototype = Object.create(Object2D.prototype);
Sprite2D.prototype.constructor = Sprite2D;

export {Sprite2D};