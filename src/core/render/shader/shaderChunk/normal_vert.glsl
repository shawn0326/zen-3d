#ifdef USE_NORMAL
    v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(a_Normal, 1.0)).xyz;
#endif