(function() {
    var VOXGeometry = function() {
        this.vertices = [];
    	this.faces = [];
    	this.faceVertexUvs = [[]];
    }

    VOXGeometry.prototype.computeFaceNormals = function () {
		var cb = new zen3d.Vector3(), ab = new zen3d.Vector3();

		for ( var f = 0, fl = this.faces.length; f < fl; f ++ ) {

			var face = this.faces[ f ];

			var vA = this.vertices[ face.a ];
			var vB = this.vertices[ face.b ];
			var vC = this.vertices[ face.c ];

			cb.subVectors( vC, vB );
			ab.subVectors( vA, vB );
			cb.cross( ab );

			cb.normalize();

			face.normal.copy( cb );

		}
	}

    VOXGeometry.prototype.merge = function ( geometry, matrix, materialIndexOffset ) {

		var normalMatrix,
			vertexOffset = this.vertices.length,
			vertices1 = this.vertices,
			vertices2 = geometry.vertices,
			faces1 = this.faces,
			faces2 = geometry.faces,
			uvs1 = this.faceVertexUvs[ 0 ],
			uvs2 = geometry.faceVertexUvs[ 0 ];

		if ( materialIndexOffset === undefined ) materialIndexOffset = 0;

		if ( matrix !== undefined ) {

			normalMatrix = new zen3d.Matrix3().setFromMatrix4( matrix ).inverse().transpose();

		}

		// vertices

		for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

			var vertex = vertices2[ i ];

			var vertexCopy = vertex.clone();

			if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

			vertices1.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces2.length; i < il; i ++ ) {

			var face = faces2[ i ], faceCopy, normal, color;

			faceCopy = new zen3d.VOXFace3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
			faceCopy.normal.copy( face.normal );

			if ( normalMatrix !== undefined ) {

				faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

			}

			faceCopy.color.copy( face.color );

			faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

			faces1.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs2.length; i < il; i ++ ) {

			var uv = uvs2[ i ], uvCopy = [];

			if ( uv === undefined ) {

				continue;

			}

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( uv[ j ].clone() );

			}

			uvs1.push( uvCopy );

		}

	}

    VOXGeometry.prototype.mergeVertices = function () {

		var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
		var unique = [], changes = [];

		var v, key;
		var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
		var precision = Math.pow( 10, precisionPoints );
		var i, il, face;
		var indices, j, jl;

		for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

			v = this.vertices[ i ];
			key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

			if ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( this.vertices[ i ] );
				changes[ i ] = unique.length - 1;

			} else {

				//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		}


		// if faces are completely degenerate after merging vertices, we
		// have to remove them from the geometry.
		var faceIndicesToRemove = [];

		for ( i = 0, il = this.faces.length; i < il; i ++ ) {

			face = this.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];

			indices = [ face.a, face.b, face.c ];

			// if any duplicate vertices are found in a Face3
			// we have to remove the face as nothing can be saved
			for ( var n = 0; n < 3; n ++ ) {

				if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

					faceIndicesToRemove.push( i );
					break;

				}

			}

		}

		for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {

			var idx = faceIndicesToRemove[ i ];

			this.faces.splice( idx, 1 );

			for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

				this.faceVertexUvs[ j ].splice( idx, 1 );

			}

		}

		// Use unique set of vertices

		var diff = this.vertices.length - unique.length;
		this.vertices = unique;
		return diff;

	}

    VOXGeometry.prototype.createGeometry = function() {
        var geometry = new zen3d.Geometry();
        geometry.vertexFormat = {
            "a_Position": {size: 3, normalized: false, stride: 12, offset: 0},
            "a_Normal": {size: 3, normalized: false, stride: 12, offset: 3},
            "a_Color": {size: 4, normalized: false, stride: 12, offset: 6},
            "a_Uv": {size: 2, normalized: false, stride: 12, offset: 10}
        };
        geometry.vertexSize = 12;

        function pushFaceData(posArray, normalArray, colorArray, uvArray) {
            for(var i = 0; i < 3; i++) {
                geometry.verticesArray.push(posArray[i].x, posArray[i].y, posArray[i].z);
                geometry.verticesArray.push(normalArray[i].x, normalArray[i].y, normalArray[i].z);
                geometry.verticesArray.push(colorArray[i].r, colorArray[i].g, colorArray[i].b, 1);
                if(uvArray) {
                    geometry.verticesArray.push(uvArray[i].x, uvArray[i].y);
                } else {
                    geometry.verticesArray.push(0, 0);
                }
            }
        }

        var faces = this.faces;
		var vertices = this.vertices;
		var faceVertexUvs = this.faceVertexUvs;

		var hasFaceVertexUv = faceVertexUvs[ 0 ] && faceVertexUvs[ 0 ].length > 0;
		var hasFaceVertexUv2 = faceVertexUvs[ 1 ] && faceVertexUvs[ 1 ].length > 0;

        var index = 0;

        for ( var i = 0; i < faces.length; i ++ ) {

            var posArray, normalArray, colorArray, uvArray;

			var face = faces[ i ];

			posArray = [vertices[ face.a ], vertices[ face.b ], vertices[ face.c ]];

			var normal = face.normal;

			normalArray = [normal, normal, normal];

			var color = face.color;

			colorArray = [color, color, color];

			if ( hasFaceVertexUv === true ) {

				var vertexUvs = faceVertexUvs[ 0 ][ i ];

				if ( vertexUvs !== undefined ) {

					uvArray = [vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ]];

				} else {

					console.warn( 'createGeometry(): Undefined vertexUv ', i );

					uvArray = [new Vector2(), new Vector2(), new Vector2()];

				}

			}

			// if ( hasFaceVertexUv2 === true ) {
            //
			// 	var vertexUvs = faceVertexUvs[ 1 ][ i ];
            //
			// 	if ( vertexUvs !== undefined ) {
            //
			// 		geometry.verticesArray.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );
            //
			// 	} else {
            //
			// 		console.warn( 'THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i );
            //
			// 		geometry.verticesArray.push( new Vector2(), new Vector2(), new Vector2() );
            //
			// 	}
            //
			// }

            pushFaceData(posArray, normalArray, colorArray, uvArray);

            // if(geometry.indicesArray.length < 75535) {
            //     geometry.indicesArray.push(index++, index++, index++);
            // }

		}

        return geometry;
    }

    zen3d.VOXGeometry = VOXGeometry;
})();