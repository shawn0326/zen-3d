#include <common_frag>
uniform samplerCube cubeMap;
varying vec3 v_ModelPos;
void main() {
    #include <begin_frag>
    outColor *= textureCube(cubeMap, v_ModelPos);
    #include <end_frag>
}