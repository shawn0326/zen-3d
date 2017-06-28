struct DirectLight
{
    vec3 direction;
    vec4 color;
    float intensity;

    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
};
uniform DirectLight u_Directional[USE_DIRECT_LIGHT];