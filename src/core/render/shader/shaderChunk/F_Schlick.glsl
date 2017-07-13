#ifdef USE_SPECULAR_FRESNEL
	vec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {

		// Original approximation by Christophe Schlick '94
		float fresnel = pow( 1.0 - dotLH, 5.0 );

		// Optimized variant (presented by Epic at SIGGRAPH '13)
		// float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );

		return ( 1.0 - specularColor ) * fresnel + specularColor;

	}
#endif