import {Matrix4} from '../../math/Matrix4.js';

function Skeleton(bones) {

    // bones in array
    bones = bones || [];
    this.bones = bones.slice( 0 );

    // bone matrices data
    this.boneMatrices = new Float32Array(16 * this.bones.length);

    // use vertex texture to update boneMatrices
    // by that way, we can use more bones on phone
    this.boneTexture = undefined;
    this.boneTextureSize = 0;

}

Object.assign(Skeleton.prototype, {

    updateBones: function() {

        var offsetMatrix = new Matrix4();

        return function updateBones() {

            for(var i = 0; i < this.bones.length; i++) {
                var bone = this.bones[i];
                offsetMatrix.multiplyMatrices(bone.worldMatrix, bone.offsetMatrix);
                offsetMatrix.toArray(this.boneMatrices, i * 16);
            }

            if (this.boneTexture !== undefined) {
                this.boneTexture.version++;
            }

        }

    }(),

    getBoneByName: function(name) {
        for ( var i = 0, il = this.bones.length; i < il; i ++ ) {
			var bone = this.bones[ i ];
			if ( bone.name === name ) {
				return bone;
			}
		}

		return undefined;
    }

});

export {Skeleton};