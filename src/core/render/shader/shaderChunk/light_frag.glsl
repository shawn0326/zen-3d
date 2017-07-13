#ifdef USE_LIGHT
    vec4 light;
    vec3 L;
    vec4 reflectLight = vec4(0., 0., 0., 0.);
    vec4 totalReflect = vec4(0., 0., 0., 0.);
    vec4 diffuseColor = outColor.xyzw;

    #ifdef USE_AMBIENT_LIGHT
    for(int i = 0; i < USE_AMBIENT_LIGHT; i++) {
        totalReflect += diffuseColor * u_Ambient[i].color * u_Ambient[i].intensity;
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

        float dotNL = saturate( dot(N, L) );
        vec4 irradiance = light * dotNL;

        reflectLight += irradiance * RE_Lambert(diffuseColor);

        #ifdef USE_PHONG
            // reflectLight += RE_Phong(u_SpecularColor, N, L, V, u_Specular) * specularStrength;
            reflectLight += irradiance * RE_BlinnPhong(u_SpecularColor, N, L, V, u_Specular) * specularStrength;
        #endif

        #ifdef USE_SHADOW
            reflectLight *= bool( u_Directional[i].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[i].shadowBias, u_Directional[i].shadowRadius, u_Directional[i].shadowMapSize ) : 1.0;
        #endif

        totalReflect += reflectLight;
        reflectLight = vec4(0., 0., 0., 0.);
    }
    #endif

    #ifdef USE_POINT_LIGHT
    for(int i = 0; i < USE_POINT_LIGHT; i++) {
        L = u_Point[i].position - v_ViewModelPos;
        float dist = pow(clamp(1. - length(L) / u_Point[i].distance, 0.0, 1.0), u_Point[i].decay);
        light = u_Point[i].color * u_Point[i].intensity * dist;
        L = normalize(L);

        float dotNL = saturate( dot(N, L) );
        vec4 irradiance = light * dotNL;

        reflectLight += irradiance * RE_Lambert(diffuseColor);

        #ifdef USE_PHONG
            // reflectLight += RE_Phong(u_SpecularColor, N, L, V, u_Specular) * specularStrength;
            reflectLight += irradiance * RE_BlinnPhong(u_SpecularColor, N, L, V, u_Specular) * specularStrength;
        #endif

        #ifdef USE_SHADOW
            vec3 worldV = (vec4(v_ViewModelPos, 1.) * u_View - vec4(u_Point[i].position, 1.) * u_View).xyz;
            reflectLight *= bool( u_Point[i].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV, u_Point[i].shadowBias, u_Point[i].shadowRadius, u_Point[i].shadowMapSize ) : 1.0;
        #endif

        totalReflect += reflectLight;
        reflectLight = vec4(0., 0., 0., 0.);
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

            float dotNL = saturate( dot(N, L) );
            vec4 irradiance = light * dotNL;

            reflectLight += irradiance * RE_Lambert(diffuseColor);

            #ifdef USE_PHONG
                // reflectLight += RE_Phong(u_SpecularColor, N, L, V, u_Specular) * specularStrength;
                reflectLight += irradiance * RE_BlinnPhong(u_SpecularColor, N, L, V, u_Specular) * specularStrength;
            #endif

            #ifdef USE_SHADOW
                reflectLight *= bool( u_Spot[i].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[i].shadowBias, u_Spot[i].shadowRadius, u_Spot[i].shadowMapSize ) : 1.0;
            #endif

            totalReflect += reflectLight;
            reflectLight = vec4(0., 0., 0., 0.);
        }

    }
    #endif

    outColor = totalReflect.xyzw;
#endif