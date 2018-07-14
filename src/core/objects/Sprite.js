import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';
import {Geometry} from '../geometry/Geometry.js';
import {SpriteMaterial} from '../material/SpriteMaterial.js';
import {InterleavedBuffer} from '../geometry/InterleavedBuffer.js';
import {InterleavedBufferAttribute} from '../geometry/InterleavedBufferAttribute.js';

// all sprites used one shared geometry
var sharedGeometry = new Geometry();
var array = new Float32Array([
    -0.5, -0.5, 0, 0,
    0.5, -0.5, 1, 0,
    0.5, 0.5, 1, 1,
    -0.5, 0.5, 0, 1
]);
var buffer = new InterleavedBuffer(array, 4);
sharedGeometry.addAttribute("position", new InterleavedBufferAttribute(buffer, 2, 0));
sharedGeometry.addAttribute("uv", new InterleavedBufferAttribute(buffer, 2, 2));
sharedGeometry.setIndex([
    0, 1, 2,
    0, 2, 3
]);
sharedGeometry.computeBoundingBox();
sharedGeometry.computeBoundingSphere();

/**
 * Sprite
 * @class
 */
function Sprite(material) {
    Object3D.call(this);

    this.geometry = sharedGeometry;

    this.material = (material !== undefined) ? material : new SpriteMaterial();

    this.type = OBJECT_TYPE.SPRITE;
}

Sprite.geometry = sharedGeometry;

Sprite.prototype = Object.create(Object3D.prototype);
Sprite.prototype.constructor = Sprite;

export {Sprite};