#ifdef USE_NORMAL
    vec3 N;
    #ifdef USE_NORMAL_MAP
        vec3 normalMapColor = texture2D(normalMap, v_Uv).rgb;
        // for now, uv coord is flip Y
        mat3 tspace = tsn(normalize(v_Normal), -v_ViewModelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));
        // mat3 tspace = tbn(normalize(v_Normal), v_ViewModelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));
        N = normalize(tspace * (normalMapColor * 2.0 - 1.0));
    #else
        N = normalize(v_Normal);
    #endif
#endif