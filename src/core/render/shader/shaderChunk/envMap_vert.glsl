#ifdef USE_ENV_MAP
    v_EnvPos = reflect(normalize((u_Model * vec4(a_Position, 1.0)).xyz - u_CameraPosition), (transpose(inverse(u_Model)) * vec4(a_Normal, 1.0)).xyz);
#endif