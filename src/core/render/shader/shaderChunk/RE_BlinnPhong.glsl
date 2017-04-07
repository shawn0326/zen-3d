void RE_BlinnPhong(vec4 k, vec4 light, vec3 N, vec3 L, vec3 V, float n_s, float specularStrength, inout vec4 reflectLight) {
    vec3 H = normalize(L + V);
    reflectLight += k * light * pow(max(dot(N, H), 0.), n_s) * specularStrength;
}