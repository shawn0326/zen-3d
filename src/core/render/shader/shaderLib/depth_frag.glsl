#include <common_frag>
uniform vec3 lightPos;
varying vec3 v_ModelPos;
#include <packing>
void main() {
    gl_FragColor = packDepthToRGBA(length(v_ModelPos - lightPos) / 1000.);
}