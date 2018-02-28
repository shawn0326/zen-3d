#ifdef NUM_CLIPPING_PLANES

    vec4 plane;

    for ( int i = 0; i < NUM_CLIPPING_PLANES; i ++ ) {

        plane = clippingPlanes[ i ];
        if ( dot( -v_ViewModelPos, plane.xyz ) > plane.w ) discard;

    }

#endif