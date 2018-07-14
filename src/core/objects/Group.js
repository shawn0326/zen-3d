import {OBJECT_TYPE} from '../const.js';
import {Object3D} from './Object3D.js';

/**
 * Group
 * @class
 */
function Group() {
    Object3D.call(this);

    this.type = OBJECT_TYPE.GROUP;
}

Group.prototype = Object.create(Object3D.prototype);
Group.prototype.constructor = Group;

export {Group};
