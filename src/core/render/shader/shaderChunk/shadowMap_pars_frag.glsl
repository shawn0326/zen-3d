#ifdef USE_SHADOW

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

    #include <packing>
    #include <shadow>

#endif