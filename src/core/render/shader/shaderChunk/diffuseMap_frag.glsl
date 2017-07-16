#ifdef USE_DIFFUSE_MAP
    vec4 texelColor = texture2D( texture, v_Uv );
    texelColor = mapTexelToLinear( texelColor );

    outColor *= texelColor;
#endif