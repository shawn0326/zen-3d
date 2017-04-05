#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )
    varying vec3 v_ViewModelPos;
#endif