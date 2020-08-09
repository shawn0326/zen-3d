#define MATCAP

varying vec3 vViewPosition;

#include <common_vert>
#include <normal_pars_vert>
#include <uv_pars_vert>
#include <color_pars_vert>
#include <viewModelPos_pars_vert>
#include <morphtarget_pars_vert>
#include <skinning_pars_vert>
void main() {
    #include <begin_vert>
    #include <morphtarget_vert>
    #include <morphnormal_vert>
    #include <skinning_vert>
    #include <pvm_vert>
    #include <normal_vert>
    #include <uv_vert>
    #include <color_vert>
    #include <viewModelPos_vert>

    vec4 mvPosition = u_View * u_Model * vec4(transformed, 1.0);
    vViewPosition = - mvPosition.xyz;
}