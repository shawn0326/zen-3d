import { EventDispatcher } from '../EventDispatcher.js';
import { BLEND_TYPE, BLEND_EQUATION, BLEND_FACTOR, ENVMAP_COMBINE_TYPE, DRAW_SIDE, SHADING_TYPE, DRAW_MODE, WEBGL_COMPARE_FUNC } from '../const.js';
import { Color3 } from '../math/Color3.js';
import { generateUUID } from '../base.js';

var materialId = 0;

/**
 * Abstract base class for materials.
 * Materials describe the appearance of {@link zen3d.Object3D}.
 * They are defined in a (mostly) renderer-independent way, so you don't have to rewrite materials if you decide to use a different renderer.
 * The following properties and methods are inherited by all other material types (although they may have different defaults).
 * @constructor
 * @abstract
 * @memberof zen3d
 */
function Material() {
	EventDispatcher.call(this);

	Object.defineProperty(this, 'id', { value: materialId++ });

	// material type
	this.type = "";

	/**
     * UUID of this material instance.
     * This gets automatically assigned, so this shouldn't be edited.
     * @type {string}
     */
	this.uuid = generateUUID();

	/**
      * Override the renderer's default precision for this material.
      * Can be "highp", "mediump" or "lowp".
      * @type {string}
      * @default null
      */
	this.precision = null;

	/**
     * Float in the range of 0.0 - 1.0 indicating how transparent the material is.
     * A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
     * @type {number}
     * @default 1
     */
	this.opacity = 1;

	/**
     * Defines whether this material is transparent.
     * This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects.
     * When set to true, the extent to which the material is transparent is controlled by setting it's blending property.
     * @type {boolean}
     * @default false
     */
	this.transparent = false;

	/**
     * Which blending to use when displaying objects with this material.
     * This must be set to zen3d.BLEND_TYPE.CUSTOM to use custom blendSrc, blendDst or blendEquation.
     * @type {zen3d.BLEND_TYPE}
     * @default zen3d.BLEND_TYPE.NORMAL
     */
	this.blending = BLEND_TYPE.NORMAL;

	/**
     * Blending source.
     * The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
     * @type {zen3d.BLEND_FACTOR}
     * @default zen3d.BLEND_FACTOR.SRC_ALPHA
     */
	this.blendSrc = BLEND_FACTOR.SRC_ALPHA;

	/**
     * Blending destination.
     * The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
     * @type {zen3d.BLEND_FACTOR}
     * @default zen3d.BLEND_FACTOR.ONE_MINUS_SRC_ALPHA
     */
	this.blendDst = BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;

	/**
     * Blending equation to use when applying blending.
     * The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
     * @type {zen3d.BLEND_EQUATION}
     * @default zen3d.BLEND_EQUATION.ADD
     */
	this.blendEquation = BLEND_EQUATION.ADD;

	/**
     * The transparency of the {@link zen3d.Material#blendSrc}.
     * The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
     * @type {zen3d.BLEND_FACTOR}
     * @default null
     */
	this.blendSrcAlpha = null;

	/**
     * The transparency of the {@link zen3d.Material#blendDst}.
     * The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
     * @type {zen3d.BLEND_FACTOR}
     * @default null
     */
	this.blendDstAlpha = null;

	/**
     * The tranparency of the {@link zen3d.Material#blendEquation}.
     * The {@link zen3d.Material#blending} must be set to zen3d.BLEND_TYPE.CUSTOM for this to have any effect.
     * @type {zen3d.BLEND_EQUATION}
     * @default null
     */
	this.blendEquationAlpha = null;

	/**
     * Whether to premultiply the alpha (transparency) value.
     * @type {boolean}
     * @default false
     */
	this.premultipliedAlpha = false;

	/**
     * Defines whether vertex coloring is used.
     * @type {zen3d.VERTEX_COLOR}
     * @default zen3d.VERTEX_COLOR.NONE
     */
	this.vertexColors = zen3d.VERTEX_COLOR.NONE;

	/**
     * The diffuse color.
     * @type {zen3d.Color3}
     * @default zen3d.Color3(0xffffff)
     */
	this.diffuse = new Color3(0xffffff);

	/**
     * The diffuse map.
     * @type {zen3d.Texture2D}
     * @default null
     */
	this.diffuseMap = null;

	/**
     * Define the UV chanel for the diffuse map to use starting from 0 and defaulting to 0.
     * @type {number}
     * @default 0
     */
	this.diffuseMapCoord = 0;

	/**
     * The normal map.
     * @type {zen3d.Texture2D}
     * @default null
     */
	this.normalMap = null;

	/**
     * The alpha map.
     * @type {zen3d.Texture2D}
     * @default null
     */
	this.alphaMap = null;

	/**
     * Define the UV chanel for the alpha map to use starting from 0 and defaulting to 0.
     * @type {number}
     * @default 0
     */
	this.alphaMapCoord = 0;

	/**
     * The red channel of this texture is used as the ambient occlusion map.
     * @type {zen3d.Texture2D}
     * @default null
     */
	this.aoMap = null;

	/**
     * Intensity of the ambient occlusion effect.
     * @type {number}
     * @default 1
     */
	this.aoMapIntensity = 1.0;

	/**
     * Define the UV chanel for the ao map to use starting from 0 and defaulting to 0.
     * @type {number}
     * @default 0
     */
	this.aoMapCoord = 0;

	/**
     * The texture to create a bump map.
     * The black and white values map to the perceived depth in relation to the lights. Bump doesn't actually affect the geometry of the object, only the lighting.
     * @type {zen3d.Texture2D}
     * @default null
     */
	this.bumpMap = null;

	/**
     * How much the bump map affects the material.
     * Typical ranges are 0-1.
     * @type {number}
     * @default 1
     */
	this.bumpScale = 1;

	/**
     * The environment map.
     * @type {zen3d.TextureCube}
     * @default null
     */
	this.envMap = null;

	/**
     * Scales the effect of the environment map by multiplying its color.
     * @type {number}
     * @default 1
     */
	this.envMapIntensity = 1;

	/**
     * How to combine the result of the surface's color with the environment map, if any.
     * This has no effect in a {@link zen3d.PBRMaterial}.
     * @type {zen3d.ENVMAP_COMBINE_TYPE}
     * @default zen3d.ENVMAP_COMBINE_TYPE.MULTIPLY
     */
	this.envMapCombine = ENVMAP_COMBINE_TYPE.MULTIPLY;

	/**
     * Emissive (light) color of the material, essentially a solid color unaffected by other lighting.
     * @type {zen3d.Color3}
     * @default zen3d.Color3(0x000000)
     */
	this.emissive = new Color3(0x000000);

	/**
     * Set emissive (glow) map.
     * The emissive map color is modulated by the emissive color and the emissive intensity.
     * If you have an emissive map, be sure to set the emissive color to something other than black.
     * @type {zen3d.Texture2D}
     * @default null
     */
	this.emissiveMap = null;

	/**
     * Intensity of the emissive light.
     * Modulates the emissive color.
     * @type {number}
     * @default 1
     */
	this.emissiveIntensity = 1;

	/**
      * Which depth function to use. See the {@link zen3d.WEBGL_COMPARE_FUNC} constants for all possible values.
      * @type {zen3d.WEBGL_COMPARE_FUNC}
      * @default zen3d.WEBGL_COMPARE_FUNC.LEQUAL
      */
	this.depthFunc = WEBGL_COMPARE_FUNC.LEQUAL;

	/**
     * Whether to have depth test enabled when rendering this material.
     * @type {boolean}
     * @default true
     */
	this.depthTest = true;

	/**
     * Whether rendering this material has any effect on the depth buffer.
     * When drawing 2D overlays it can be useful to disable the depth writing in order to layer several things together without creating z-index artifacts.
     * @type {boolean}
     * @default true
     */
	this.depthWrite = true;

	/**
     * Whether to render the material's color.
     * This can be used in conjunction with a mesh's renderOrder property to create invisible objects that occlude other objects.
     * @type {boolean}
     * @default true
     */
	this.colorWrite = true;

	/**
     * Sets the alpha value to be used when running an alpha test.
     * The material will not be renderered if the opacity is lower than this value.
     * @type {number}
     * @default 0
     */
	this.alphaTest = 0;

	/**
     * Defines which side of faces will be rendered - front, back or double.
     * @type {zen3d.DRAW_SIDE}
     * @default zen3d.DRAW_SIDE.FRONT
     */
	this.side = DRAW_SIDE.FRONT;

	/**
     * Whether to use polygon offset.
     * This corresponds to the GL_POLYGON_OFFSET_FILL WebGL feature.
     * @type {boolean}
     * @default false
     */
	this.polygonOffset = false;

	/**
     * Sets the polygon offset factor.
     * @type {number}
     * @default 0
     */
	this.polygonOffsetFactor = 0;

	/**
     * Sets the polygon offset units.
     * @type {number}
     * @default 0
     */
	this.polygonOffsetUnits = 0;

	/**
     * Define whether the material is rendered with flat shading or smooth shading.
     * @type {zen3d.SHADING_TYPE}
     * @default zen3d.SHADING_TYPE.SMOOTH_SHADING
     */
	this.shading = SHADING_TYPE.SMOOTH_SHADING;

	/**
      * Whether to apply dithering to the color to remove the appearance of banding.
      * @type {boolean}
      * @default false
      */
	this.dithering = false;

	/**
     * Whether the material is affected by lights.
     * If set true, renderer will try to upload light uniforms.
     * @type {boolean}
     * @default false
     */
	this.acceptLight = false;

	/**
     * Determines how the mesh triangles are constructed from the vertices.
     * @type {zen3d.DRAW_MODE}
     * @default zen3d.DRAW_MODE.TRIANGLES
     */
	this.drawMode = DRAW_MODE.TRIANGLES;

	/**
     * Specifies that the material needs to be recompiled.
     * This property is automatically set to true when instancing a new material.
     * @type {boolean}
     * @default true
     */
	this.needsUpdate = true;
}

Material.prototype = Object.assign(Object.create(EventDispatcher.prototype), /** @lends zen3d.Material.prototype */{

	constructor: Material,

	/**
     * Copy the parameters from the passed material into this material.
     * @param {zen3d.Material} source - The material to be copied.
     * @return {zen3d.Material}
     */
	copy: function(source) {
		this.type = source.type;
		this.precision = source.precision;
		this.opacity = source.opacity;
		this.transparent = source.transparent;
		this.premultipliedAlpha = source.premultipliedAlpha;
		this.vertexColors = source.vertexColors;
		this.diffuse.copy(source.diffuse);
		this.diffuseMap = source.diffuseMap;
		this.diffuseMapCoord = source.diffuseMapCoord;
		this.alphaMap = source.alphaMap;
		this.alphaMapCoord = source.alphaMapCoord;
		this.normalMap = source.normalMap;
		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;
		this.aoMapCoord = source.aoMapCoord;
		this.bumpMap = source.bumpMap;
		this.bumpScale = source.bumpScale;
		this.envMap = source.envMap;
		this.envMapIntensity = source.envMapIntensity;
		this.envMapCombine = source.envMapCombine;
		this.emissive.copy(source.emissive);
		this.emissiveMap = source.emissiveMap;
		this.emissiveIntensity = source.emissiveIntensity;
		this.blending = source.blending;
		this.depthFunc = source.depthFunc;
		this.depthTest = source.depthTest;
		this.depthWrite = source.depthWrite;
		this.colorWrite = source.colorWrite;
		this.alphaTest = source.alphaTest;
		this.side = source.side;
		this.polygonOffset = source.polygonOffset;
		this.polygonOffsetFactor = source.polygonOffsetFactor;
		this.polygonOffsetUnits = source.polygonOffsetUnits;
		this.dithering = source.dithering;
		this.shading = source.shading;
		this.acceptLight = source.acceptLight;
		this.drawMode = source.drawMode;

		return this;
	},

	/**
     * Return a new material with the same parameters as this material.
     * @return {zen3d.Material}
     */
	clone: function() {
		return new this.constructor().copy(this);
	},

	/**
     * This disposes the material.
     * Textures of a material don't get disposed. These needs to be disposed by Texture.
     */
	dispose: function() {
		this.dispatchEvent({ type: 'dispose' });
	}

});

export { Material };
