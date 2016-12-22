(function() {
    /**
     * Canvas2D
     * now is alway behind 3d objects...
     *
     * TODO maybe i can add another type of Canvas2D, it can insert to 3D depth test
     * but i think this must request a framebuffer!! *_*
     *
     */
    var Canvas2D = function(width, height) {
        Canvas2D.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.CANVAS2D;

        this.geometry = new zen3d.Geometry();
        this.geometry.vertexSize = 5;
        this.material = new zen3d.Canvas2DMaterial();

        this.width = (width !== undefined) ? width : 0;
        this.height = (height !== undefined) ? height : 0;

        this.sprites = [];
        this.drawArray = [];

        // screen space canvas or world space canvas
        this.isScreenCanvas = true;

        this.frustumCulled = false;

        // screen canvas used ortho camera
        this.orthoCamera = new zen3d.Camera();
        this.orthoCamera.setOrtho(-this.width / 2, this.width / 2, -this.height / 2, this.height / 2, 0, 1);
        this.orthoCamera.viewMatrix.getInverse(this.orthoCamera.worldMatrix); // update view matrix
    }

    zen3d.inherit(Canvas2D, zen3d.Object3D);

    /**
     * add child to canvas2d
     */
    Canvas2D.prototype.add = function(object) {
        this.children.push(object);
    }

    /**
     * remove child from canvas2d
     */
    Canvas2D.prototype.remove = function(object) {
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    Canvas2D.prototype.updateSprites = function() {
        var geometry = this.geometry;
        var vertices = geometry.verticesArray;
        var indices = geometry.indicesArray;
        var vertexIndex = 0,
            indexIndex = 0;

        var sprites = this.sprites;

        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];

            var x = 0;
            var y = 0;
            var w = sprite.width;
            var h = sprite.height;

            var _x, _y;
            var t = sprite.worldMatrix.elements;
            var a = t[0],
                b = t[1],
                c = t[3],
                d = t[4],
                tx = t[6] - this.width / 2,
                ty = this.height / 2 - t[7] - h;

            _x = x;
            _y = y;
            vertices[vertexIndex++] = a * _x + c * _y + tx;
            vertices[vertexIndex++] = b * _x + d * _y + ty;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;

            _x = x + w;
            _y = y;
            vertices[vertexIndex++] = a * _x + c * _y + tx;
            vertices[vertexIndex++] = b * _x + d * _y + ty;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;
            vertices[vertexIndex++] = 1;

            _x = x + w;
            _y = y + h;
            vertices[vertexIndex++] = a * _x + c * _y + tx;
            vertices[vertexIndex++] = b * _x + d * _y + ty;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;
            vertices[vertexIndex++] = 0;

            _x = x;
            _y = y + h;
            vertices[vertexIndex++] = a * _x + c * _y + tx;
            vertices[vertexIndex++] = b * _x + d * _y + ty;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;

            var vertCount = vertexIndex / 5 - 4;

            indices[indexIndex++] = vertCount + 0;
            indices[indexIndex++] = vertCount + 1;
            indices[indexIndex++] = vertCount + 2;
            indices[indexIndex++] = vertCount + 2;
            indices[indexIndex++] = vertCount + 3;
            indices[indexIndex++] = vertCount + 0;
        }
        vertices.length = vertexIndex;
        indices.length = indexIndex;

        geometry.dirty = true;

        // drawArray
        this.drawArray = [];
        var currentTexture;
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (currentTexture !== sprite.texture) {
                this.drawArray.push({
                    texture: sprite.texture,
                    count: 1
                });
                currentTexture = sprite.texture;
            } else {
                this.drawArray[this.drawArray.length - 1].count++;
            }
        }

    }

    // override
    Canvas2D.prototype.updateMatrix = function() {
        Canvas2D.superClass.updateMatrix.call(this);

        this.sprites = [];

        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            this.cacheSprites(children[i]);
        }

        var sprites = this.sprites;
        for (var i = 0, l = sprites.length; i < l; i++) {
            sprites[i].updateMatrix();
        }

        // update geometry
        this.updateSprites();
    }

    Canvas2D.prototype.cacheSprites = function(object) {
        var sprites = this.sprites;

        sprites.push(object);

        for(var i = 0, l = object.children.length; i < l; i++) {
            this.cacheSprites(object.children[i]);
        }
    }

    zen3d.Canvas2D = Canvas2D;
})();