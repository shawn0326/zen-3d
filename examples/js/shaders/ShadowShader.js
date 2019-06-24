// shadow shader

zen3d.ShadowShader = {

	defines: {

	},

	uniforms: {

	},

	vertexShader: [
		'#include <common_vert>',
		'#include <viewModelPos_pars_vert>',
		'#include <shadowMap_pars_vert>',
		'#include <morphtarget_pars_vert>',
		'#include <skinning_pars_vert>',
		'void main() {',
		'#include <begin_vert>',
		'#include <morphtarget_vert>',
		'#include <skinning_vert>',
		'#include <pvm_vert>',
		'#include <viewModelPos_vert>',
		'#include <shadowMap_vert>',
		'}'
	].join("\n"),

	fragmentShader: [
		'#include <common_frag>',
		'#include <viewModelPos_pars_frag>',
		'#include <light_pars_frag>',
		'#include <shadowMap_pars_frag>',
		'#include <fog_pars_frag>',
		'float getShadowMask() {',
		'float shadow = 1.0;',

		'#if NUM_DIR_LIGHTS > 0',
		'#pragma unroll_loop',
		'for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {',
		'#if NUM_DIR_SHADOWS > 0',
		'#ifdef USE_PCSS_SOFT_SHADOW',
		'shadow *= bool( u_Directional[ i ].shadow ) ? getShadowWithPCSS( directionalDepthMap[ i ], directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[ i ].shadowBias, u_Directional[ i ].shadowRadius, u_Directional[ i ].shadowMapSize ) : 1.0;',
		'#else',
		'shadow *= bool( u_Directional[ i ].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[ i ].shadowBias, u_Directional[ i ].shadowRadius, u_Directional[ i ].shadowMapSize ) : 1.0;',
		'#endif',
		'#endif',
		'}',
		'#endif',

		'#if NUM_POINT_LIGHTS > 0',
		'vec3 worldV;',
		'#pragma unroll_loop',
		'for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {',
		'#if NUM_POINT_SHADOWS > 0',
		'worldV = v_modelPos - u_Point[ i ].position;',

		'shadow *= bool( u_Point[ i ].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV, u_Point[ i ].shadowBias, u_Point[ i ].shadowRadius, u_Point[ i ].shadowMapSize, u_Point[ i ].shadowCameraNear, u_Point[ i ].shadowCameraFar ) : 1.0;',
		'#endif',
		'}',
		'#endif',

		'#if NUM_SPOT_LIGHTS > 0',
		'float lightDistance;',
		'float angleCos;',

		'#pragma unroll_loop',
		'for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {',
		'vec3 L = u_Spot[ i ].position - v_modelPos;',
		'lightDistance = length(L);',
		'L = normalize(L);',
		'angleCos = dot( L, -normalize(u_Spot[ i ].direction) );',
		'if( all( bvec2(angleCos > u_Spot[ i ].coneCos, lightDistance < u_Spot[ i ].distance) ) ) {',
		'#if NUM_SPOT_SHADOWS > 0',
		'#ifdef USE_PCSS_SOFT_SHADOW',
		'shadow *= bool( u_Spot[ i ].shadow ) ? getShadowWithPCSS( spotDepthMap[ i ], spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[ i ].shadowBias, u_Spot[ i ].shadowRadius, u_Spot[ i ].shadowMapSize ) : 1.0;',
		'#else',
		'shadow *= bool( u_Spot[ i ].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[ i ].shadowBias, u_Spot[ i ].shadowRadius, u_Spot[ i ].shadowMapSize ) : 1.0;',
		'#endif',
		'#endif',
		'}',
		'}',
		'#endif',

		'return shadow;',
		'}',
		'void main() {',
		'gl_FragColor = vec4( u_Color, u_Opacity * ( 1.0 - getShadowMask() ) );',
		'#include <fog_frag>',
		'}'
	].join("\n")

};