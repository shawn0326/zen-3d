import { RenderTargetBase } from './RenderTargetBase.js';
import { Texture2D } from '../texture/Texture2D.js';
import { RenderBuffer } from './RenderBuffer.js';
import { ATTACHMENT, WEBGL_PIXEL_FORMAT } from '../const.js';

/**
 * Render Target that render to 2d texture.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.RenderTargetBase
 * @param {number} width - The width of the render target.
 * @param {number} height - The height of the render target.
 */
function RenderTarget2D(width, height) {
	RenderTargetBase.call(this, width, height);

	this._attachments = {};

	this.attach(new Texture2D(), ATTACHMENT.COLOR_ATTACHMENT0);
	this.attach(new RenderBuffer(width, height, WEBGL_PIXEL_FORMAT.DEPTH_STENCIL), ATTACHMENT.DEPTH_STENCIL_ATTACHMENT);
}

RenderTarget2D.prototype = Object.assign(Object.create(RenderTargetBase.prototype), /** @lends zen3d.RenderTarget2D.prototype */{

	constructor: RenderTarget2D,

	/**
     * Attach a texture(RTT) or renderbuffer to the framebuffer.
     * Notice: For now, dynamic Attachment during rendering is not supported.
     * @param  {zen3d.Texture2D|zen3d.RenderBuffer} target
     * @param  {zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
     */
	attach: function(target, attachment) {
		if (target.isTexture) {
			if (target.image && target.image.rtt) {
				if (target.image.width !== this.width || target.image.height !== this.height) {
					target.version++;
					target.image.width = this.width;
					target.image.height = this.height;
				}
			} else {
				target.version++;
				target.image = { rtt: true, data: null, width: this.width, height: this.height };
			}
		} else {
			target.resize(this.width, this.height);
		}
		
		this._attachments[attachment || ATTACHMENT.COLOR_ATTACHMENT0] = target;
	},

	/**
     * Detach a texture or renderbuffer.
     * @param  {zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
     */
	detach: function(attachment) {
		delete this._attachments[attachment || ATTACHMENT.COLOR_ATTACHMENT0];
	},

	/**
     * @override
     */
	resize: function(width, height) {
		var changed = RenderTargetBase.prototype.resize.call(this, width, height);

		if (changed) {
			for (var attachment in this._attachments) {
				var target = this._attachments[attachment];

				if (target.isTexture) {
					target.image = { rtt: true, data: null, width: this.width, height: this.height };
					target.version++;
				} else {
					target.resize(width, height);
				}
			}
		}

		return changed;
	},

});

Object.defineProperties(RenderTarget2D.prototype, {

	texture: {

		set: function(texture) {
			if (texture) {
				if (texture.isTexture) {
					this.attach(texture, ATTACHMENT.COLOR_ATTACHMENT0);
				}
			} else {
				this.detach(ATTACHMENT.COLOR_ATTACHMENT0);
			}
		},

		get: function() {
			var target = this._attachments[ATTACHMENT.COLOR_ATTACHMENT0];
			return target.isTexture ? target : null;
		}

	}

});

export { RenderTarget2D };