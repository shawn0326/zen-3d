#ifdef USE_ENV_MAP
    vec4 envColor = textureCube(envMap, v_EnvPos);
    // TODO add? mix? or some other method?
    // outColor = mix(outColor, envColor, u_EnvMap_Intensity);
    outColor += envColor * u_EnvMap_Intensity;
    // outColor = mix(outColor, envColor * outColor, u_EnvMap_Intensity);
#endif