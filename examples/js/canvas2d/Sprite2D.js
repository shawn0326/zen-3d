/**
 * Sprite2D
 */

zen3d.Sprite2D = function() {
	zen3d.Object2D.call(this);
	this._texture = null;
}

zen3d.Sprite2D.prototype = Object.create(zen3d.Object2D.prototype);
zen3d.Sprite2D.prototype.constructor = zen3d.Sprite2D;