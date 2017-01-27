#ifdef USE_SHADOW

    vec4 worldPosition = u_Model * vec4(a_Position, 1.0);

    #ifdef USE_DIRECT_LIGHT

        for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {

            vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;

        }

    #endif

    #ifdef USE_POINT_LIGHT

        // nothing

    #endif

    #ifdef USE_SPOT_LIGHT

        for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {

            vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;

        }

    #endif

#endif