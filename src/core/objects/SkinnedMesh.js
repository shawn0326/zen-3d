import {OBJECT_TYPE} from '../const.js';
import {Mesh} from './Mesh.js';

/**
 * SkinnedMesh
 * @class
 */
function SkinnedMesh(geometry, material) {
    Mesh.call(this, geometry, material);

    this.type = OBJECT_TYPE.SKINNED_MESH;

    this.skeleton = undefined;
}

SkinnedMesh.prototype = Object.assign(Object.create(Mesh.prototype), {

    constructor: SkinnedMesh,

    updateMatrix: function() {
        Mesh.prototype.updateMatrix.call(this);

        if(this.skeleton) {
            this.skeleton.updateBones();
        }
    },

    clone: function () {
        return new this.constructor( this.geometry, this.material ).copy( this );
    }

});

export {SkinnedMesh};
