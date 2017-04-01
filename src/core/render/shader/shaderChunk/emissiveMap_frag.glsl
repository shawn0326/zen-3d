#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = texture2D(emissiveMap, v_Uv);

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif