#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = texture2D(emissiveMap, v_Uv);

	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif