vec4 RE_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {
    vec3 H = normalize(L + V);

    float dotNH = saturate(dot(N, H));

    #ifdef USE_SPECULAR_FRESNEL
        float dotLH = saturate(dot(L, H));
        // * RECIPROCAL_PI: referenced by http://www.joshbarczak.com/blog/?p=272
        // TODO ( shininess * 0.5 + 1.0 ) * 0.25, three.js do this, but why ???
        return pow(dotNH, shininess) * RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * 0.25 * F_Schlick(specularColor, dotLH);
    #else
        return pow(dotNH, shininess) * RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * 0.25 * specularColor;
    #endif
}