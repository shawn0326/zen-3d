#include <common_vert>

uniform float scale;
attribute float lineDistance;

varying float vLineDistance;

void main() {
    vLineDistance = scale * lineDistance;

    vec3 transformed = vec3(a_Position);

    #include <pvm_vert>
}