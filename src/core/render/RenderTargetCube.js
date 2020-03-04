import { RenderTargetBase } from './RenderTargetBase.js';
import { TextureCube } from '../texture/TextureCube.js';
import { RenderBuffer } from './RenderBuffer.js';
import { ATTACHMENT, WEBGL_PIXEL_FORMAT } from '../const.js';

/**
 * Render Target that render to cube texture.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.RenderTargetBase
 * @param {number} width - The width of the render target.
 * @param {number} height - The height of the render target.
 */
function RenderTargetCube(width, height) {
	RenderTargetBase.call(this, width, height);

	this._attachments = {};

	this.attach(new TextureCube(), ATTACHMENT.COLOR_ATTACHMENT0);
	this.attach(new RenderBuffer(width, height, WEBGL_PIXEL_FORMAT.DEPTH_STENCIL), ATTACHMENT.DEPTH_STENCIL_ATTACHMENT);

	/**
     * The activeCubeFace property corresponds to a cube side (PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5).
     * @type {number}
     * @default 0
     */
	this.activeCubeFace = 0;
}

RenderTargetCube.prototype = Object.create(RenderTargetBase.prototype);
RenderTargetCube.prototype.constructor = RenderTargetCube;

RenderTargetCube.prototype = Object.assign(Object.create(RenderTargetBase.prototype), /** @lends zen3d.RenderTargetCube.prototype */{

	constructor: RenderTargetCube,

	/**
     * Attach a texture(RTT) or renderbuffer to the framebuffer.
     * Notice: For now, dynamic Attachment during rendering is not supported.
     * @param  {zen3d.TextureCube|zen3d.RenderBuffer} target
     * @param  {zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
     */
	attach: function(target, attachment) {
		if (target.isTexture) {
			var changed = false;

			for (var i = 0; i < 6; i++) {
				if (target.images[i] && target.images[i].rtt) {
					if (target.images[i].width !== this.width || target.images[i].height !== this.height) {
						target.images[i].width = this.width;
						target.images[i].height = this.height;
						changed = true;
					}
				} else {
					target.images[i] = { rtt: true, data: null, width: this.width, height: this.height };
					changed = true;
				}
			}

			if (changed) {
				target.version++;
			}
		} else {
			target.resize(this.width, this.height);
		}

		this._attachments[attachment || ATTACHMENT.COLOR_ATTACHMENT0] = target;
	},

	/**
     * Detach a or renderbuffer.
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
					for (var i = 0; i < 6; i++) {
						target.images[i] = { rtt: true, data: null, width: this.width, height: this.height };
					}
					target.version++;
				} else {
					target.resize(width, height);
				}
			}
		}
	},

});

Object.defineProperties(RenderTargetCube.prototype, {

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

export { RenderTargetCube };