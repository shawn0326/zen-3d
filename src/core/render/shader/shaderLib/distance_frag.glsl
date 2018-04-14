#include <common_frag>
uniform float nearDistance;
uniform float farDistance;
varying vec3 v_ModelPos;
#include <packing>
void main() {
    float dist = length( v_ModelPos - u_CameraPosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist ); // clamp to [ 0, 1 ]

    gl_FragColor = packDepthToRGBA(dist);
}