import {WEBGL_TEXTURE_FILTER, WEBGL_TEXTURE_WRAP, ATTACHMENT} from '../../const.js';
import {isWeb, isPowerOfTwo, nearestPowerOfTwo} from '../../base.js';

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

function _isPowerOfTwo(image) {
    return isPowerOfTwo(image.width) && isPowerOfTwo(image.height);
}

function makePowerOf2(image) {
    if (isWeb && (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement)) {

        var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        canvas.width = nearestPowerOfTwo(image.width);
        canvas.height = nearestPowerOfTwo(image.height);

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

function WebGLTexture(gl, state, properties, capabilities) {
    this.gl = gl;

    this.state = state;

    this.properties = properties;

    this.capabilities = capabilities;
}

Object.assign(WebGLTexture.prototype, {

    setTexture2D: function(texture, slot) {
        slot = ( slot !== undefined ) ? slot : 0;

        var gl = this.gl;
        var state = this.state;
        var capabilities = this.capabilities;
    
        var textureProperties = this.properties.get(texture);
    
        if (texture.image && textureProperties.__version !== texture.version) {
    
            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }
    
            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
    
            var image = texture.image;
            var isElement = image instanceof HTMLImageElement || image instanceof HTMLCanvasElement;

            if ( isElement ) {
                image = clampToMaxSize(image, capabilities.maxTextureSize);

                if (textureNeedsPowerOfTwo(texture) && _isPowerOfTwo(image) === false) {
                    image = makePowerOf2(image);
                }
            }
    
            var isPowerOfTwoImage = _isPowerOfTwo(image);
    
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            this.setTextureParameters(texture, isPowerOfTwoImage);
    
            var mipmap, mipmaps = texture.mipmaps,
                format = texture.format,
                internalformat = texture.internalformat || texture.format,
                type = texture.type;

            if (capabilities.version === 1 && format !== internalformat) {
                console.warn("texture format " + format + " not same as internalformat " + internalformat + " in webgl 1.0.");
            }

            if ( isElement ) {
                if (mipmaps.length > 0 && isPowerOfTwoImage) {
    
                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, internalformat, format, type, mipmap);
                    }
    
                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, image);
                }
            } else {
                if (mipmaps.length > 0 && isPowerOfTwoImage) {
    
                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, internalformat, mipmap.width, mipmap.height, texture.border, format, type, mipmap.data);
                    }
    
                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, image.width, image.height, texture.border, format, type, image.data);
                }
            }
    
            if (texture.generateMipmaps && isPowerOfTwoImage) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
    
            textureProperties.__version = texture.version;
    
            return textureProperties;
        }
    
        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);

        return textureProperties;
    },

    setTextureCube: function(texture, slot) {
        slot = ( slot !== undefined ) ? slot : 0;

        var gl = this.gl;
        var state = this.state;
        var capabilities = this.capabilities;
    
        var textureProperties = this.properties.get(texture);
    
        if (texture.version > 0 && textureProperties.__version !== texture.version) {
    
            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }
    
            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
    
            var images = [];
            
            var format = texture.format,
            internalformat = texture.internalformat || texture.format,
            type = texture.type;

            if (capabilities.version === 1 && format !== internalformat) {
                console.warn("texture format " + format + " not same as internalformat " + internalformat + " in webgl 1.0.");
            }

            var isPowerOfTwoImage = true;
    
            for (var i = 0; i < 6; i++) {
                var image = texture.images[i];
                var isElement = image instanceof HTMLImageElement || image instanceof HTMLCanvasElement;

                if ( isElement ) {
                    image = clampToMaxSize(image, capabilities.maxTextureSize);
    
                    if (textureNeedsPowerOfTwo(texture) && _isPowerOfTwo(image) === false) {
                        image = makePowerOf2(image);
                    }
                }

                if ( !_isPowerOfTwo(image) ) {
                    isPowerOfTwoImage = false;
                }

                images[i] = image;
                image.__isElement = isElement;
            }
    
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            this.setTextureParameters(texture, isPowerOfTwoImage);

            for (var i = 0; i < 6; i++) {
                var image = images[i];
                var isElement = image.__isElement;

                if ( isElement ) {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalformat, format, type, image);
                } else {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalformat, image.width, image.height, texture.border, format, type, image.data);
                }
            }
    
            if (texture.generateMipmaps && isPowerOfTwoImage) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
    
            textureProperties.__version = texture.version;
    
            return textureProperties;
        }
    
        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);

        return textureProperties;
    },

    setTextureParameters: function(texture, isPowerOfTwoImage) {
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
    },

    setRenderTarget2D: function(renderTarget) {
        var gl = this.gl;
        var state = this.state;
    
        var renderTargetProperties = this.properties.get(renderTarget);
    
        if (renderTargetProperties.__webglFramebuffer === undefined) {
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
            
            renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();
    
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);

            var buffers = [];
            for (var attachment in renderTarget._textures) {
                var textureProperties = this.setTexture2D(renderTarget._textures[attachment]);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, textureProperties.__webglTexture, 0);
                state.bindTexture(gl.TEXTURE_2D, null);

                if ((Number(attachment) <= 0x8CE9 && Number(attachment) >= 0x8CE0) || (Number(attachment) <= 0x8CE15 && Number(attachment) >= 0x8CE10)) {
                    buffers.push(attachment);
                }
            }

            if ( buffers.length > 1 ) {
                if (this.capabilities.version === 2) {
                    gl.drawBuffers(buffers);
                } else if (this.capabilities.drawBuffersExt) {
                    var ext = this.capabilities.drawBuffersExt;
                    ext.drawBuffersWEBGL(buffers);
                }
            }
    
            if (renderTarget.depthBuffer) {
    
                if (!renderTarget._textures[ATTACHMENT.DEPTH_STENCIL_ATTACHMENT] && !renderTarget._textures[ATTACHMENT.DEPTH_ATTACHMENT]) {
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
    },

    setRenderTargetCube: function(renderTarget) {
        var gl = this.gl;
        var state = this.state;
    
        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);
    
        if (textureProperties.__webglTexture === undefined || renderTargetProperties.__webglFramebuffer === undefined) {
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
            
            renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();
    
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
    
            textureProperties = this.setTextureCube(renderTarget.texture);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
    
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
    
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
    },

    updateRenderTargetMipmap: function(renderTarget) {
        var gl = this.gl;
        var state = this.state;
        var texture = renderTarget.texture;
    
        if (texture.generateMipmaps && _isPowerOfTwo(renderTarget) &&
            texture.minFilter !== gl.NEAREST &&
            texture.minFilter !== gl.LINEAR) {
    
            var target = texture.textureType;
            var webglTexture = this.properties.get(texture).__webglTexture;
    
            state.bindTexture(target, webglTexture);
            gl.generateMipmap(target);
            state.bindTexture(target, null);
    
        }
    },

    onTextureDispose: function(event) {
        var gl = this.gl;
        var texture = event.target;
        var textureProperties = this.properties.get(texture);
    
        texture.removeEventListener('dispose', this.onTextureDispose, this);
    
        if(textureProperties.__webglTexture) {
            gl.deleteTexture(textureProperties.__webglTexture);
        }
    
        this.properties.delete(texture);
    },

    onRenderTargetDispose: function(event) {
        var gl = this.gl;
        var renderTarget = event.target;
        var renderTargetProperties = this.properties.get(renderTarget);
    
        renderTarget.removeEventListener('dispose', this.onRenderTargetDispose, this);
    
        if(renderTargetProperties.__webglFramebuffer) {
            gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer)
        }
    
        if(renderTargetProperties.__webglDepthbuffer) {
            gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer)
        }
    
        this.properties.delete(renderTarget);
    },

    setRenderTarget: function(target) {
        var gl = this.gl;
        var state = this.state;
    
        if (!!target.view) { // back RenderTarget
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

});

export {WebGLTexture};