function WebGLProperties() {
	this.properties = new WeakMap();
}

Object.assign(WebGLProperties.prototype, {

	get: function(object) {
		var map = this.properties.get(object);
		if (map === undefined) {
			map = {};
			this.properties.set(object, map);
		}
		return map;
	},

	delete: function(object) {
		this.properties.delete(object);
	},

	clear: function() {
		this.properties = new WeakMap();
	}

});

export { WebGLProperties };