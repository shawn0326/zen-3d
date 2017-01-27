void RE_Phong(vec4 k, vec4 light, vec3 N, vec3 L, vec3 V, float n_s, inout vec4 reflectLight) {
    vec3 R = max(dot(2.0 * N, L), 0.) * N - L;
    reflectLight += k * light * pow(max(dot(V, R), 0.), n_s);
}