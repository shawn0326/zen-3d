#ifdef USE_SKINNING

    attribute vec4 skinIndex;
	attribute vec4 skinWeight;

    uniform mat4 bindMatrix;
    uniform mat4 bindMatrixInverse;
    uniform mat4 boneMatrices[MAX_BONES];

    mat4 getBoneMatrix(const in float i) {
		mat4 bone = boneMatrices[int(i)];
		return bone;
	}

#endif