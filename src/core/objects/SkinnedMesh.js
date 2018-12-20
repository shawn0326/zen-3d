import { OBJECT_TYPE } from '../const.js';
import { Mesh } from './Mesh.js';
import { Matrix4 } from '../math/Matrix4.js';

/**
 * A mesh that has a {@link zen3d.Skeleton} with bones that can then be used to animate the vertices of the geometry.
 * The material must support skinning.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Mesh
 */
function SkinnedMesh(geometry, material) {

    Mesh.call(this, geometry, material);

    this.type = OBJECT_TYPE.SKINNED_MESH;

    /**
     * Skeleton created from the bones of the Geometry.
     * @member {zen3d.Skeleton}
     */
    this.skeleton = undefined;

    /**
     * Either "attached" or "detached".
     * "attached" uses the {@link zen3d.SkinnedMesh#worldMatrix} property for the base transform matrix of the bones.
     * "detached" uses the {@link zen3d.SkinnedMesh#bindMatrix}.
     * @member {string}
     * @default "attached"
     */
    this.bindMode = 'attached';

    /**
     * The base matrix that is used for the bound bone transforms.
     * @member {zen3d.Matrix4}
     */
    this.bindMatrix = new Matrix4();

    /**
     * The base matrix that is used for resetting the bound bone transforms.
     * @member {zen3d.Matrix4}
     */
    this.bindMatrixInverse = new Matrix4();

}

SkinnedMesh.prototype = Object.assign(Object.create(Mesh.prototype), /** @lends zen3d.SkinnedMesh.prototype */{

    constructor: SkinnedMesh,

    /**
     * Bind a skeleton to the skinned mesh.
     * The bindMatrix gets saved to .bindMatrix property and the .bindMatrixInverse gets calculated.
     * @param {zen3d.Skeleton} skeleton - Skeleton created from a Bones tree.
     * @param {zen3d.Matrix4} [bindMatrix=] - Matrix4 that represents the base transform of the skeleton.
     */
    bind: function (skeleton, bindMatrix) {

		this.skeleton = skeleton;

		if (bindMatrix === undefined) {

			this.updateMatrix();

			bindMatrix = this.worldMatrix;

		}

		this.bindMatrix.copy(bindMatrix);
		this.bindMatrixInverse.getInverse(bindMatrix);

	},

    updateMatrix: function() {
        Mesh.prototype.updateMatrix.call(this);

        if (this.bindMode === 'attached') {
            this.bindMatrixInverse.getInverse(this.worldMatrix);
        } else if (this.bindMode === 'detached') {
            this.bindMatrixInverse.getInverse(this.bindMatrix);
        } else {
            console.warn('zen3d.SkinnedMesh: Unrecognized bindMode: ' + this.bindMode);
        }
    },

    clone: function () {
        return new this.constructor(this.geometry, this.material).copy(this);
    }

});

export { SkinnedMesh };
