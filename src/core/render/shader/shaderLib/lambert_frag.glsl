#include <common_frag>
#include <uv_pars_frag>
#include <diffuseMap_pars_frag>
#include <normalMap_pars_frag>
#include <light_pars_frag>
#include <normal_pars_frag>
#include <viewModelPos_pars_frag>
#include <RE_Lambert>
#include <envMap_pars_frag>
#include <shadowMap_pars_frag>
#include <fog_pars_frag>
void main() {
    #include <begin_frag>
    #include <diffuseMap_frag>
    #include <normal_frag>
    #include <light_frag>
    #include <envMap_frag>
    #include <shadowMap_frag>
    #include <end_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
}