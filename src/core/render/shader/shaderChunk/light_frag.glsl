#ifdef USE_LIGHT
    vec4 light;
    vec3 L;
    vec4 reflectLight = vec4(0., 0., 0., 0.);
    vec4 diffuseColor = outColor.xyzw;

    #ifdef USE_AMBIENT_LIGHT
    for(int i = 0; i < USE_AMBIENT_LIGHT; i++) {
        reflectLight += diffuseColor * u_Ambient[i].color * u_Ambient[i].intensity;
    }
    #endif

    #if defined(USE_PHONG) && ( defined(USE_DIRECT_LIGHT) || defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) )
        vec3 V = normalize( (u_View * vec4(u_CameraPosition, 1.)).xyz - v_ViewModelPos);
    #endif

    #ifdef USE_DIRECT_LIGHT
    for(int i = 0; i < USE_DIRECT_LIGHT; i++) {
        L = -u_Directional[i].direction;
        light = u_Directional[i].color * u_Directional[i].intensity;
        L = normalize(L);

        RE_Lambert(diffuseColor, light, N, L, reflectLight);

        #ifdef USE_PHONG
        // RE_Phong(u_SpecularColor, light, N, L, V, 4., reflectLight);
        RE_BlinnPhong(u_SpecularColor, light, N, normalize(L), V, u_Specular, reflectLight);
        #endif
    }
    #endif

    #ifdef USE_POINT_LIGHT
    for(int i = 0; i < USE_POINT_LIGHT; i++) {
        L = u_Point[i].position - v_ViewModelPos;
        float dist = pow(clamp(1. - length(L) / u_Point[i].distance, 0.0, 1.0), u_Point[i].decay);
        light = u_Point[i].color * u_Point[i].intensity * dist;
        L = normalize(L);

        RE_Lambert(diffuseColor, light, N, L, reflectLight);

        #ifdef USE_PHONG
        // RE_Phong(u_SpecularColor, light, N, L, V, u_Specular, reflectLight);
        RE_BlinnPhong(u_SpecularColor, light, N, normalize(L), V, u_Specular, reflectLight);
        #endif
    }
    #endif

    #ifdef USE_SPOT_LIGHT
    for(int i = 0; i < USE_SPOT_LIGHT; i++) {
        L = u_Spot[i].position - v_ViewModelPos;
        float lightDistance = length(L);
        L = normalize(L);
        float angleCos = dot( L, -normalize(u_Spot[i].direction) );

        if( all( bvec2(angleCos > u_Spot[i].coneCos, lightDistance < u_Spot[i].distance) ) ) {

            float spotEffect = smoothstep( u_Spot[i].coneCos, u_Spot[i].penumbraCos, angleCos );
            float dist = pow(clamp(1. - lightDistance / u_Spot[i].distance, 0.0, 1.0), u_Spot[i].decay);
            light = u_Spot[i].color * u_Spot[i].intensity * dist * spotEffect;

            RE_Lambert(diffuseColor, light, N, L, reflectLight);

            #ifdef USE_PHONG
            // RE_Phong(u_SpecularColor, light, N, L, V, u_Specular, reflectLight);
            RE_BlinnPhong(u_SpecularColor, light, N, normalize(L), V, u_Specular, reflectLight);
            #endif

        }

    }
    #endif

    outColor = reflectLight.xyzw;
#endif