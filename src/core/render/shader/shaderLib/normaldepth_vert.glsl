#include <common_vert>

#define USE_NORMAL

#include <skinning_pars_vert>
#include <normal_pars_vert>
#include <uv_pars_vert>
void main() {
    #include <uv_vert>
    #include <begin_vert>
    #include <skinning_vert>
    #include <normal_vert>
    #include <pvm_vert>
}