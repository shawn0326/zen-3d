import {Geometry} from './Geometry.js';

/**
 * An instanced version of {@link zen3d.Geometry}.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Geometry
 */
function InstancedGeometry() {

    Geometry.call(this);

    /**
     * @type {Integer|undefined}
     */
    this.maxInstancedCount = undefined;

}

InstancedGeometry.prototype = Object.assign(Object.create(Geometry.prototype), /** @lends zen3d.InstancedGeometry.prototype */{

    constructor: InstancedGeometry,

    /**
     * @readonly
     * @type {boolean}
     * @default true
     */
    isInstancedGeometry: true

});

export {InstancedGeometry};