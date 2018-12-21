import { PropertyBindingMixer } from './PropertyBindingMixer.js';

/**
 * The AnimationMixer is a player for animations on a particular object in the scene.
 * When multiple objects in the scene are animated independently, one AnimationMixer may be used for each object.
 * @constructor
 * @memberof zen3d
 */
function AnimationMixer() {
	this._clips = {};

	this._bindings = {};

	this._activeClips = {};
}

Object.assign(AnimationMixer.prototype, /** @lends zen3d.AnimationMixer.prototype */{

	add: function(clip) {
		if (this._clips[clip.name] !== undefined) {
			console.warn("AnimationMixer.add: already has clip: " + clip.name);
			return;
		}

		var tracks = clip.tracks;

		for (var i = 0; i < tracks.length; i++) {
			var track = tracks[i];
			var trackName = track.name;
			var binding;

			if (!this._bindings[trackName]) {
				binding = new PropertyBindingMixer(track.target, track.propertyPath, track.valueTypeName, track.valueSize);
				this._bindings[trackName] = binding;
			} else {
				binding = this._bindings[trackName];
			}

			binding.referenceCount++;
		}

		this._clips[clip.name] = clip;
	},

	remove: function(clip) {
		if (!this._clips[clip.name]) {
			console.warn("AnimationMixer.remove: has no clip: " + clip.name);
			return;
		}

		var tracks = clip.tracks;

		for (var i = 0; i < tracks.length; i++) {
			var track = tracks[i];
			var trackName = track.name;
			var binding = this._bindings[trackName];

			if (binding) {
				binding.referenceCount--;
			}

			if (binding.referenceCount <= 0) {
				delete this._bindings[trackName];
			}
		}

		delete this._clips[clip.name];
	},

	play: function(name, weight) {
		if (this._activeClips[name] !== undefined) {
			console.warn("AnimationMixer.play: clip " + name + " is playing.");
			return;
		}

		this._activeClips[name] = (weight === undefined) ? 1 : weight;

		var clip = this._clips[name];

		if (!clip) {
			console.warn("AnimationMixer.stop: clip " + name + " is not found.");
			return;
		}

		clip.frame = 0;

		var tracks = clip.tracks;

		for (var i = 0; i < tracks.length; i++) {
			var track = tracks[i];
			var trackName = track.name;
			var binding = this._bindings[trackName];

			if (binding) {
				binding.useCount++;
			}
		}
	},

	stop: function(name) {
		if (this._activeClips[name] === undefined) {
			console.warn("AnimationMixer.stop: clip " + name + " is not playing.");
			return;
		}

		delete this._activeClips[name];

		var clip = this._clips[name];

		if (!clip) {
			console.warn("AnimationMixer.stop: clip " + name + " is not found.");
			return;
		}

		var tracks = clip.tracks;

		for (var i = 0; i < tracks.length; i++) {
			var track = tracks[i];
			var trackName = track.name;
			var binding = this._bindings[trackName];

			if (binding && binding.useCount > 0) {
				binding.useCount--;
			}
		}
	},

	update: function(t) {
		for (var name in this._activeClips) {
			var clip = this._clips[name];
			var weight = this._activeClips[name];

			clip.update(t, this._bindings, weight);
		}

		for (var key in this._bindings) {
			if (this._bindings[key].useCount > 0) {
				this._bindings[key].apply();
			}
		}
	},

	// set clip weight
	// this method can be used for cross fade
	setClipWeight: function(name, weight) {
		if (this._activeClips[name] === undefined) {
			console.warn("AnimationMixer.stop: clip " + name + " is not playing.");
			return;
		}

		this._activeClips[name] = weight;
	},

	// return all clip names of this animation
	getAllClipNames: function() {
		var array = [];

		for (var key in this._clips) {
			array.push(key);
		}

		return array;
	}

});

export { AnimationMixer };