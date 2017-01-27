attribute vec3 a_Position;
attribute vec3 a_Normal;

#include <transpose>
#include <inverse>

uniform mat4 u_Projection;
uniform mat4 u_View;
uniform mat4 u_Model;

uniform vec3 u_CameraPosition;