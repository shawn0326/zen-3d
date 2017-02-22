float scaleLinear(float value, vec2 valueDomain) {
    return (value - valueDomain.x) / (valueDomain.y - valueDomain.x);
}

float scaleLinear(float value, vec2 valueDomain, vec2 valueRange) {
    return mix(valueRange.x, valueRange.y, scaleLinear(value, valueDomain));
}

varying vec4 vColor;
varying float lifeLeft;

uniform sampler2D tSprite;

void main() {

    float alpha = 0.;

    if( lifeLeft > .995 ) {
        alpha = scaleLinear( lifeLeft, vec2(1., .995), vec2(0., 1.));
        //mix( 0., 1., ( lifeLeft - .95 ) * 100. ) * .75;
    } else {
        alpha = lifeLeft * .75;
    }

    vec4 tex = texture2D( tSprite, gl_PointCoord );

    gl_FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a );
}