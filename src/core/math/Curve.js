import { Vector2 } from './Vector2.js';

var _A0 = new Vector2();
var _B0 = new Vector2();
var _A1 = new Vector2();
var _B1 = new Vector2();

/**
 * @constructor
 * @memberof zen3d
 * @param {zen3d.Vector2} posPoints
 * @param {zen3d.Vector2} ctrlPoints
 */
function Curve(posPoints, ctrlPoints) {
	this.posPoints = undefined;
	this.ctrlPoints = undefined;

	this.segCount = 0;

	this.set(posPoints, ctrlPoints);
}

Object.assign(Curve.prototype, /** @lends zen3d.Curve.prototype */{

	/**
     *
     */
	set: function (posPoints, ctrlPoints) {
		this.posPoints = posPoints;
		this.ctrlPoints = ctrlPoints;

		if (posPoints.length !== ctrlPoints.length) {
			console.warn("Curve: posPoints and ctrlPoints's length not equal!");
		}

		this.segCount = posPoints.length - 1;
	},

	/**
     * @method
     */
	calc: function (t) {
		for (var i = 0; i < this.segCount; i++) {
			if (t >= this.posPoints[i].x && t <= this.posPoints[i + 1].x) {
				_A0.copy(this.posPoints[i]);
				_A1.copy(this.posPoints[i + 1]);
				_B0.copy(this.ctrlPoints[i]);
				_B1.copy(this.ctrlPoints[i + 1]);
				break;
			}
		}

		if (!_A0) {
			_A0.copy(this.posPoints[this.posPoints.length - 1]);
		}
		if (!_B0) {
			_B0.copy(this.ctrlPoints[this.ctrlPoints.length - 1]);
		}
		_A1.copy(_A1 || _A0);
		_B1.copy(_B1 || _B0);

		t = (t - _A0.x) / (_A1.x - _A0.x);
		return this._cubic_bezier(_A0.y, _B0.y, _B1.y, _A1.y, t);
	},

	/**
     * Average x sampler.
     * First x and last x must in result.
     * TODO: a smarter curve sampler?????
     * @param {Integer} samplerNum - Can't less than 2.
     * @return {Array} - Result: [t0, value0, t1, value1, ...]
     */
	averageXSampler: function(samplerNum) {
		if (samplerNum < 2) {
			console.warn("Curve: sampler num less than 2!");
		}

		var sampler = [];

		var firstT = this.posPoints[0].x;
		var lastT = this.posPoints[this.posPoints.length - 1].x;
		var tempT = (lastT - firstT) / (samplerNum - 1);
		var t = 0;
		for (var i = 0; i < samplerNum; i++) {
			if (i === samplerNum - 1) {
				t = lastT;// fix
			} else {
				t = firstT + i * tempT;
			}

			sampler.push(t, this.calc(t));
		}

		return sampler;
	},

	/**
     *
     */
	_cubic_bezier: function(p0, p1, p2, p3, t) {
		p0 = this._mix(p0, p1, t);
		p1 = this._mix(p1, p2, t);
		p2 = this._mix(p2, p3, t);

		p0 = this._mix(p0, p1, t);
		p1 = this._mix(p1, p2, t);

		p0 = this._mix(p0, p1, t);

		return p0;
	},

	/**
     *
     */
	_mix: function(value0, value1, t) {
		return value0 * (1 - t) + value1 * t;
	}

});

export { Curve };