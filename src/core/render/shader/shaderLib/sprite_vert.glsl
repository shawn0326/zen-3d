uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float rotation;
uniform vec2 scale;
uniform vec2 uvOffset;
uniform vec2 uvScale;

attribute vec2 position;
attribute vec2 uv;

varying vec2 vUV;

void main() {

    vUV = uvOffset + uv * uvScale;

    vec2 alignedPosition = position * scale;

    vec2 rotatedPosition;
    rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
    rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;

    vec4 finalPosition;

    finalPosition = viewMatrix * modelMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
    finalPosition.xy += rotatedPosition;
    finalPosition = projectionMatrix * finalPosition;

    gl_Position = finalPosition;

}