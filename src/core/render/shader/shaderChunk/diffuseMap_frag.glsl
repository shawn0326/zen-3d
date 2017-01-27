#ifdef USE_DIFFUSE_MAP
    outColor *= texture2D(texture, v_Uv);
#endif