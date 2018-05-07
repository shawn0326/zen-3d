(function() {
    var WEBGL_TEXTURE_FILTER = zen3d.WEBGL_TEXTURE_FILTER;
    var WEBGL_TEXTURE_WRAP = zen3d.WEBGL_TEXTURE_WRAP;
    var isWeb = zen3d.isWeb;

    function textureNeedsPowerOfTwo(texture) {
        if (texture.wrapS !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE || texture.wrapT !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE) return true;
        if (texture.minFilter !== WEBGL_TEXTURE_FILTER.NEAREST && texture.minFilter !== WEBGL_TEXTURE_FILTER.LINEAR) return true;

        return false;
    }

    function filterFallback(filter) {
        if (filter === WEBGL_TEXTURE_FILTER.NEAREST || filter === WEBGL_TEXTURE_FILTER.NEAREST_MIPMAP_LINEAR || filter === WEBGL_TEXTURE_FILTER.NEAREST_MIPMAP_NEAREST) {
            return WEBGL_TEXTURE_FILTER.NEAREST;
        }

        return WEBGL_TEXTURE_FILTER.LINEAR;
    }

    var _isPowerOfTwo = zen3d.isPowerOfTwo;
    var _nearestPowerOfTwo = zen3d.nearestPowerOfTwo;

    function isPowerOfTwo(image) {
        return _isPowerOfTwo(image.width) && _isPowerOfTwo(image.height);
    }

    function makePowerOf2(image) {
        if (isWeb && (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement)) {

            var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = _nearestPowerOfTwo(image.width);
            canvas.height = _nearestPowerOfTwo(image.height);

            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            console.warn('image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

            return canvas;

        }

        return image;
    }

    function clampToMaxSize(image, maxSize) {
        if (image.width > maxSize || image.height > maxSize) {

            if (!isWeb) {
                console.warn('image is too big (' + image.width + 'x' + image.height + '). max size is ' + maxSize + 'x' + maxSize, image);
                return image;
            }
            // Warning: Scaling through the canvas will only work with images that use
            // premultiplied alpha.

            var scale = maxSize / Math.max(image.width, image.height);

            var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = Math.floor(image.width * scale);
            canvas.height = Math.floor(image.height * scale);

            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            console.warn('image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

            return canvas;
        }

        return image;
    }

    var WebGLTexture = function(gl, state, properties, capabilities) {
        this.gl = gl;

        this.state = state;

        this.properties = properties;

        this.capabilities = capabilities;
    }

    WebGLTexture.prototype.setTexture2D = function(texture, slot) {
        var gl = this.gl;
        var state = this.state;

        var textureProperties = this.properties.get(texture);

        if (texture.version > 0 && textureProperties.__version !== texture.version) {

            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }

            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);

            var image = clampToMaxSize(texture.image, this.capabilities.maxTextureSize);

            if (textureNeedsPowerOfTwo(texture) && isPowerOfTwo(image) === false) {
                image = makePowerOf2(image);
            }

            var isPowerOfTwoImage = isPowerOfTwo(image);

            this.setTextureParameters(texture, isPowerOfTwoImage);

            var mipmap, mipmaps = texture.mipmaps,
                pixelFormat = texture.pixelFormat,
                pixelType = texture.pixelType;

            if(texture.isDataTexture) {
                if (mipmaps.length > 0 && isPowerOfTwoImage) {

                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, pixelFormat, mipmap.width, mipmap.height, texture.border, pixelFormat, pixelType, mipmap.data);
                    }

                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, image.width, image.height, texture.border, pixelFormat, pixelType, image.data);
                }
            } else {
                if (mipmaps.length > 0 && isPowerOfTwoImage) {

                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, pixelFormat, pixelFormat, pixelType, mipmap);
                    }

                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, pixelFormat, pixelType, image);
                }
            }

            if (texture.generateMipmaps && isPowerOfTwoImage) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }

            textureProperties.__version = texture.version;

            return;
        }

        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
    }

    WebGLTexture.prototype.setTextureCube = function(texture, slot) {
        var gl = this.gl;
        var state = this.state;

        var textureProperties = this.properties.get(texture);

        if (texture.version > 0 && textureProperties.__version !== texture.version) {

            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }

            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);

            var images = [];

            for (var i = 0; i < 6; i++) {
                images[i] = clampToMaxSize(texture.images[i], this.capabilities.maxCubemapSize);
            }

            var image = images[0];
            var isPowerOfTwoImage = isPowerOfTwo(image);

            this.setTextureParameters(texture, isPowerOfTwoImage);

            var pixelFormat = texture.pixelFormat,
                pixelType = texture.pixelType;

            for (var i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, pixelFormat, pixelFormat, pixelType, images[i]);
            }

            if (texture.generateMipmaps && isPowerOfTwoImage) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }

            textureProperties.__version = texture.version;

            return;
        }

        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
    }

    WebGLTexture.prototype.setTextureParameters = function(texture, isPowerOfTwoImage) {
        var gl = this.gl;
        var textureType = texture.textureType;

        if (isPowerOfTwoImage) {
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, texture.wrapS);
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, texture.wrapT);

            gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, texture.magFilter);
            gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, texture.minFilter);
        } else {
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            if (texture.wrapS !== gl.CLAMP_TO_EDGE || texture.wrapT !== gl.CLAMP_TO_EDGE) {
                console.warn('Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to zen3d.TEXTURE_WRAP.CLAMP_TO_EDGE.', texture);
            }

            gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, filterFallback(texture.magFilter));
            gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, filterFallback(texture.minFilter));

            if (
                (texture.minFilter !== gl.NEAREST && texture.minFilter !== gl.LINEAR) ||
                (texture.magFilter !== gl.NEAREST && texture.magFilter !== gl.LINEAR)
            ) {
                console.warn('Texture is not power of two. Texture.minFilter and Texture.magFilter should be set to zen3d.TEXTURE_FILTER.NEAREST or zen3d.TEXTURE_FILTER.LINEAR.', texture);
            }
        }

        // EXT_texture_filter_anisotropic
        var extension = this.capabilities.anisotropyExt;
        if(extension && texture.anisotropy > 1) {
            gl.texParameterf( textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, this.capabilities.maxAnisotropy));
        }
    }

    WebGLTexture.prototype.setRenderTarget2D = function(renderTarget) {
        var gl = this.gl;
        var state = this.state;

        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);

        if (textureProperties.__webglTexture === undefined || renderTargetProperties.__webglFramebuffer === undefined) {
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
            textureProperties.__webglTexture = gl.createTexture();
            renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

            state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);

            var isTargetPowerOfTwo = isPowerOfTwo(renderTarget);

            this.setTextureParameters(renderTarget.texture, isTargetPowerOfTwo);

            var pixelFormat = renderTarget.texture.pixelFormat,
                pixelType = renderTarget.texture.pixelType;
            gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, renderTarget.width, renderTarget.height, 0, pixelFormat, pixelType, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureProperties.__webglTexture, 0);

            if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }

            state.bindTexture(gl.TEXTURE_2D, null);

            if (renderTarget.depthBuffer) {
                renderTargetProperties.__webglDepthbuffer = gl.createRenderbuffer();

                var renderbuffer = renderTargetProperties.__webglDepthbuffer;

                gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

                if (renderTarget.stencilBuffer) {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                } else {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                }

                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            }

            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if(status !== gl.FRAMEBUFFER_COMPLETE) {
                if(status === gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
                    console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                } else if(status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
                    console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                } else if(status === gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
                    console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                } else if(status === gl.FRAMEBUFFER_UNSUPPORTED) {
                    console.warn("framebuffer not complete: FRAMEBUFFER_UNSUPPORTED");
                } else {
                    console.warn("framebuffer not complete.");
                }
            }

            return;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
    }

    WebGLTexture.prototype.setRenderTargetCube = function(renderTarget) {
        var gl = this.gl;
        var state = this.state;

        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);

        if (textureProperties.__webglTexture === undefined || renderTargetProperties.__webglFramebuffer === undefined) {
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
            textureProperties.__webglTexture = gl.createTexture();
            renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

            state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);

            var isTargetPowerOfTwo = isPowerOfTwo(renderTarget);

            this.setTextureParameters(renderTarget.texture, isTargetPowerOfTwo);

            var pixelFormat = renderTarget.texture.pixelFormat,
                pixelType = renderTarget.texture.pixelType;
            for (var i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, pixelFormat, renderTarget.width, renderTarget.height, 0, pixelFormat, pixelType, null);
            }
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);

            if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }

            state.bindTexture(gl.TEXTURE_CUBE_MAP, null);

            if (renderTarget.depthBuffer) {
                renderTargetProperties.__webglDepthbuffer = gl.createRenderbuffer();

                var renderbuffer = renderTargetProperties.__webglDepthbuffer;

                gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

                if (renderTarget.stencilBuffer) {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                } else {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                }

                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            }

            return;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
    }

    WebGLTexture.prototype.updateRenderTargetMipmap = function(renderTarget) {
        var gl = this.gl;
        var state = this.state;
        var texture = renderTarget.texture;

        if (texture.generateMipmaps && isPowerOfTwo(renderTarget) &&
            texture.minFilter !== gl.NEAREST &&
            texture.minFilter !== gl.LINEAR) {

            var target = texture.textureType;
            var webglTexture = this.properties.get(texture).__webglTexture;

            state.bindTexture(target, webglTexture);
            gl.generateMipmap(target);
            state.bindTexture(target, null);

        }
    }

    WebGLTexture.prototype.onTextureDispose = function(event) {
        var gl = this.gl;
        var texture = event.target;
        var textureProperties = this.properties.get(texture);

        texture.removeEventListener('dispose', this.onTextureDispose, this);

        if(textureProperties.__webglTexture) {
            gl.deleteTexture(textureProperties.__webglTexture);
        }

        this.properties.delete(texture);
    }

    WebGLTexture.prototype.onRenderTargetDispose = function(event) {
        var gl = this.gl;
        var renderTarget = event.target;
        var renderTargetProperties = this.properties.get(renderTarget);

        renderTarget.removeEventListener('dispose', this.onRenderTargetDispose, this);

        if(renderTargetProperties.__webglTexture) {
            gl.deleteTexture(textureProperties.__webglTexture);
        }

        if(renderTargetProperties.__webglFramebuffer) {
            gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer)
        }

        if(renderTargetProperties.__webglDepthbuffer) {
            gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer)
        }

        this.properties.delete(renderTarget);
    }

    WebGLTexture.prototype.setRenderTarget = function(target) {
        var gl = this.gl;
        var state = this.state;

        if (!target.texture) { // back RenderTarget
            if (state.currentRenderTarget === target) {

            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);

                state.currentRenderTarget = target;
            }

            return;
        }

        var isCube = target.activeCubeFace !== undefined;

        if (state.currentRenderTarget !== target) {
            if (!isCube) {
                this.setRenderTarget2D(target);
            } else {
                this.setRenderTargetCube(target);
            }

            state.currentRenderTarget = target;
        } else {
            if (isCube) {
                var textureProperties = this.properties.get(target.texture);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + target.activeCubeFace, textureProperties.__webglTexture, 0);
            }
        }
    }

    zen3d.WebGLTexture = WebGLTexture;
})();