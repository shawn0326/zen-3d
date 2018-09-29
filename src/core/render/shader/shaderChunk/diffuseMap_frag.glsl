#ifdef USE_DIFFUSE_MAP
    vec4 texelColor = texture2D( diffuseMap, v_Uv );
    texelColor = mapTexelToLinear( texelColor );

    outColor *= texelColor;
#endif