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
        this.orthoCamera.setOrtho(- this.width / 2, this.width / 2, - this.height / 2, this.height / 2, 0, 1);
        this.orthoCamera.viewMatrix.getInverse(this.orthoCamera.worldMatrix);// update view matrix
    }

    zen3d.inherit(Canvas2D, zen3d.Object3D);

    Canvas2D.prototype.addSprite = function(sprite) {
        this.sprites.push(sprite);
    }

    Canvas2D.prototype.updateSprites = function() {
        var geometry = this.geometry;
        var vertices = geometry.verticesArray;
        var indices = geometry.indicesArray;
        var vertexIndex = 0,
            indexIndex = 0;

        var sprites = this.sprites;

        for(var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];

            var x = sprite.x - this.width / 2;
            var y = sprite.y - this.height / 2;
            var w = sprite.width;
            var h = sprite.height;

            vertices[vertexIndex++] = x;
            vertices[vertexIndex++] = y;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;

            vertices[vertexIndex++] = x + w;
            vertices[vertexIndex++] = y;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;
            vertices[vertexIndex++] = 1;

            vertices[vertexIndex++] = x + w;
            vertices[vertexIndex++] = y + h;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 1;
            vertices[vertexIndex++] = 0;

            vertices[vertexIndex++] = x;
            vertices[vertexIndex++] = y + h;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;
            vertices[vertexIndex++] = 0;

            var vertCount = vertexIndex / 5 - 4;

            indices[indexIndex++] = vertCount + 2;
            indices[indexIndex++] = vertCount + 1;
            indices[indexIndex++] = vertCount + 0;
            indices[indexIndex++] = vertCount + 0;
            indices[indexIndex++] = vertCount + 3;
            indices[indexIndex++] = vertCount + 2;
        }
        vertices.length = vertexIndex;
        indices.length = indexIndex;

        geometry.dirty = true;

        // drawArray
        this.drawArray = [];
        var currentTexture;
        for(var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if(currentTexture !== sprite.texture) {
                this.drawArray.push({texture: sprite.texture, count: 1});
                currentTexture = sprite.texture;
            } else {
                this.drawArray[this.drawArray.length - 1].count++;
            }
        }

    }

    // override
    Canvas2D.prototype.updateMatrix = function() {
        Canvas2D.superClass.updateMatrix.call(this);

        // update geometry
        this.updateSprites();
    }

    zen3d.Canvas2D = Canvas2D;
})();