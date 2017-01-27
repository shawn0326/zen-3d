struct AmbientLight
{
    vec4 color;
    float intensity;
};
uniform AmbientLight u_Ambient[USE_AMBIENT_LIGHT];