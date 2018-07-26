(function() {
    var Mesh = zen3d.Mesh;
    var Geometry = zen3d.Geometry;
    var ShaderMaterial = zen3d.ShaderMaterial;
    var InterleavedBuffer = zen3d.InterleavedBuffer;
    var InterleavedBufferAttribute = zen3d.InterleavedBufferAttribute;
    var Vector3 = zen3d.Vector3;
    var Quaternion = zen3d.Quaternion;

    // all sprites used one shared geometry
    var sharedGeometry = new Geometry();
    var array = new Float32Array([
        -0.5, -0.5, 0, 0,
        0.5, -0.5, 1, 0,
        0.5, 0.5, 1, 1,
        -0.5, 0.5, 0, 1
    ]);
    var buffer = new InterleavedBuffer(array, 4);
    sharedGeometry.addAttribute("position", new InterleavedBufferAttribute(buffer, 2, 0));
    sharedGeometry.addAttribute("uv", new InterleavedBufferAttribute(buffer, 2, 2));
    sharedGeometry.setIndex([
        0, 1, 2,
        0, 2, 3
    ]);
    sharedGeometry.computeBoundingBox();
    sharedGeometry.computeBoundingSphere();

    var SpriteShader = {

        vertexShader: [

            "attribute vec2 position;",
            "attribute vec2 uv;",

            "uniform mat4 u_Model;",
            "uniform mat4 u_View;",
            "uniform mat4 u_Projection;",

            "uniform float rotation;",
            "uniform vec2 spriteScale;",

            "#ifdef USE_DIFFUSE_MAP",

                "uniform vec2 uvOffset;",
                "uniform vec2 uvScale;",

                "varying vec2 vUV;",

            "#endif",
            
            "void main() {",
            
                "#ifdef USE_DIFFUSE_MAP",
                    "vUV = uvOffset + uv * uvScale;",
                "#endif",
            
                "vec2 alignedPosition = position * spriteScale;",
            
                "vec2 rotatedPosition;",
                "rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;",
                "rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;",
            
                "vec4 finalPosition;",
            
                "finalPosition = u_View * u_Model * vec4( 0.0, 0.0, 0.0, 1.0 );",
                "finalPosition.xy += rotatedPosition;",
                "finalPosition = u_Projection * finalPosition;",
            
                "gl_Position = finalPosition;",
            
            "}"

        ].join( '\n' ),

        fragmentShader: [

            "#ifdef USE_DIFFUSE_MAP",

                "uniform sampler2D texture;",
                "varying vec2 vUV;",

            "#endif",

            "uniform vec3 u_Color;",
            "uniform float u_Opacity;",

            "#include <fog_pars_frag>",
            
            "void main() {",

                "vec4 outColor = vec4(u_Color, u_Opacity);",

                "#ifdef USE_DIFFUSE_MAP",

                    "outColor *= texture2D( texture, vUV );",

                "#endif",

                "#ifdef ALPHATEST",

                    "if ( outColor.a < ALPHATEST ) discard;",

                "#endif",
            
                "gl_FragColor = outColor;",

                "#include <fog_frag>",
            
            "}"

        ].join( '\n' ),

    };

    /**
     * Sprite
     * @class
     */
    function Sprite() {

        var material = new ShaderMaterial(
            SpriteShader.vertexShader,
            SpriteShader.fragmentShader,
            {
                rotation: 0,
                spriteScale: [1, 1],
                uvOffset: [0, 0],
                uvScale: [1, 1]
            }
        );

        Mesh.call(this, sharedGeometry, material);

        this.frustumCulled = false;   

    }

    Sprite.prototype = Object.create(Mesh.prototype);
    Sprite.prototype.constructor = Sprite;

    Object.defineProperties(Sprite.prototype, {

        rotation: {
            get: function() {
                return this.material.uniforms["rotation"];
            },
            set: function(value) {
                this.material.uniforms["rotation"] = value;
            }
        },

    });

    var spritePosition = new Vector3();
    var spriteRotation = new Quaternion();
    var spriteScale = new Vector3();

    // refresh uniforms
    Sprite.prototype.onBeforeRender = function() {
        this.worldMatrix.decompose(spritePosition, spriteRotation, spriteScale);
        this.material.uniforms["spriteScale"][0] = spriteScale.x;
        this.material.uniforms["spriteScale"][1] = spriteScale.y;

        var map = this.material.diffuseMap;
        if(map) {
            this.material.uniforms["uvOffset"][0] = map.offset.x;
            this.material.uniforms["uvOffset"][1] = map.offset.y;
            this.material.uniforms["uvScale"][0] = map.repeat.x;
            this.material.uniforms["uvScale"][1] = map.repeat.y;
        }
    }

    zen3d.Sprite = Sprite;
})();