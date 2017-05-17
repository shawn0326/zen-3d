#include <common_frag>
#include <fog_pars_frag>

uniform float dashSize;
uniform float totalSize;

varying float vLineDistance;

void main() {

    if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}

    #include <begin_frag>
    #include <end_frag>
    #include <premultipliedAlpha_frag>
    #include <fog_frag>
}