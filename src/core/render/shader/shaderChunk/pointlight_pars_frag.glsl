struct PointLight
{
    vec3 position;
    vec4 color;
    float intensity;
    float distance;
    float decay;

    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
};
uniform PointLight u_Point[USE_POINT_LIGHT];