#if defined(USE_DIFFUSE_MAP) || defined(USE_ALPHA_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP) || defined(USE_ROUGHNESSMAP) || defined(USE_METALNESSMAP) || defined(USE_GLOSSINESSMAP)
    varying vec2 v_Uv;
#endif

#ifdef USE_AOMAP
    varying vec2 v_Uv2;
#endif