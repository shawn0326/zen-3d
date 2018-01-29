#include <common_vert>
varying vec3 v_ModelPos;
#include <skinning_pars_vert>
void main() {
    #include <begin_vert>
    #include <skinning_vert>
    #include <pvm_vert>
    v_ModelPos = (u_Model * vec4(transformed, 1.0)).xyz;
}