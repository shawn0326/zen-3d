#ifdef USE_ALPHA_MAP

	#ifdef USE_ALPHA_MAP_UV_TRANSFORM
		outColor.a *= texture2D(alphaMap, vAlphaMapUV).g;
	#else
		outColor.a *= texture2D(alphaMap, v_Uv).g;
	#endif

#endif