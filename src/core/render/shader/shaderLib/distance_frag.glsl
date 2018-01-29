#include <common_frag>
uniform vec3 lightPos;
uniform float nearDistance;
uniform float farDistance;
varying vec3 v_ModelPos;
#include <packing>
void main() {
    float dist = length( v_ModelPos - lightPos );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist ); // clamp to [ 0, 1 ]

    gl_FragColor = packDepthToRGBA(dist);
}