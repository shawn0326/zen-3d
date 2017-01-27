#ifdef USE_SHADOW

    #include <packing>

    #ifdef USE_DIRECT_LIGHT

        uniform sampler2D directionalShadowMap[ USE_DIRECT_LIGHT ];
        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];

    #endif

    #ifdef USE_POINT_LIGHT

        uniform samplerCube pointShadowMap[ USE_POINT_LIGHT ];

    #endif

    #ifdef USE_SPOT_LIGHT

        uniform sampler2D spotShadowMap[ USE_SPOT_LIGHT ];
        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];

    #endif

    float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {

        return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );

    }

    float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {

        return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );

    }

    float getShadow( sampler2D shadowMap, vec4 shadowCoord ) {
        shadowCoord.xyz /= shadowCoord.w;
        shadowCoord.z += 0.0003; // shadow bias

        bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
        bool inFrustum = all( inFrustumVec );

        bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );

        bool frustumTest = all( frustumTestVec );

        if ( frustumTest ) {
            return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
        }

        return 1.0;

    }

    float getPointShadow( samplerCube shadowMap, vec3 V ) {
        return textureCubeCompare( shadowMap, normalize(V), length(V) / 1000.);
    }

    float getShadowMask() {
        float shadow = 1.0;

        #ifdef USE_DIRECT_LIGHT
            for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {
                shadow *= bool( u_Directional[i].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ] ) : 1.0;
            }
        #endif

        #ifdef USE_POINT_LIGHT
            for ( int i = 0; i < USE_POINT_LIGHT; i ++ ) {
                vec3 worldV = (vec4(v_ViewModelPos, 1.) * u_View - vec4(u_Point[i].position, 1.) * u_View).xyz;
                shadow *= bool( u_Point[i].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV ) : 1.0;
            }
        #endif

        #ifdef USE_SPOT_LIGHT
            for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {
                shadow *= bool( u_Spot[i].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ] ) : 1.0;
            }
        #endif

        return shadow;
    }

#endif