(function() {
    /**
     * AssimpJsonLoader
     * @class
     *
     * Loader for models imported with Open Asset Import Library (http://assimp.sf.net)
     * through assimp2json (https://github.com/acgessler/assimp2json).
     *
     * Supports any input format that assimp supports, including 3ds, obj, dae, blend,
     * fbx, x, ms3d, lwo (and many more).
     */
    var AssimpJsonLoader = function(gl) {
        this.gl = gl;

        this.texturePath = ".";
    }

    AssimpJsonLoader.prototype.load = function(url, onLoad) {
        this.texturePath = this.extractUrlBase(url);

        var request = new XMLHttpRequest();
        request.onreadystatechange = function(event) {

            if(event.target.readyState == 4) {
                var data = JSON.parse(event.target.response);
                var group = this._parse(data);
                onLoad(group);
            }

        }.bind(this);
        request.open("GET", url, true);
        request.send();
    }

    AssimpJsonLoader.prototype.parse = function(json) {
        var group = new zen3d.Group();

        var meshes = json.meshes;
        var mesh;
        for(var n = 0; n < meshes.length; n++) {

            mesh = meshes[n];

            var faces = mesh.faces;
            var vertices = mesh.vertices;
            var normals = mesh.normals;
            var texturecoords = mesh.texturecoords[n];
            var verticesCount = vertices.length / 3; // not need

            var geometry = new zen3d.Geometry();
            geometry.verticesCount = verticesCount;

            var g_v = geometry.verticesArray;
            for(var i = 0; i < verticesCount; i++) {
                g_v.push(vertices[i * 3 + 0]);
                g_v.push(vertices[i * 3 + 1]);
                g_v.push(vertices[i * 3 + 2]);

                g_v.push(normals[i * 3 + 0]);
                g_v.push(normals[i * 3 + 1]);
                g_v.push(normals[i * 3 + 2]);

                g_v.push(0);
                g_v.push(0);
                g_v.push(0);

                g_v.push(1);
                g_v.push(1);
                g_v.push(1);
                g_v.push(1);

                // uv1
                if(texturecoords) {
                    g_v.push(texturecoords[i * 2 + 0]);
                    g_v.push(1 - texturecoords[i * 2 + 1]);
                } else {
                    g_v.push(0);
                    g_v.push(0);
                }

                g_v.push(0);
                g_v.push(0);
            }

            var g_i = geometry.indicesArray;
            for(var i = 0; i < faces.length; i++) {
                g_i.push(faces[i][2]);
                g_i.push(faces[i][1]);
                g_i.push(faces[i][0]);
            }

            var map = null;
            // if(json.materials[n]) {
                var prop = json.materials[n].properties;

                for(var key in prop) {
                    if(prop[key].semantic == 1) {
                        map = new zen3d.Texture2D.fromSrc(this.gl, "./resources/models/assimp/jeep/jeep1.jpg");
                    }
                }
            // }

            var material = new zen3d.PhongMaterial();
            material.map = map;
            var mesh = new zen3d.Mesh(geometry, material);
            mesh.castShadow = true;

            group.add(mesh);
        }

        return group;
    }

    AssimpJsonLoader.prototype._parse = function(json) {
        var meshes = this.parseList ( json.meshes, this.parseMesh );
		var materials = this.parseList ( json.materials, this.parseMaterial );
		return this.parseObject( json, json.rootnode, meshes, materials );
    }

    AssimpJsonLoader.prototype.parseList = function(json, handler) {
        var arrays = new Array( json.length );
		for ( var i = 0; i < json.length; ++ i ) {

			arrays[ i ] = handler.call( this, json[ i ] );

		}
		return arrays;
    }

    AssimpJsonLoader.prototype.parseMaterial = function(json) {
        var material = new zen3d.PhongMaterial();

        var map = null;
        var normalMap = null;

        var prop = json.properties;

        for(var key in json.properties) {
            prop = json.properties[key];

            if ( prop.key === '$tex.file' ) {
                // prop.semantic gives the type of the texture
    			// 1: diffuse
    			// 2: specular mao
    			// 5: height map (bumps)
    			// 6: normal map
                if(prop.semantic == 1) {
                    var material_url = this.texturePath + '/' + prop.value;
					material_url = material_url.replace( /\\/g, '/' );
                    map = new zen3d.Texture2D.fromSrc(this.gl, material_url);
                    // TODO: read texture settings from assimp.
					// Wrapping is the default, though.
					map.wrapS = map.wrapT = this.gl.REPEAT;
                } else if(prop.semantic == 2) {

                } else if(prop.semantic == 5) {

                } else if(prop.semantic == 6) {
                    var material_url = this.texturePath + '/' + prop.value;
					material_url = material_url.replace( /\\/g, '/' );
                    normalMap = new zen3d.Texture2D.fromSrc(this.gl, material_url);
                    // TODO: read texture settings from assimp.
					// Wrapping is the default, though.
					normalMap.wrapS = normalMap.wrapT = this.gl.REPEAT;
                }
            } else if ( prop.key === '?mat.name' ) {

			} else if ( prop.key === '$clr.diffuse' ) {

			} else if ( prop.key === '$clr.specular' ) {

			} else if ( prop.key === '$clr.emissive' ) {

			} else if ( prop.key === '$mat.opacity' ) {
                material.transparent = prop.value < 1;
                material.opacity = prop.value;
            } else if ( prop.key === '$mat.shadingm' ) {
				// Flat shading?
				if ( prop.value === 1 ) {

				}
			} else if ( prop.key === '$mat.shininess' ) {
                material.specular = prop.value;
			}
        }

        material.map = map;
        material.normalMap = normalMap;

        return material;
    }

    AssimpJsonLoader.prototype.parseMesh = function(json) {
        var geometry = new zen3d.Geometry();

        var faces = json.faces;
        var vertices = json.vertices;
        var normals = json.normals;
        var texturecoords = json.texturecoords[0];
        var verticesCount = vertices.length / 3;
        var g_v = geometry.verticesArray;
        for(var i = 0; i < verticesCount; i++) {
            g_v.push(vertices[i * 3 + 0]);
            g_v.push(vertices[i * 3 + 1]);
            g_v.push(vertices[i * 3 + 2]);

            g_v.push(normals[i * 3 + 0]);
            g_v.push(normals[i * 3 + 1]);
            g_v.push(normals[i * 3 + 2]);

            g_v.push(0);
            g_v.push(0);
            g_v.push(0);

            g_v.push(1);
            g_v.push(1);
            g_v.push(1);
            g_v.push(1);

            // uv1
            if(texturecoords) {
                g_v.push(texturecoords[i * 2 + 0]);
                g_v.push(1 - texturecoords[i * 2 + 1]);
            } else {
                g_v.push(0);
                g_v.push(0);
            }

            g_v.push(0);
            g_v.push(0);
        }

        var g_i = geometry.indicesArray;
        for(var i = 0; i < faces.length; i++) {
            g_i.push(faces[i][2]);
            g_i.push(faces[i][1]);
            g_i.push(faces[i][0]);
        }

        return geometry;
    }

    AssimpJsonLoader.prototype.parseObject = function(json, node, meshes, materials) {
        var group = new zen3d.Group();

        group.name = node.name || "";
		group.matrix.fromArray( node.transformation ).transpose();
		group.matrix.decompose( group.position, group.quaternion, group.scale );

        for(var i = 0; node.meshes && i < node.meshes.length; ++i) {
			var idx = node.meshes[ i ];
			group.add( new zen3d.Mesh( meshes[ idx ], materials[ json.meshes[ idx ].materialindex ] ) );
		}

        for(var i = 0; node.children && i < node.children.length; ++ i) {
			group.add( this.parseObject( json, node.children[ i ], meshes, materials ) );
		}

        return group;
    }

    AssimpJsonLoader.prototype.extractUrlBase = function ( url ) {
		var parts = url.split( '/' );
		parts.pop();
		return ( parts.length < 1 ? '.' : parts.join( '/' ) ) + '/';
	}

    zen3d.AssimpJsonLoader = AssimpJsonLoader;
})();