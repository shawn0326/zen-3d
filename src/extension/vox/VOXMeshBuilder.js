/**
 * Reference https://github.com/daishihmr/vox.js
 * @author daishihmr
 * @modifier shawn0326
 */
(function() {
    /**
     * @constructor
     *
     * @param {zen3d.VoxelData} voxelData
     * @param {Object=} param
     * @param {number=} param.voxelSize default = 1.0.
     * @param {boolean=} param.vertexColor default = false.
     * @param {boolean=} param.optimizeFaces dafalue = true.
     * @param {boolean=} param.originToBottom dafalue = true.
     * @property {zen3d.Geometry} geometry
     * @property {zen3d.Material} material
     */
    var VOXMeshBuilder = function(voxelData, param) {
        if (!VOXMeshBuilder.textureFactory) VOXMeshBuilder.textureFactory = new zen3d.VOXTextureFactory();

        param = param || {};
        this.voxelData = voxelData;
        this.voxelSize = param.voxelSize || VOXMeshBuilder.DEFAULT_PARAM.voxelSize;
        this.vertexColor = (param.vertexColor === undefined) ? VOXMeshBuilder.DEFAULT_PARAM.vertexColor : param.vertexColor;
        this.optimizeFaces = (param.optimizeFaces === undefined) ? VOXMeshBuilder.DEFAULT_PARAM.optimizeFaces : param.optimizeFaces;
        this.originToBottom = (param.originToBottom === undefined) ? VOXMeshBuilder.DEFAULT_PARAM.originToBottom : param.originToBottom;

        this.geometry = null;
        this.material = null;

        this._build();
    }

    VOXMeshBuilder.prototype._build = function() {
        this.geometry = new zen3d.Geometry();
        this.material = new zen3d.PhongMaterial();

        var geometry = new zen3d.VOXGeometry();

        this.hashTable = createHashTable(this.voxelData.voxels);

        var offsetX = (this.voxelData.size.x - 1) * -0.5;
        var offsetY = (this.voxelData.size.y - 1) * -0.5;
        var offsetZ = (this.originToBottom) ? 0 : (this.voxelData.size.z - 1) * -0.5;
        var matrix = new zen3d.Matrix4();
        this.voxelData.voxels.forEach(function(voxel) {
            var voxGeometry = this._createVoxGeometry(voxel);
            if (voxGeometry) {
                matrix.makeTranslation((voxel.x + offsetX) * this.voxelSize, (voxel.z + offsetZ) * this.voxelSize, -(voxel.y + offsetY) * this.voxelSize);
                geometry.merge(voxGeometry, matrix);
            }
        }.bind(this));

        if (this.optimizeFaces) {
            geometry.mergeVertices();
        }
        geometry.computeFaceNormals();

        this.geometry = geometry.createGeometry();

        if (this.vertexColor) {
            this.material.vertexColors = true;
        } else {
            this.material.diffuseMap = VOXMeshBuilder.textureFactory.getTexture(this.voxelData);
        }
    }

    VOXMeshBuilder.prototype._createVoxGeometry = function(voxel) {
        // 隣接するボクセルを検索し、存在する場合は面を無視する
        var ignoreFaces = [];
        if (this.optimizeFaces) {
            six.forEach(function(s) {
                if (this.hashTable.has(voxel.x + s.x, voxel.y + s.y, voxel.z + s.z)) {
                    ignoreFaces.push(s.ignoreFace);
                }
            }.bind(this));
        }

        // 6方向すべて隣接されていたらnullを返す
        if (ignoreFaces.length ===  6) return null;

        // 頂点データ
        var voxVertices = voxVerticesSource.map(function(voxel) {
            return new zen3d.Vector3(voxel.x * this.voxelSize * 0.5, voxel.y * this.voxelSize * 0.5, voxel.z * this.voxelSize * 0.5);
        }.bind(this));

        // 面データ
        var voxFaces = voxFacesSource.map(function(f) {
            return {
                faceA: new zen3d.VOXFace3(f.faceA.a, f.faceA.b, f.faceA.c),
                faceB: new zen3d.VOXFace3(f.faceB.a, f.faceB.b, f.faceB.c),
            };
        });

        // 頂点色
        if (this.vertexColor) {
            var c = this.voxelData.palette[voxel.colorIndex];
            var color = new zen3d.Color3(c.r / 255, c.g / 255, c.b / 255);
        }

        var vox = new zen3d.VOXGeometry();
        vox.faceVertexUvs[0] = [];

        // 面を作る
        voxFaces.forEach(function(faces, i) {
            if (ignoreFaces.indexOf(i) >= 0) return;

            if (this.vertexColor) {
                faces.faceA.color = color;
                faces.faceB.color = color;
            } else {
                var uv = new zen3d.Vector2((voxel.colorIndex + 0.5) / 256, 0.5);
                vox.faceVertexUvs[0].push([uv, uv, uv], [uv, uv, uv]);
            }
            vox.faces.push(faces.faceA, faces.faceB);
        }.bind(this));

        // 使っている頂点を抽出
        var usingVertices = {};
        vox.faces.forEach(function(face) {
            usingVertices[face.a] = true;
            usingVertices[face.b] = true;
            usingVertices[face.c] = true;
        });

        // 面の頂点インデックスを詰める処理
        var splice = function(index) {
            vox.faces.forEach(function(face) {
                if (face.a > index) face.a -= 1;
                if (face.b > index) face.b -= 1;
                if (face.c > index) face.c -= 1;
            });
        };

        // 使っている頂点のみ追加する
        var j = 0;
        voxVertices.forEach(function(vertex, i) {
            if (usingVertices[i]) {
                vox.vertices.push(vertex);
            } else {
                splice(i - j);
                j += 1;
            }
        });

        return vox;
    }

    /**
     * @return {zen3d.Texture2D}
     */
    VOXMeshBuilder.prototype.getTexture = function() {
        return VOXMeshBuilder.textureFactory.getTexture(this.voxelData);
    }

    /**
     * @return {zen3d.Mesh}
     */
    VOXMeshBuilder.prototype.createMesh = function() {
        return new zen3d.Mesh(this.geometry, this.material);
    }

    /**
     * 外側に面したボクセルか
     * @return {boolean}
     */
    VOXMeshBuilder.prototype.isOuterVoxel = function(voxel) {
        return six.filter(function(s) {
            return this.hashTable.has(voxel.x + s.x, voxel.y + s.y, voxel.z + s.z);
        }.bind(this)).length < 6;
    };

    VOXMeshBuilder.DEFAULT_PARAM = {
        voxelSize: 1.0,
        vertexColor: false,
        optimizeFaces: true,
        originToBottom: true,
    };

    VOXMeshBuilder.textureFactory = undefined;

    zen3d.VOXMeshBuilder = VOXMeshBuilder;

    // 隣接方向と無視する面の対応表
    var six = [
        { x: -1, y: 0, z: 0, ignoreFace: 0 },
        { x:  1, y: 0, z: 0, ignoreFace: 1 },
        { x:  0, y:-1, z: 0, ignoreFace: 5 },
        { x:  0, y: 1, z: 0, ignoreFace: 4 },
        { x:  0, y: 0, z:-1, ignoreFace: 2 },
        { x:  0, y: 0, z: 1, ignoreFace: 3 },
    ];

    // 頂点データソース
    var voxVerticesSource = [
        { x: -1, y: 1, z:-1 },
        { x:  1, y: 1, z:-1 },
        { x: -1, y: 1, z: 1 },
        { x:  1, y: 1, z: 1 },
        { x: -1, y:-1, z:-1 },
        { x:  1, y:-1, z:-1 },
        { x: -1, y:-1, z: 1 },
        { x:  1, y:-1, z: 1 },
    ];

    // 面データソース
    var voxFacesSource = [
        { faceA: { a:6, b:2, c:0 }, faceB: { a:6, b:0, c:4 } },
        { faceA: { a:5, b:1, c:3 }, faceB: { a:5, b:3, c:7 } },
        { faceA: { a:5, b:7, c:6 }, faceB: { a:5, b:6, c:4 } },
        { faceA: { a:2, b:3, c:1 }, faceB: { a:2, b:1, c:0 } },
        { faceA: { a:4, b:0, c:1 }, faceB: { a:4, b:1, c:5 } },
        { faceA: { a:7, b:3, c:2 }, faceB: { a:7, b:2, c:6 } },
    ];

    var hash = function(x, y, z) {
        return "x" + x + "y" + y + "z" + z;
    };

    var createHashTable = function(voxels) {
        var hashTable = {};
        voxels.forEach(function(v) {
            hashTable[hash(v.x, v.y, v.z)] = true;
        });

        hashTable.has = function(x, y, z) {
            return hash(x, y, z) in this;
        }
        return hashTable;
    };
})();