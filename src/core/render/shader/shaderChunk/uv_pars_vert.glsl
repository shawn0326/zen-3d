#if defined(USE_DIFFUSE_MAP) || defined(USE_ALPHA_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP) || defined(USE_ROUGHNESSMAP) || defined(USE_METALNESSMAP) || defined(USE_GLOSSINESSMAP)
    attribute vec2 a_Uv;
    varying vec2 v_Uv;
    uniform mat3 uvTransform;
#endif

#ifdef USE_AOMAP
    attribute vec2 a_Uv2;
    varying vec2 v_Uv2;
#endif

#ifdef USE_ALPHA_MAP_UV_TRANSFORM
    varying vec2 vAlphaMapUV;
    uniform mat3 alphaMapUVTransform;
#endif 
