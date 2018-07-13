import {Vector2} from './Vector2.js';

function Box2(min, max) {
    this.min = (min !== undefined) ? min : new Vector2(+Infinity, +Infinity);
    this.max = (max !== undefined) ? max : new Vector2(-Infinity, -Infinity);
}

Object.assign(Box2.prototype, {

    set: function(x1, y1, x2, y2) {
        this.min.set(x1, y1);
        this.max.set(x2, y2);
    },

    copy: function(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);

        return this;
    }

});

export {Box2};