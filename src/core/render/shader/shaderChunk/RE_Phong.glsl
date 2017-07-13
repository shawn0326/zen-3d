vec4 RE_Phong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {
    vec3 R = max(dot(2.0 * N, L), 0.) * N - L;

    float dotVR = saturate(dot(V, R));

    #ifdef USE_SPECULAR_FRESNEL
        vec3 H = normalize(L + V);
        float dotLH = saturate(dot(L, H));
        return pow(dotVR, shininess) * RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * 0.25 * F_Schlick(specularColor, dotLH);
    #else
        return pow(dotVR, shininess) * RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * 0.25 * specularColor;
    #endif
}