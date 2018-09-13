import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';

/**
 * This is almost identical to an {@link zen3d.Object3D}. 
 * Its purpose is to make working with groups of objects syntactically clearer.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Object3D
 */
function Group() {

    Object3D.call(this);

    this.type = OBJECT_TYPE.GROUP;

}

Group.prototype = Object.create(Object3D.prototype);
Group.prototype.constructor = Group;

export {Group};
