import {OBJECT_TYPE} from '../const.js';
import {Mesh} from './Mesh.js';
import {Matrix4} from '../math/Matrix4.js';

/**
 * A mesh that has a {@link Skeleton} with bones that can then be used to animate the vertices of the geometry.
 * The material must support skinning.
 * @constructor
 * @extends Mesh
 */
function SkinnedMesh(geometry, material) {

    Mesh.call(this, geometry, material);

    this.type = OBJECT_TYPE.SKINNED_MESH;

    this.skeleton = undefined;

    this.bindMode = 'attached';

    this.bindMatrix = new Matrix4();
    this.bindMatrixInverse = new Matrix4();

}

SkinnedMesh.prototype = Object.assign(Object.create(Mesh.prototype), {

    constructor: SkinnedMesh,
    
    bind: function ( skeleton, bindMatrix ) {

		this.skeleton = skeleton;

		if ( bindMatrix === undefined ) {

			this.updateMatrix();

			bindMatrix = this.worldMatrix;

		}

		this.bindMatrix.copy( bindMatrix );
		this.bindMatrixInverse.getInverse( bindMatrix );

	},

    updateMatrix: function() {
        Mesh.prototype.updateMatrix.call(this);

        if(this.bindMode === 'attached') {
            this.bindMatrixInverse.getInverse(this.worldMatrix);
        } else if(this.bindMode === 'detached') {
            this.bindMatrixInverse.getInverse(this.bindMatrix);
        } else {
            console.warn( 'zen3d.SkinnedMesh: Unrecognized bindMode: ' + this.bindMode );
        }
    },

    clone: function () {
        return new this.constructor( this.geometry, this.material ).copy( this );
    }

});

export {SkinnedMesh};
