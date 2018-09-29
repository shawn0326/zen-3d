#if defined(USE_NORMAL) && !defined(FLAT_SHADED)
    v_Normal = (transposeMat4(inverseMat4(u_Model)) * vec4(objectNormal, 1.0)).xyz;

    #ifdef FLIP_SIDED
    	v_Normal = - v_Normal;
    #endif
#endif