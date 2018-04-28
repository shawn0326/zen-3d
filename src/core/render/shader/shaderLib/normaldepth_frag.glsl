#include <common_frag>

#define USE_NORMAL

#include <packing>
#include <normal_pars_frag>

void main() {
    vec4 packedNormalDepth;
    packedNormalDepth.xyz = normalize(v_Normal) * 0.5 + 0.5;
    packedNormalDepth.w = gl_FragCoord.z;
    gl_FragColor = packedNormalDepth;
}