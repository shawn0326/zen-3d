#ifdef USE_SHADOW

    #ifdef USE_DIRECT_LIGHT

        uniform mat4 directionalShadowMatrix[ USE_DIRECT_LIGHT ];
        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];

    #endif

    #ifdef USE_POINT_LIGHT

        // nothing

    #endif

    #ifdef USE_SPOT_LIGHT

        uniform mat4 spotShadowMatrix[ USE_SPOT_LIGHT ];
        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];

    #endif

#endif