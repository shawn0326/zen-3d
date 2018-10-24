#ifdef USE_LIGHT
    vec4 light;
    vec3 L;

    vec4 totalReflect = vec4(0., 0., 0., 0.); // direct light
    vec4 indirectIrradiance = vec4(0., 0., 0., 0.); // for indirect diffuse
    vec4 indirectRadiance = vec4(0., 0., 0., 0.); // for indirect specular

    #ifdef USE_PBR
        vec4 diffuseColor = outColor.xyzw * (1.0 - metalnessFactor);
        vec4 specularColor = mix(vec4(0.04), outColor.xyzw, metalnessFactor);
        float roughness = clamp(roughnessFactor, 0.04, 1.0);
    #else
        vec4 diffuseColor = outColor.xyzw;
        #ifdef USE_PHONG
            vec4 specularColor = u_SpecularColor;
            float shininess = u_Specular;
        #endif
    #endif

    #ifdef USE_AMBIENT_LIGHT
        #ifdef USE_PBR
            indirectIrradiance += PI * diffuseColor * u_AmbientLightColor;
        #else
            indirectIrradiance += diffuseColor * u_AmbientLightColor;
        #endif
    #endif

    // TODO light map

    #ifdef USE_PBR
        #ifdef USE_ENV_MAP
    		vec3 envDir;
    	    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)
    	        envDir = reflect(normalize(v_worldPos - u_CameraPosition), N);
    	    #else
    	        envDir = v_EnvPos;
    	    #endif
            indirectIrradiance += getLightProbeIndirectIrradiance(8, envDir);
            indirectRadiance += getLightProbeIndirectRadiance(GGXRoughnessToBlinnExponent(roughness), 8, envDir);
    	#endif
    #endif

    #if (defined(USE_PHONG) || defined(USE_PBR))
        vec3 V = normalize( u_CameraPosition - v_modelPos );
    #endif

    float dotNL;
    vec4 irradiance;
    vec4 reflectLight;
    float dist;

    #if NUM_DIR_LIGHTS > 0

        #pragma unroll_loop
        for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
            L = -u_Directional[ i ].direction;
            light = u_Directional[ i ].color * u_Directional[ i ].intensity;
            L = normalize(L);

            dotNL = saturate( dot(N, L) );
            irradiance = light * dotNL;

            #ifdef USE_SHADOW
                #ifdef USE_PCSS_SOFT_SHADOW
                    irradiance *= bool( u_Directional[ i ].shadow ) ? getShadowWithPCSS( directionalDepthMap[ i ], directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[ i ].shadowBias, u_Directional[ i ].shadowRadius, u_Directional[ i ].shadowMapSize ) : 1.0;
                #else
                    irradiance *= bool( u_Directional[ i ].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[ i ].shadowBias, u_Directional[ i ].shadowRadius, u_Directional[ i ].shadowMapSize ) : 1.0;
                #endif
            #endif

            #ifdef USE_PBR
                irradiance *= PI;
            #endif

            reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);

            #ifdef USE_PHONG
                reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;
            #endif

            #ifdef USE_PBR
                reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness) * specularStrength;
            #endif

            totalReflect += reflectLight;
        }

    #endif

    #if NUM_POINT_LIGHTS > 0
        vec3 worldV;

        #pragma unroll_loop
        for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
            L = u_Point[ i ].position - v_modelPos;
            dist = pow(clamp(1. - length(L) / u_Point[ i ].distance, 0.0, 1.0), u_Point[ i ].decay);
            light = u_Point[ i ].color * u_Point[ i ].intensity * dist;
            L = normalize(L);

            dotNL = saturate( dot(N, L) );
            irradiance = light * dotNL;

            #ifdef USE_PBR
                irradiance *= PI;
            #endif

            #ifdef USE_SHADOW
                worldV = v_modelPos - u_Point[ i ].position;
                irradiance *= bool( u_Point[ i ].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV, u_Point[ i ].shadowBias, u_Point[ i ].shadowRadius, u_Point[ i ].shadowMapSize, u_Point[ i ].shadowCameraNear, u_Point[ i ].shadowCameraFar ) : 1.0;
            #endif

            reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);

            #ifdef USE_PHONG
                reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;
            #endif

            #ifdef USE_PBR
                reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness) * specularStrength;
            #endif

            totalReflect += reflectLight;
        }

    #endif

    #if NUM_SPOT_LIGHTS > 0
        float lightDistance;
        float angleCos;
        float spotEffect;

        #pragma unroll_loop
        for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
            L = u_Spot[ i ].position - v_modelPos;
            lightDistance = length(L);
            L = normalize(L);
            angleCos = dot( L, -normalize(u_Spot[ i ].direction) );

            if( all( bvec2(angleCos > u_Spot[ i ].coneCos, lightDistance < u_Spot[ i ].distance) ) ) {

                spotEffect = smoothstep( u_Spot[ i ].coneCos, u_Spot[ i ].penumbraCos, angleCos );
                dist = pow(clamp(1. - lightDistance / u_Spot[ i ].distance, 0.0, 1.0), u_Spot[ i ].decay);
                light = u_Spot[ i ].color * u_Spot[ i ].intensity * dist * spotEffect;

                dotNL = saturate( dot(N, L) );
                irradiance = light * dotNL;

                #ifdef USE_PBR
                    irradiance *= PI;
                #endif

                #ifdef USE_SHADOW
                    #ifdef USE_PCSS_SOFT_SHADOW
                        irradiance *= bool( u_Spot[ i ].shadow ) ? getShadowWithPCSS( spotDepthMap[ i ], spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[ i ].shadowBias, u_Spot[ i ].shadowRadius, u_Spot[ i ].shadowMapSize ) : 1.0;
                    #else
                        irradiance *= bool( u_Spot[ i ].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[ i ].shadowBias, u_Spot[ i ].shadowRadius, u_Spot[ i ].shadowMapSize ) : 1.0;
                    #endif
                #endif

                reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);

                #ifdef USE_PHONG
                    reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;
                #endif

                #ifdef USE_PBR
                    reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness) * specularStrength;
                #endif

                totalReflect += reflectLight;
            }

        }

    #endif

    vec4 indirectDiffuse = indirectIrradiance * BRDF_Diffuse_Lambert(diffuseColor);
    vec4 indirectSpecular = vec4(0., 0., 0., 0.);

    #if defined( USE_ENV_MAP ) && defined( USE_PBR )
        indirectSpecular += indirectRadiance * BRDF_Specular_GGX_Environment(N, V, specularColor, roughness) * specularStrength;
    #endif

    #ifdef USE_AOMAP

    	// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
    	float ambientOcclusion = ( texture2D( aoMap, v_Uv2 ).r - 1.0 ) * aoMapIntensity + 1.0;

    	indirectDiffuse *= ambientOcclusion;

    	#if defined( USE_ENV_MAP ) && defined( USE_PBR )

    		float dotNV = saturate( dot( N, V ) );

    		indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, GGXRoughnessToBlinnExponent(roughness) );

    	#endif

    #endif

    outColor.xyz = totalReflect.xyz + indirectDiffuse.xyz + indirectSpecular.xyz;
#endif