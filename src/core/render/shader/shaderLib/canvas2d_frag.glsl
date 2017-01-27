#include <common_frag>
varying vec2 v_Uv;
uniform sampler2D spriteTexture;
void main() {
    #include <begin_frag>
    outColor *= texture2D(spriteTexture, v_Uv);
    #include <end_frag>
    #include <premultipliedAlpha_frag>
}