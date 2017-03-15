#include <common_vert>
#include <normal_pars_vert>
#include <uv_pars_vert>
#include <viewModelPos_pars_vert>
#include <envMap_pars_vert>
#include <shadowMap_pars_vert>
#include <skinning_pars_vert>
void main() {
    #include <begin_vert>
    #include <skinning_vert>
    #include <pvm_vert>
    #include <normal_vert>
    #include <uv_vert>
    #include <viewModelPos_vert>
    #include <envMap_vert>
    #include <shadowMap_vert>
}