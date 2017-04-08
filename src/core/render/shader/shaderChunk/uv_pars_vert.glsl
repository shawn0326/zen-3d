#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP)
    attribute vec2 a_Uv;
    varying vec2 v_Uv;
#endif