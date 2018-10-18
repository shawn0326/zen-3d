#ifdef USE_SHADOW

    #if NUM_DIR_LIGHTS > 0

        uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHTS ];
        varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

    #endif

    #if NUM_POINT_LIGHTS > 0

        uniform samplerCube pointShadowMap[ NUM_POINT_LIGHTS ];

    #endif

    #if NUM_SPOT_LIGHTS > 0

        uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHTS ];
        varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];

    #endif

    #include <packing>
    #include <shadow>

#endif