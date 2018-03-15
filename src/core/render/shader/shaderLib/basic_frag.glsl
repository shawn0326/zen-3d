#include <common_frag>
#include <uv_pars_frag>
#include <color_pars_frag>
#include <diffuseMap_pars_frag>
#include <envMap_pars_frag>
#include <aoMap_pars_frag>
#include <fog_pars_frag>
void main() {
    #include <begin_frag>
    #include <color_frag>
    #include <diffuseMap_frag>
    #include <envMap_frag>
    #include <end_frag>
    #include <encodings_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
}