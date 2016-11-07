(function() {
    /**
     * Geometry data
     * @class
     */
    var Geometry = function() {

        this.verticesArray = new Array();

        this.indicesArray = new Array();

        this.verticesBuffer = null;

        this.indicesBuffer = null;

        this.drawLen = 0;

        this.vertexCount = 0;

        this.vertexSize = 17; // static

        this.boundingBox = new zen3d.Box3();

        this.boundingSphere = new zen3d.Sphere();

        this.dirty = true;
    }

    Geometry.prototype.bind = function(render) {
        if(this.dirty) {
            this.upload(render);
            this.dirty = false;
        } else {
            var gl = render.gl;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        }

        return this.drawLen;
    }

    Geometry.prototype.upload = function(render) {
        var gl = render.gl;

        if(!this.verticesBuffer || !this.indicesBuffer) {
            this.verticesBuffer = gl.createBuffer();
            this.indicesBuffer = gl.createBuffer();
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

        var vertices = new Float32Array(this.verticesArray);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        var indices = new Uint16Array(this.indicesArray);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        this.drawLen = this.indicesArray.length;
        this.vertexCount = this.verticesArray.length / this.vertexSize;
    }

    Geometry.prototype.computeBoundingBox = function() {
        this.boundingBox.setFromArray(this.verticesArray, this.vertexSize);
    }

    Geometry.prototype.computeBoundingSphere = function() {
        this.boundingSphere.setFromArray(this.verticesArray, this.vertexSize);
    }

    zen3d.Geometry = Geometry;
})();
