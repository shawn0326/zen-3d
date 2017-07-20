// diffuse just use lambert

vec4 BRDF_Diffuse_Lambert(vec4 diffuseColor) {
    return RECIPROCAL_PI * diffuseColor;
}

// specular use Cook-Torrance microfacet model, http://ruh.li/GraphicsCookTorrance.html
// About RECIPROCAL_PI: referenced by http://www.joshbarczak.com/blog/?p=272

vec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {
	// Original approximation by Christophe Schlick '94
	float fresnel = pow( 1.0 - dotLH, 5.0 );

	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );

	return ( 1.0 - specularColor ) * fresnel + specularColor;
}

// use blinn phong instead of phong
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
    // ( shininess * 0.5 + 1.0 ), three.js do this, but why ???
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}

float G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {
	// geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)
	return 0.25;
}

vec4 BRDF_Specular_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {
    vec3 H = normalize(L + V);

    float dotNH = saturate(dot(N, H));
    float dotLH = saturate(dot(L, H));

    vec4 F = F_Schlick(specularColor, dotLH);

    float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );

    float D = D_BlinnPhong(shininess, dotNH);

    return F * G * D;
}