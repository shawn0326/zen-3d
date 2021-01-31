/**
 * Sprite2D
 */


import { Object2D } from "../canvas2d/Object2D.js";

var Sprite2D = function() {
	Object2D.call(this);
	this._texture = null;
}

Sprite2D.prototype = Object.create(Object2D.prototype);
Sprite2D.prototype.constructor = Sprite2D;

export { Sprite2D };