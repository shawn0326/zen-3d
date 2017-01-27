void RE_Lambert(vec4 k, vec4 light, vec3 N, vec3 L, inout vec4 reflectLight) {
    float dotNL = max(dot(N, L), 0.);
    reflectLight += k * light * dotNL;
}