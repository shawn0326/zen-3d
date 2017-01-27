#include <common_vert>
uniform float u_PointSize;
uniform float u_PointScale;
void main() {
    #include <pvm_vert>
    vec4 mvPosition = u_View * u_Model * vec4(a_Position, 1.0);
    #ifdef USE_SIZEATTENUATION
        gl_PointSize = u_PointSize * ( u_PointScale / - mvPosition.z );
    #else
        gl_PointSize = u_PointSize;
    #endif
}