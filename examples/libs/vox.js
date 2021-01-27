"use strict";

/**
 * @namespace
 */
var vox = {};

(function() {
    if (typeof(window) !== "undefined") {
        vox.global = window;
        vox.global.vox = vox;
    } else {
        vox.global = global;
    }

    if (typeof(module) !== "undefined") {
        module.exports = vox;
    }

})();

(function() {

    /**
     * @constructor
     * @property {Object} size {x, y, z}
     * @property {Array} voxels [{x, y, z, colorIndex}...]
     * @property {Array} palette [{r, g, b, a}...]
     */
    vox.VoxelData = function() {
        this.size = {
            x: 0,
            y: 0,
            z: 0
        };
        this.voxels = [];
        this.palette = [];
    };
    
})();

(function() {
    
    vox.Xhr = function() {};
    vox.Xhr.prototype.getBinary = function(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
                    var arrayBuffer = xhr.response;
                    if (arrayBuffer) {
                        var byteArray = new Uint8Array(arrayBuffer);
                        resolve(byteArray);
                    }
                }
            };
            xhr.send(null);
        });
    };
    
})();

(function() {
    
    /** 
     * @constructor
     */
    vox.Parser = function() {};
    
    /**
     * 戻り値のPromiseは成功すると{@link vox.VoxelData}を返す.
     * @param {String} url
     * @return {Promise}
     */
    vox.Parser.prototype.parse = function(url) {
        var self = this;
        var xhr = new vox.Xhr();
        return xhr.getBinary(url).then(function(uint8Array) {
            return new Promise(function(resolve, reject) {
                self.parseUint8Array(uint8Array, function(error, voxelData) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(voxelData);
                    }
                });
            });
        });
    };

    if (typeof(require) !== "undefined") {
        var fs = require("fs");
        /**
         * for node.js
         * @param {String} path
         * @param {function} callback
         */
        vox.Parser.prototype.parseFile = function(path, callback) {
            fs.readFile(path, function(error, data) {
                if (error) {
                    return callback(error);
                } else {
                    var uint8Array = new Uint8Array(new ArrayBuffer(data.length));
                    for (var i = 0, len = data.length; i < len; i++) {
                        uint8Array[i] = data[i];
                    }
                    this.parseUint8Array(uint8Array, callback);
                }
            }.bind(this));
        };
    }
    
    /**
     * @param {Uint8Array} uint8Array
     * @param {function} callback
     */
    vox.Parser.prototype.parseUint8Array = function(uint8Array, callback) {
        var dataHolder = new DataHolder(uint8Array);
        try {
            root(dataHolder);
            if (dataHolder.data.palette.length === 0) {
                // console.debug("use default palette");
                dataHolder.data.palette = vox.defaultPalette;
            } else {
                dataHolder.data.palette.unshift(dataHolder.data.palette[0]);
                dataHolder.data.palette.pop();
            }

            callback(null, dataHolder.data);
        } catch (e) {
            callback(e);
        }
    };
    
    var DataHolder = function(uint8Array) {
        this.uint8Array = uint8Array;
        this.cursor = 0;
        this.data = new vox.VoxelData();
        
        this._currentChunkId = null;
        this._currentChunkSize = 0;
    };
    DataHolder.prototype.next = function() {
        if (this.uint8Array.byteLength <= this.cursor) {
            throw new Error("uint8Array index out of bounds: " + this.uint8Array.byteLength);
        }
        return this.uint8Array[this.cursor++];
    };
    DataHolder.prototype.hasNext = function() {
        return this.cursor < this.uint8Array.byteLength;
    };
    
    var root = function(dataHolder) {
        magicNumber(dataHolder);
        versionNumber(dataHolder);
        chunk(dataHolder); // main chunk
    };
    
    var magicNumber = function(dataHolder) {
        var str = "";
        for (var i = 0; i < 4; i++) {
            str += String.fromCharCode(dataHolder.next());
        }
        
        if (str !== "VOX ") {
            throw new Error("invalid magic number '" + str + "'");
        }
    };
    
    var versionNumber = function(dataHolder) {
        var ver = 0;
        for (var i = 0; i < 4; i++) {
            ver += dataHolder.next() * Math.pow(256, i);
        }
        console.info(".vox format version " + ver);
    };
    
    var chunk = function(dataHolder) {
        if (!dataHolder.hasNext()) return false;

        chunkId(dataHolder);
        sizeOfChunkContents(dataHolder);
        totalSizeOfChildrenChunks(dataHolder);
        contents(dataHolder);
        while (chunk(dataHolder));
        return dataHolder.hasNext();
    };
    
    var chunkId = function(dataHolder) {
        var id = "";
        for (var i = 0; i < 4; i++) {
            id += String.fromCharCode(dataHolder.next());
        }
        dataHolder._currentChunkId = id;
        dataHolder._currentChunkSize = 0;
        
        // console.debug("chunk id = " + id);
    };
    
    var sizeOfChunkContents = function(dataHolder) {
        var size = 0;
        for (var i = 0; i < 4; i++) {
            size += dataHolder.next() * Math.pow(256, i);
        }
        dataHolder._currentChunkSize = size;
        
        // console.debug("size of chunk = " + size);
    };
    
    var totalSizeOfChildrenChunks = function(dataHolder) {
        var size = 0;
        for (var i = 0; i < 4; i++) {
            size += dataHolder.next() * Math.pow(256, i);
        }
        
        // console.debug("total size of children chunks = " + size);
    };
    
    var contents = function(dataHolder) {
        // console.debug("content " + dataHolder._currentChunkId + ", size = " + dataHolder._currentChunkSize);
        switch (dataHolder._currentChunkId) {
        case "SIZE":
            contentsOfSizeChunk(dataHolder);
            break;
        case "XYZI":
            contentsOfVoxelChunk(dataHolder);
            break;
        case "RGBA":
            contentsOfPaletteChunk(dataHolder);
            break;
        }
    };
    
    var contentsOfSizeChunk = function(dataHolder) {
        var x = 0;
        for (var i = 0; i < 4; i++) {
            x += dataHolder.next() * Math.pow(256, i);
        }
        var y = 0;
        for (var i = 0; i < 4; i++) {
            y += dataHolder.next() * Math.pow(256, i);
        }
        var z = 0;
        for (var i = 0; i < 4; i++) {
            z += dataHolder.next() * Math.pow(256, i);
        }
        // console.debug("bounding box size = " + x + ", " + y + ", " + z);
        dataHolder.data.size = {
            x: x,
            y: y,
            z: z,
        };
    };
    
    var contentsOfVoxelChunk = function(dataHolder) {
        var num = 0;
        for (var i = 0; i < 4; i++) {
            num += dataHolder.next() * Math.pow(256, i);
        }
        // console.debug("voxel size = " + num);
        for (var i = 0; i < num; i++) {
            dataHolder.data.voxels.push({
                x: dataHolder.next(),
                y: dataHolder.next(),
                z: dataHolder.next(),
                colorIndex: dataHolder.next(),
            });
        }
    };

    var contentsOfPaletteChunk = function(dataHolder) {
        for (var i = 0; i < 256; i++) {
            var p = {
                r: dataHolder.next(),
                g: dataHolder.next(),
                b: dataHolder.next(),
                a: dataHolder.next(),
            };
            dataHolder.data.palette.push(p);
        }
    };

})();

(function() {

    /**
     * @constructor
     *
     * @param {vox.VoxelData} voxelData
     * @param {Object=} param
     * @param {number=} param.voxelSize ボクセルの大きさ. default = 1.0.
     * @param {boolean=} param.vertexColor 頂点色を使用する. default = false.
     * @param {boolean=} param.optimizeFaces 隠れた頂点／面を削除する. dafalue = true.
     * @param {boolean=} param.originToBottom 地面の高さを形状の中心にする. dafalue = true.
     * @property {THREE.Geometry} geometry
     * @property {THREE.Material} material
     */
    vox.MeshBuilder = function(voxelData, param) {
        if (vox.MeshBuilder.textureFactory === null) vox.MeshBuilder.textureFactory = new vox.TextureFactory();
        
        param = param || {};
        this.voxelData = voxelData;
        this.voxelSize = param.voxelSize || vox.MeshBuilder.DEFAULT_PARAM.voxelSize;
        this.vertexColor = (param.vertexColor === undefined) ? vox.MeshBuilder.DEFAULT_PARAM.vertexColor : param.vertexColor;
        this.optimizeFaces = (param.optimizeFaces === undefined) ? vox.MeshBuilder.DEFAULT_PARAM.optimizeFaces : param.optimizeFaces;
        this.originToBottom = (param.originToBottom === undefined) ? vox.MeshBuilder.DEFAULT_PARAM.originToBottom : param.originToBottom;

        this.geometry = null;
        this.material = null;
        
        this.build();
    };

    vox.MeshBuilder.DEFAULT_PARAM = {
        voxelSize: 1.0,
        vertexColor: false,
        optimizeFaces: true,
        originToBottom: true,
    };

    /**
     * Voxelデータからジオメトリとマテリアルを作成する.
     */
    vox.MeshBuilder.prototype.build = function() {
        this.geometry = new THREE.Geometry();
        this.material = new THREE.MeshPhongMaterial();

        // 隣接ボクセル検索用ハッシュテーブル
        this.hashTable = createHashTable(this.voxelData.voxels);
        
        var offsetX = (this.voxelData.size.x - 1) * -0.5;
        var offsetY = (this.voxelData.size.y - 1) * -0.5;
        var offsetZ = (this.originToBottom) ? 0 : (this.voxelData.size.z - 1) * -0.5;
        var matrix = new THREE.Matrix4();
        this.voxelData.voxels.forEach(function(voxel) {
            var voxGeometry = this._createVoxGeometry(voxel);
            if (voxGeometry) {
                matrix.makeTranslation((voxel.x + offsetX) * this.voxelSize, (voxel.z + offsetZ) * this.voxelSize, -(voxel.y + offsetY) * this.voxelSize);
                this.geometry.merge(voxGeometry, matrix);
            }
        }.bind(this));

        if (this.optimizeFaces) {
            this.geometry.mergeVertices();
        }
        this.geometry.computeFaceNormals();
        
        if (this.vertexColor) {
            this.material.vertexColors = THREE.FaceColors;
        } else {
            this.material.map = vox.MeshBuilder.textureFactory.getTexture(this.voxelData);
        }
    };

    /**
     * @return {THREE.Texture}
     */
    vox.MeshBuilder.prototype.getTexture = function() {
        return vox.MeshBuilder.textureFactory.getTexture(this.voxelData);
    };

    vox.MeshBuilder.prototype._createVoxGeometry = function(voxel) {

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
            return new THREE.Vector3(voxel.x * this.voxelSize * 0.5, voxel.y * this.voxelSize * 0.5, voxel.z * this.voxelSize * 0.5);
        }.bind(this));

        // 面データ
        var voxFaces = voxFacesSource.map(function(f) {
            return {
                faceA: new THREE.Face3(f.faceA.a, f.faceA.b, f.faceA.c),
                faceB: new THREE.Face3(f.faceB.a, f.faceB.b, f.faceB.c),
            };
        });
        
        // 頂点色
        if (this.vertexColor) {
            var c = this.voxelData.palette[voxel.colorIndex];
            var color = new THREE.Color(c.r / 255, c.g / 255, c.b / 255);
        }

        var vox = new THREE.Geometry();
        vox.faceVertexUvs[0] = [];
        
        // 面を作る
        voxFaces.forEach(function(faces, i) {
            if (ignoreFaces.indexOf(i) >= 0) return;
            
            if (this.vertexColor) {
                faces.faceA.color = color;
                faces.faceB.color = color;
            } else {
                var uv = new THREE.Vector2((voxel.colorIndex + 0.5) / 256, 0.5);
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
    };

    /**
     * @return {THREE.Mesh}
     */
    vox.MeshBuilder.prototype.createMesh = function() {
        return new THREE.Mesh(this.geometry, this.material);
    };
    
    /**
     * 外側に面したボクセルか
     * @return {boolean}
     */
    vox.MeshBuilder.prototype.isOuterVoxel = function(voxel) {
        return six.filter(function(s) {
            return this.hashTable.has(voxel.x + s.x, voxel.y + s.y, voxel.z + s.z);
        }.bind(this)).length < 6;
    };

    /**
     * @static
     * @type {vox.TextureFactory}
     */
    vox.MeshBuilder.textureFactory = null;

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
        var result = 1;
        var prime = 2411;
        result = prime * result + x;
        result = prime * result + y;
        result = prime * result + z;
        return "" + result;
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

(function() {
    /**
     * @constructor
     */
    vox.TextureFactory = function() {};

    /**
     * @param {vox.VoxelData} voxelData
     * @return {HTMLCanvasElement}
     */
    vox.TextureFactory.prototype.createCanvas = function(voxelData) {
        var canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height= 1;
        var context = canvas.getContext("2d");
        for (var i = 0, len = voxelData.palette.length; i < len; i++) {
            var p = voxelData.palette[i];
            context.fillStyle = "rgb(" + p.r + "," + p.g + "," + p.b + ")";
            context.fillRect(i * 1, 0, 1, 1);
        }
        
        return canvas;
    };
    
    /**
     * パレット情報を元に作成したテクスチャを返す.
     * 生成されたテクスチャはキャッシュされ、同一のパレットからは同じテクスチャオブジェクトが返される.
     * @param {vox.VoxelData} voxelData
     * @return {THREE.Texture}
     */
    vox.TextureFactory.prototype.getTexture = function(voxelData) {
        var palette = voxelData.palette;
        var hashCode = getHashCode(palette);
        if (hashCode in cache) {
            // console.log("cache hit");
            return cache[hashCode];
        }
        
        var canvas = this.createCanvas(voxelData);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        
        cache[hashCode] = texture;
        
        return texture;
    };
    
    var cache = {};
    
    var getHashCode = function(palette) {
        var str = "";
        for (var i = 0; i < 256; i++) {
            var p = palette[i];
            str += hex(p.r);
            str += hex(p.g);
            str += hex(p.b);
            str += hex(p.a);
        }
        return vox.md5(str);
    };
    var hex = function(num) {
        var r = num.toString(16);
        return (r.length === 1) ? "0" + r : r;
    };

})();

(function() {

    /**
     * MagicaVoxelのデフォルトパレット
     * @static
     */    
    vox.defaultPalette = [
        {r:255,g:255,b:255,a:255},
        {r:255,g:255,b:255,a:255},
        {r:255,g:255,b:204,a:255},
        {r:255,g:255,b:153,a:255},
        {r:255,g:255,b:102,a:255},
        {r:255,g:255,b:51,a:255},
        {r:255,g:255,b:0,a:255},
        {r:255,g:204,b:255,a:255},
        {r:255,g:204,b:204,a:255},
        {r:255,g:204,b:153,a:255},
        {r:255,g:204,b:102,a:255},
        {r:255,g:204,b:51,a:255},
        {r:255,g:204,b:0,a:255},
        {r:255,g:153,b:255,a:255},
        {r:255,g:153,b:204,a:255},
        {r:255,g:153,b:153,a:255},
        {r:255,g:153,b:102,a:255},
        {r:255,g:153,b:51,a:255},
        {r:255,g:153,b:0,a:255},
        {r:255,g:102,b:255,a:255},
        {r:255,g:102,b:204,a:255},
        {r:255,g:102,b:153,a:255},
        {r:255,g:102,b:102,a:255},
        {r:255,g:102,b:51,a:255},
        {r:255,g:102,b:0,a:255},
        {r:255,g:51,b:255,a:255},
        {r:255,g:51,b:204,a:255},
        {r:255,g:51,b:153,a:255},
        {r:255,g:51,b:102,a:255},
        {r:255,g:51,b:51,a:255},
        {r:255,g:51,b:0,a:255},
        {r:255,g:0,b:255,a:255},
        {r:255,g:0,b:204,a:255},
        {r:255,g:0,b:153,a:255},
        {r:255,g:0,b:102,a:255},
        {r:255,g:0,b:51,a:255},
        {r:255,g:0,b:0,a:255},
        {r:204,g:255,b:255,a:255},
        {r:204,g:255,b:204,a:255},
        {r:204,g:255,b:153,a:255},
        {r:204,g:255,b:102,a:255},
        {r:204,g:255,b:51,a:255},
        {r:204,g:255,b:0,a:255},
        {r:204,g:204,b:255,a:255},
        {r:204,g:204,b:204,a:255},
        {r:204,g:204,b:153,a:255},
        {r:204,g:204,b:102,a:255},
        {r:204,g:204,b:51,a:255},
        {r:204,g:204,b:0,a:255},
        {r:204,g:153,b:255,a:255},
        {r:204,g:153,b:204,a:255},
        {r:204,g:153,b:153,a:255},
        {r:204,g:153,b:102,a:255},
        {r:204,g:153,b:51,a:255},
        {r:204,g:153,b:0,a:255},
        {r:204,g:102,b:255,a:255},
        {r:204,g:102,b:204,a:255},
        {r:204,g:102,b:153,a:255},
        {r:204,g:102,b:102,a:255},
        {r:204,g:102,b:51,a:255},
        {r:204,g:102,b:0,a:255},
        {r:204,g:51,b:255,a:255},
        {r:204,g:51,b:204,a:255},
        {r:204,g:51,b:153,a:255},
        {r:204,g:51,b:102,a:255},
        {r:204,g:51,b:51,a:255},
        {r:204,g:51,b:0,a:255},
        {r:204,g:0,b:255,a:255},
        {r:204,g:0,b:204,a:255},
        {r:204,g:0,b:153,a:255},
        {r:204,g:0,b:102,a:255},
        {r:204,g:0,b:51,a:255},
        {r:204,g:0,b:0,a:255},
        {r:153,g:255,b:255,a:255},
        {r:153,g:255,b:204,a:255},
        {r:153,g:255,b:153,a:255},
        {r:153,g:255,b:102,a:255},
        {r:153,g:255,b:51,a:255},
        {r:153,g:255,b:0,a:255},
        {r:153,g:204,b:255,a:255},
        {r:153,g:204,b:204,a:255},
        {r:153,g:204,b:153,a:255},
        {r:153,g:204,b:102,a:255},
        {r:153,g:204,b:51,a:255},
        {r:153,g:204,b:0,a:255},
        {r:153,g:153,b:255,a:255},
        {r:153,g:153,b:204,a:255},
        {r:153,g:153,b:153,a:255},
        {r:153,g:153,b:102,a:255},
        {r:153,g:153,b:51,a:255},
        {r:153,g:153,b:0,a:255},
        {r:153,g:102,b:255,a:255},
        {r:153,g:102,b:204,a:255},
        {r:153,g:102,b:153,a:255},
        {r:153,g:102,b:102,a:255},
        {r:153,g:102,b:51,a:255},
        {r:153,g:102,b:0,a:255},
        {r:153,g:51,b:255,a:255},
        {r:153,g:51,b:204,a:255},
        {r:153,g:51,b:153,a:255},
        {r:153,g:51,b:102,a:255},
        {r:153,g:51,b:51,a:255},
        {r:153,g:51,b:0,a:255},
        {r:153,g:0,b:255,a:255},
        {r:153,g:0,b:204,a:255},
        {r:153,g:0,b:153,a:255},
        {r:153,g:0,b:102,a:255},
        {r:153,g:0,b:51,a:255},
        {r:153,g:0,b:0,a:255},
        {r:102,g:255,b:255,a:255},
        {r:102,g:255,b:204,a:255},
        {r:102,g:255,b:153,a:255},
        {r:102,g:255,b:102,a:255},
        {r:102,g:255,b:51,a:255},
        {r:102,g:255,b:0,a:255},
        {r:102,g:204,b:255,a:255},
        {r:102,g:204,b:204,a:255},
        {r:102,g:204,b:153,a:255},
        {r:102,g:204,b:102,a:255},
        {r:102,g:204,b:51,a:255},
        {r:102,g:204,b:0,a:255},
        {r:102,g:153,b:255,a:255},
        {r:102,g:153,b:204,a:255},
        {r:102,g:153,b:153,a:255},
        {r:102,g:153,b:102,a:255},
        {r:102,g:153,b:51,a:255},
        {r:102,g:153,b:0,a:255},
        {r:102,g:102,b:255,a:255},
        {r:102,g:102,b:204,a:255},
        {r:102,g:102,b:153,a:255},
        {r:102,g:102,b:102,a:255},
        {r:102,g:102,b:51,a:255},
        {r:102,g:102,b:0,a:255},
        {r:102,g:51,b:255,a:255},
        {r:102,g:51,b:204,a:255},
        {r:102,g:51,b:153,a:255},
        {r:102,g:51,b:102,a:255},
        {r:102,g:51,b:51,a:255},
        {r:102,g:51,b:0,a:255},
        {r:102,g:0,b:255,a:255},
        {r:102,g:0,b:204,a:255},
        {r:102,g:0,b:153,a:255},
        {r:102,g:0,b:102,a:255},
        {r:102,g:0,b:51,a:255},
        {r:102,g:0,b:0,a:255},
        {r:51,g:255,b:255,a:255},
        {r:51,g:255,b:204,a:255},
        {r:51,g:255,b:153,a:255},
        {r:51,g:255,b:102,a:255},
        {r:51,g:255,b:51,a:255},
        {r:51,g:255,b:0,a:255},
        {r:51,g:204,b:255,a:255},
        {r:51,g:204,b:204,a:255},
        {r:51,g:204,b:153,a:255},
        {r:51,g:204,b:102,a:255},
        {r:51,g:204,b:51,a:255},
        {r:51,g:204,b:0,a:255},
        {r:51,g:153,b:255,a:255},
        {r:51,g:153,b:204,a:255},
        {r:51,g:153,b:153,a:255},
        {r:51,g:153,b:102,a:255},
        {r:51,g:153,b:51,a:255},
        {r:51,g:153,b:0,a:255},
        {r:51,g:102,b:255,a:255},
        {r:51,g:102,b:204,a:255},
        {r:51,g:102,b:153,a:255},
        {r:51,g:102,b:102,a:255},
        {r:51,g:102,b:51,a:255},
        {r:51,g:102,b:0,a:255},
        {r:51,g:51,b:255,a:255},
        {r:51,g:51,b:204,a:255},
        {r:51,g:51,b:153,a:255},
        {r:51,g:51,b:102,a:255},
        {r:51,g:51,b:51,a:255},
        {r:51,g:51,b:0,a:255},
        {r:51,g:0,b:255,a:255},
        {r:51,g:0,b:204,a:255},
        {r:51,g:0,b:153,a:255},
        {r:51,g:0,b:102,a:255},
        {r:51,g:0,b:51,a:255},
        {r:51,g:0,b:0,a:255},
        {r:0,g:255,b:255,a:255},
        {r:0,g:255,b:204,a:255},
        {r:0,g:255,b:153,a:255},
        {r:0,g:255,b:102,a:255},
        {r:0,g:255,b:51,a:255},
        {r:0,g:255,b:0,a:255},
        {r:0,g:204,b:255,a:255},
        {r:0,g:204,b:204,a:255},
        {r:0,g:204,b:153,a:255},
        {r:0,g:204,b:102,a:255},
        {r:0,g:204,b:51,a:255},
        {r:0,g:204,b:0,a:255},
        {r:0,g:153,b:255,a:255},
        {r:0,g:153,b:204,a:255},
        {r:0,g:153,b:153,a:255},
        {r:0,g:153,b:102,a:255},
        {r:0,g:153,b:51,a:255},
        {r:0,g:153,b:0,a:255},
        {r:0,g:102,b:255,a:255},
        {r:0,g:102,b:204,a:255},
        {r:0,g:102,b:153,a:255},
        {r:0,g:102,b:102,a:255},
        {r:0,g:102,b:51,a:255},
        {r:0,g:102,b:0,a:255},
        {r:0,g:51,b:255,a:255},
        {r:0,g:51,b:204,a:255},
        {r:0,g:51,b:153,a:255},
        {r:0,g:51,b:102,a:255},
        {r:0,g:51,b:51,a:255},
        {r:0,g:51,b:0,a:255},
        {r:0,g:0,b:255,a:255},
        {r:0,g:0,b:204,a:255},
        {r:0,g:0,b:153,a:255},
        {r:0,g:0,b:102,a:255},
        {r:0,g:0,b:51,a:255},
        {r:238,g:0,b:0,a:255},
        {r:221,g:0,b:0,a:255},
        {r:187,g:0,b:0,a:255},
        {r:170,g:0,b:0,a:255},
        {r:136,g:0,b:0,a:255},
        {r:119,g:0,b:0,a:255},
        {r:85,g:0,b:0,a:255},
        {r:68,g:0,b:0,a:255},
        {r:34,g:0,b:0,a:255},
        {r:17,g:0,b:0,a:255},
        {r:0,g:238,b:0,a:255},
        {r:0,g:221,b:0,a:255},
        {r:0,g:187,b:0,a:255},
        {r:0,g:170,b:0,a:255},
        {r:0,g:136,b:0,a:255},
        {r:0,g:119,b:0,a:255},
        {r:0,g:85,b:0,a:255},
        {r:0,g:68,b:0,a:255},
        {r:0,g:34,b:0,a:255},
        {r:0,g:17,b:0,a:255},
        {r:0,g:0,b:238,a:255},
        {r:0,g:0,b:221,a:255},
        {r:0,g:0,b:187,a:255},
        {r:0,g:0,b:170,a:255},
        {r:0,g:0,b:136,a:255},
        {r:0,g:0,b:119,a:255},
        {r:0,g:0,b:85,a:255},
        {r:0,g:0,b:68,a:255},
        {r:0,g:0,b:34,a:255},
        {r:0,g:0,b:17,a:255},

        {r:238,g:238,b:238,a:255},

        {r:221,g:221,b:221,a:255},
        {r:187,g:187,b:187,a:255},
        {r:170,g:170,b:170,a:255},
        {r:136,g:136,b:136,a:255},
        {r:119,g:119,b:119,a:255},
        {r:85,g:85,b:85,a:255},
        {r:68,g:68,b:68,a:255},
        {r:34,g:34,b:34,a:255},
        {r:17,g:17,b:17,a:255},
        // {r:0,g:0,b:0,a:255},
    ];
    
})();

(function() {



/* md5.js - MD5 Message-Digest
 * Copyright (C) 1999,2002 Masanao Izumo <iz@onicos.co.jp>
 * Version: 2.0.0
 * LastModified: May 13 2002
 *
 * This program is free software.  You can redistribute it and/or modify
 * it without any warranty.  This library calculates the MD5 based on RFC1321.
 * See RFC1321 for more information and algorism.
 */

/* Interface:
 * md5_128bits = MD5_hash(data);
 * md5_hexstr = MD5_hexhash(data);
 */

/* ChangeLog
 * 2002/05/13: Version 2.0.0 released
 * NOTICE: API is changed.
 * 2002/04/15: Bug fix about MD5 length.
 */


//    md5_T[i] = parseInt(Math.abs(Math.sin(i)) * 4294967296.0);
var MD5_T = new Array(0x00000000, 0xd76aa478, 0xe8c7b756, 0x242070db,
              0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613,
              0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1,
              0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e,
              0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51,
              0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681,
              0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87,
              0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9,
              0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
              0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60,
              0xbebfbc70, 0x289b7ec6, 0xeaa127fa, 0xd4ef3085,
              0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8,
              0xc4ac5665, 0xf4292244, 0x432aff97, 0xab9423a7,
              0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d,
              0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314,
              0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
              0xeb86d391);

var MD5_round1 = new Array(new Array( 0, 7, 1), new Array( 1,12, 2),
               new Array( 2,17, 3), new Array( 3,22, 4),
               new Array( 4, 7, 5), new Array( 5,12, 6),
               new Array( 6,17, 7), new Array( 7,22, 8),
               new Array( 8, 7, 9), new Array( 9,12,10),
               new Array(10,17,11), new Array(11,22,12),
               new Array(12, 7,13), new Array(13,12,14),
               new Array(14,17,15), new Array(15,22,16));

var MD5_round2 = new Array(new Array( 1, 5,17), new Array( 6, 9,18),
               new Array(11,14,19), new Array( 0,20,20),
               new Array( 5, 5,21), new Array(10, 9,22),
               new Array(15,14,23), new Array( 4,20,24),
               new Array( 9, 5,25), new Array(14, 9,26),
               new Array( 3,14,27), new Array( 8,20,28),
               new Array(13, 5,29), new Array( 2, 9,30),
               new Array( 7,14,31), new Array(12,20,32));

var MD5_round3 = new Array(new Array( 5, 4,33), new Array( 8,11,34),
               new Array(11,16,35), new Array(14,23,36),
               new Array( 1, 4,37), new Array( 4,11,38),
               new Array( 7,16,39), new Array(10,23,40),
               new Array(13, 4,41), new Array( 0,11,42),
               new Array( 3,16,43), new Array( 6,23,44),
               new Array( 9, 4,45), new Array(12,11,46),
               new Array(15,16,47), new Array( 2,23,48));

var MD5_round4 = new Array(new Array( 0, 6,49), new Array( 7,10,50),
               new Array(14,15,51), new Array( 5,21,52),
               new Array(12, 6,53), new Array( 3,10,54),
               new Array(10,15,55), new Array( 1,21,56),
               new Array( 8, 6,57), new Array(15,10,58),
               new Array( 6,15,59), new Array(13,21,60),
               new Array( 4, 6,61), new Array(11,10,62),
               new Array( 2,15,63), new Array( 9,21,64));

function MD5_F(x, y, z) { return (x & y) | (~x & z); }
function MD5_G(x, y, z) { return (x & z) | (y & ~z); }
function MD5_H(x, y, z) { return x ^ y ^ z;          }
function MD5_I(x, y, z) { return y ^ (x | ~z);       }

var MD5_round = new Array(new Array(MD5_F, MD5_round1),
              new Array(MD5_G, MD5_round2),
              new Array(MD5_H, MD5_round3),
              new Array(MD5_I, MD5_round4));

function MD5_pack(n32) {
  return String.fromCharCode(n32 & 0xff) +
     String.fromCharCode((n32 >>> 8) & 0xff) +
     String.fromCharCode((n32 >>> 16) & 0xff) +
     String.fromCharCode((n32 >>> 24) & 0xff);
}

function MD5_unpack(s4) {
  return  s4.charCodeAt(0)        |
     (s4.charCodeAt(1) <<  8) |
     (s4.charCodeAt(2) << 16) |
     (s4.charCodeAt(3) << 24);
}

function MD5_number(n) {
  while (n < 0)
    n += 4294967296;
  while (n > 4294967295)
    n -= 4294967296;
  return n;
}

function MD5_apply_round(x, s, f, abcd, r) {
  var a, b, c, d;
  var kk, ss, ii;
  var t, u;

  a = abcd[0];
  b = abcd[1];
  c = abcd[2];
  d = abcd[3];
  kk = r[0];
  ss = r[1];
  ii = r[2];

  u = f(s[b], s[c], s[d]);
  t = s[a] + u + x[kk] + MD5_T[ii];
  t = MD5_number(t);
  t = ((t<<ss) | (t>>>(32-ss)));
  t += s[b];
  s[a] = MD5_number(t);
}

function MD5_hash(data) {
  var abcd, x, state, s;
  var len, index, padLen, f, r;
  var i, j, k;
  var tmp;

  state = new Array(0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476);
  len = data.length;
  index = len & 0x3f;
  padLen = (index < 56) ? (56 - index) : (120 - index);
  if(padLen > 0) {
    data += "\x80";
    for(i = 0; i < padLen - 1; i++)
      data += "\x00";
  }
  data += MD5_pack(len * 8);
  data += MD5_pack(0);
  len  += padLen + 8;
  abcd = new Array(0, 1, 2, 3);
  x    = new Array(16);
  s    = new Array(4);

  for(k = 0; k < len; k += 64) {
    for(i = 0, j = k; i < 16; i++, j += 4) {
      x[i] = data.charCodeAt(j) |
        (data.charCodeAt(j + 1) <<  8) |
        (data.charCodeAt(j + 2) << 16) |
        (data.charCodeAt(j + 3) << 24);
    }
    for(i = 0; i < 4; i++)
      s[i] = state[i];
    for(i = 0; i < 4; i++) {
      f = MD5_round[i][0];
      r = MD5_round[i][1];
      for(j = 0; j < 16; j++) {
    MD5_apply_round(x, s, f, abcd, r[j]);
    tmp = abcd[0];
    abcd[0] = abcd[3];
    abcd[3] = abcd[2];
    abcd[2] = abcd[1];
    abcd[1] = tmp;
      }
    }

    for(i = 0; i < 4; i++) {
      state[i] += s[i];
      state[i] = MD5_number(state[i]);
    }
  }

  return MD5_pack(state[0]) +
     MD5_pack(state[1]) +
     MD5_pack(state[2]) +
     MD5_pack(state[3]);
}

function MD5_hexhash(data) {
    var i, out, c;
    var bit128;

    bit128 = MD5_hash(data);
    out = "";
    for(i = 0; i < 16; i++) {
    c = bit128.charCodeAt(i);
    out += "0123456789abcdef".charAt((c>>4) & 0xf);
    out += "0123456789abcdef".charAt(c & 0xf);
    }
    return out;
}



vox.md5 = MD5_hexhash;
})();
