#include <common_frag>
#include <diffuseMap_pars_frag>

#include <uv_pars_frag>

#define USE_NORMAL

#include <packing>
#include <normal_pars_frag>

void main() {
    #ifdef USE_DIFFUSE_MAP
        vec4 texelColor = texture2D( texture, v_Uv );

        float alpha = texelColor.a * u_Opacity;
        if(alpha < 0.99) { // if transparent, ignore
            discard;
        }
    #endif
    vec4 packedNormalDepth;
    packedNormalDepth.xyz = normalize(v_Normal) * 0.5 + 0.5;
    packedNormalDepth.w = gl_FragCoord.z;
    gl_FragColor = packedNormalDepth;
}