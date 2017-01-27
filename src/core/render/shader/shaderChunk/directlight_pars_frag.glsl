struct DirectLight
{
    vec3 direction;
    vec4 color;
    float intensity;

    int shadow;
};
uniform DirectLight u_Directional[USE_DIRECT_LIGHT];