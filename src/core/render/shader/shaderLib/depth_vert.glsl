#include <common_vert>
varying vec3 v_ModelPos;
void main() {
    #include <pvm_vert>
    v_ModelPos = (u_Model * vec4(a_Position, 1.0)).xyz;
}