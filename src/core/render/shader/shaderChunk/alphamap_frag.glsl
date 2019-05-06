#ifdef USE_ALPHA_MAP

	outColor.a *= texture2D(alphaMap, v_Uv).g;

#endif