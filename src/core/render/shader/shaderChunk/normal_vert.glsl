#ifdef USE_NORMAL
    v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(objectNormal, 1.0)).xyz;

    #ifdef FLIP_SIDED
    	v_Normal = - v_Normal;
    #endif
#endif