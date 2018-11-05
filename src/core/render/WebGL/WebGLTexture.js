import {WEBGL_TEXTURE_FILTER, WEBGL_TEXTURE_WRAP, WEBGL_PIXEL_TYPE, ATTACHMENT, WEBGL_PIXEL_FORMAT} from '../../const.js';
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

function getTextureParameters(texture, needFallback) {

    var wrapS = texture.wrapS,
    wrapT = texture.wrapT,
    magFilter = texture.magFilter,
    minFilter = texture.minFilter,
    anisotropy = texture.anisotropy,
    compare = texture.compare;

    // fix for non power of 2 image in WebGL 1.0
    if (needFallback) {
        wrapS = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;
        wrapT = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;

        if (texture.wrapS !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE || texture.wrapT !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE) {
            console.warn('Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to zen3d.TEXTURE_WRAP.CLAMP_TO_EDGE.', texture);
        }

        magFilter = filterFallback(texture.magFilter);
        minFilter = filterFallback(texture.minFilter);

        if (
            (texture.minFilter !== WEBGL_TEXTURE_FILTER.NEAREST && texture.minFilter !== WEBGL_TEXTURE_FILTER.LINEAR) ||
            (texture.magFilter !== WEBGL_TEXTURE_FILTER.NEAREST && texture.magFilter !== WEBGL_TEXTURE_FILTER.LINEAR)
        ) {
            console.warn('Texture is not power of two. Texture.minFilter and Texture.magFilter should be set to zen3d.TEXTURE_FILTER.NEAREST or zen3d.TEXTURE_FILTER.LINEAR.', texture);
        }
    }

    return [wrapS, wrapT, magFilter, minFilter, anisotropy, compare];
}

function WebGLTexture(gl, state, properties, capabilities) {
    this.gl = gl;

    this.state = state;

    this.properties = properties;

    this.capabilities = capabilities;

    // this.samplers = {};
}

Object.assign(WebGLTexture.prototype, {

    setTexture2D: function(texture, slot) {
        var gl = this.gl;
        var state = this.state;
        var capabilities = this.capabilities;

        if (slot !== undefined) {
            slot = gl.TEXTURE0 + slot;
        }
    
        var textureProperties = this.properties.get(texture);
    
        if (texture.image && (!texture.image.rtt || slot === undefined) && textureProperties.__version !== texture.version) {
    
            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }
    
            state.activeTexture(slot);
            state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
    
            var image = texture.image;
            var isElement = image instanceof HTMLImageElement || image instanceof HTMLCanvasElement;

            if ( isElement ) {
                image = clampToMaxSize(image, capabilities.maxTextureSize);

                if (textureNeedsPowerOfTwo(texture) && _isPowerOfTwo(image) === false && capabilities.version < 2) {
                    image = makePowerOf2(image);
                }
            }
    
            var needFallback = !_isPowerOfTwo(image) && capabilities.version < 2;
    
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            this.setTextureParameters(texture, needFallback);
    
            var mipmap, mipmaps = texture.mipmaps,
                format = texture.format,
                internalformat = texture.internalformat || texture.format,
                type = texture.type;

            if (capabilities.version < 2) {

                if (format !== internalformat) {
                    console.warn("texture format " + format + " not same as internalformat " + internalformat + " in webgl 1.0.");
                }

                if (type === WEBGL_PIXEL_TYPE.HALF_FLOAT) {
                    if (!capabilities.getExtension('OES_texture_half_float')) {
                        console.warn("extension OES_texture_half_float is not support in webgl 1.0.");
                    }
                }

                if (type === WEBGL_PIXEL_TYPE.FLOAT) {
                    if (!capabilities.getExtension('OES_texture_float')) {
                        console.warn("extension OES_texture_float is not support in webgl 1.0.");
                    }
                }

                if (format === WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT || format === WEBGL_PIXEL_FORMAT.DEPTH_STENCIL) {
                    if (!capabilities.getExtension('WEBGL_depth_texture')) {
                        console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
                    }
                }
                
            } else {
                if (type === WEBGL_PIXEL_TYPE.HALF_FLOAT) {
                    type = 0x140B; // webgl2 half float value
                }
            }

            if ( isElement ) {
                if (mipmaps.length > 0 && !needFallback) {
    
                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, internalformat, format, type, mipmap);
                    }
    
                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, image);
                }
            } else {
                if (mipmaps.length > 0 && !needFallback) {
    
                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, internalformat, mipmap.width, mipmap.height, texture.border, format, type, mipmap.data);
                    }
    
                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, image.width, image.height, texture.border, format, type, image.data);
                }
            }
    
            if (texture.generateMipmaps && !needFallback) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
    
            textureProperties.__version = texture.version;
    
            return textureProperties;
        }
    
        state.activeTexture(slot);
        state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);

        return textureProperties;
    },

    setTextureCube: function(texture, slot) {
        var gl = this.gl;
        var state = this.state;
        var capabilities = this.capabilities;

        if (slot !== undefined) {
            slot = gl.TEXTURE0 + slot;
        }
    
        var textureProperties = this.properties.get(texture);
    
        if ( texture.images.length === 6 && (!texture.images[0].rtt || slot === undefined) && textureProperties.__version !== texture.version ) {
    
            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }
    
            state.activeTexture(slot);
            state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
    
            var images = [];
            
            var format = texture.format,
            internalformat = texture.internalformat || texture.format,
            type = texture.type;

            if (capabilities.version < 2) {

                if (format !== internalformat) {
                    console.warn("texture format " + format + " not same as internalformat " + internalformat + " in webgl 1.0.");
                }

                if (type === WEBGL_PIXEL_TYPE.HALF_FLOAT) {
                    if (!capabilities.getExtension('OES_texture_half_float')) {
                        console.warn("extension OES_texture_half_float is not support in webgl 1.0.");
                    }
                }

                if (type === WEBGL_PIXEL_TYPE.FLOAT) {
                    if (!capabilities.getExtension('OES_texture_float')) {
                        console.warn("extension OES_texture_float is not support in webgl 1.0.");
                    }
                }

                if (format === WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT || format === WEBGL_PIXEL_FORMAT.DEPTH_STENCIL) {
                    if (!capabilities.getExtension('WEBGL_depth_texture')) {
                        console.warn("extension WEBGL_depth_texture is not support in webgl 1.0.");
                    }
                }
                
            } else {
                if (type === WEBGL_PIXEL_TYPE.HALF_FLOAT) {
                    type = 0x140B; // webgl2 half float value
                }
            }

            var needFallback = false;
    
            for (var i = 0; i < 6; i++) {
                var image = texture.images[i];
                var isElement = image instanceof HTMLImageElement || image instanceof HTMLCanvasElement;

                if ( isElement ) {
                    image = clampToMaxSize(image, capabilities.maxTextureSize);
    
                    if (textureNeedsPowerOfTwo(texture) && _isPowerOfTwo(image) === false && capabilities.version < 2) {
                        image = makePowerOf2(image);
                    }
                }

                if ( !_isPowerOfTwo(image) && capabilities.version < 2 ) {
                    needFallback = true;
                }

                images[i] = image;
                image.__isElement = isElement;
            }
    
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            this.setTextureParameters(texture, needFallback);

            for (var i = 0; i < 6; i++) {
                var image = images[i];
                var isElement = image.__isElement;

                if ( isElement ) {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalformat, format, type, image);
                } else {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalformat, image.width, image.height, texture.border, format, type, image.data);
                }
            }
    
            if (texture.generateMipmaps && !needFallback) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
    
            textureProperties.__version = texture.version;
    
            return textureProperties;
        }
    
        state.activeTexture(slot);
        state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);

        return textureProperties;
    },

    setTexture3D: function(texture, slot) {

        var gl = this.gl;
        var state = this.state;
        var capabilities = this.capabilities;

        if (capabilities.version < 2) {
            console.warn("Try to use Texture3D but browser not support WebGL2.0");
            return;
        }

        if (slot !== undefined) {
            slot = gl.TEXTURE0 + slot;
        }
    
        var textureProperties = this.properties.get(texture);

        if (texture.image && textureProperties.__version !== texture.version) {
            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }
    
            state.activeTexture(slot);
            state.bindTexture(gl.TEXTURE_3D, textureProperties.__webglTexture);
    
            var image = texture.image;

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            this.setTextureParameters(texture, false);
    
            var format = texture.format,
                internalformat = texture.internalformat || texture.format,
                type = texture.type;

            gl.texImage3D(gl.TEXTURE_3D, 0, internalformat, image.width, image.height, image.depth, texture.border, format, type, image.data);

            if (texture.generateMipmaps) {
                gl.generateMipmap(gl.TEXTURE_3D);
            }

            textureProperties.__version = texture.version;
    
            return textureProperties;
        }

        state.activeTexture(slot);
        state.bindTexture(gl.TEXTURE_3D, textureProperties.__webglTexture);

        return textureProperties;

    },

    setTextureParameters: function(texture, needFallback) {
        var gl = this.gl;
        var capabilities = this.capabilities;
        var textureType = texture.textureType;

        var parameters = getTextureParameters(texture, needFallback);
        
        // TODO sampler bug
        // if (capabilities.version >= 2) {
        //     var samplerKey = parameters.join("_");

        //     if (!this.samplers[samplerKey]) {
        //         var samplerA = gl.createSampler();

        //         gl.samplerParameteri(samplerA, gl.TEXTURE_WRAP_S, parameters[0]);
        //         gl.samplerParameteri(samplerA, gl.TEXTURE_WRAP_T, parameters[1]);

        //         gl.samplerParameteri(samplerA, gl.TEXTURE_MAG_FILTER, parameters[2]);
        //         gl.samplerParameteri(samplerA, gl.TEXTURE_MIN_FILTER, parameters[3]);

        //         // anisotropy if EXT_texture_filter_anisotropic exist
        //         // TODO bug here: https://github.com/KhronosGroup/WebGL/issues/2006
        //         // var extension = capabilities.anisotropyExt;
        //         // if (extension) {
        //         //     gl.samplerParameterf(samplerA, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(parameters[4], capabilities.maxAnisotropy));
        //         // }

        //         this.samplers[samplerKey] = samplerA;
        //     }

        //     gl.bindSampler(this.state.currentTextureSlot - gl.TEXTURE0, this.samplers[samplerKey]);
        // } else {
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, parameters[0]);
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, parameters[1]);

            gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, parameters[2]);
            gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, parameters[3]);

            // anisotropy if EXT_texture_filter_anisotropic exist
            var extension = capabilities.anisotropyExt;
            if (extension) {
                gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(parameters[4], capabilities.maxAnisotropy));
            }

            if (capabilities.version >= 2) {
                if (parameters[5] > 0) {
                    gl.texParameteri(textureType, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                    gl.texParameteri(textureType, gl.TEXTURE_COMPARE_FUNC, parameters[5]);
                } else {
                    gl.texParameteri(textureType, gl.TEXTURE_COMPARE_MODE, gl.NONE);
                }
            }
        // }
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
    }

});

export {WebGLTexture};