#include <common_vert>
attribute vec2 a_Uv;
varying vec2 v_Uv;
void main() {
    #include <pvm_vert>
    v_Uv = a_Uv;
}