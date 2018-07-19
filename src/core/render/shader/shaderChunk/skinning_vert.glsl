#ifdef USE_SKINNING

    mat4 boneMatX = getBoneMatrix( skinIndex.x );
    mat4 boneMatY = getBoneMatrix( skinIndex.y );
    mat4 boneMatZ = getBoneMatrix( skinIndex.z );
    mat4 boneMatW = getBoneMatrix( skinIndex.w );

    vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);

    vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned = bindMatrixInverse * skinned;

    // override
    transformed = skinned.xyz / skinned.w;

    #if defined(USE_NORMAL) || defined(USE_ENV_MAP)
        mat4 skinMatrix = mat4( 0.0 );
        skinMatrix += skinWeight.x * boneMatX;
        skinMatrix += skinWeight.y * boneMatY;
        skinMatrix += skinWeight.z * boneMatZ;
        skinMatrix += skinWeight.w * boneMatW;
        skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;

        // override
        objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
    #endif

#endif