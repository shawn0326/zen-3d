#ifdef USE_ENV_MAP
    varying vec3 v_EnvPos;
    uniform samplerCube envMap;
    uniform float u_EnvMap_Intensity;
#endif