/**
 * @author Rich Tibbett / https://github.com/richtr
 * @author mrdoob / http://mrdoob.com/
 * @author Tony Parisi / http://www.tonyparisi.com/
 * @author Takahiro / https://github.com/takahirox
 * @author Don McCurdy / https://www.donmccurdy.com
 */

zen3d.GLTFLoader = (function() {
	function decodeText(array) {
		if (typeof TextDecoder !== 'undefined') {
			return new TextDecoder().decode(array);
		}

		// Avoid the String.fromCharCode.apply(null, array) shortcut, which
		// throws a "maximum call stack size exceeded" error for large arrays.

		var s = '';
		for (var i = 0, il = array.length; i < il; i++) {
			// Implicitly assumes little-endian.
			s += String.fromCharCode(array[i]);
		}

		// Merges multi-byte utf-8 characters.
		return decodeURIComponent(escape(s));
	}

	function extractUrlBase(url) {
		var parts = url.split('/');
		parts.pop();
		return (parts.length < 1 ? '.' : parts.join('/')) + '/';
	}

	var sanitizeNodeName = function() {
		// Characters [].:/ are reserved for track binding syntax.
		var RESERVED_CHARS_RE = '\\[\\]\\.:\\/';

		var reservedRe = new RegExp('[' + RESERVED_CHARS_RE + ']', 'g');

		return function sanitizeNodeName(name) {
			return name.replace(/\s/g, '_').replace(reservedRe, '');
		};
	}();

	function createDefaultMaterial() {
		return new zen3d.PBRMaterial();
	}

	function resolveURL(url, path) {
		// Invalid URL
		if (typeof url !== 'string' || url === '') return '';

		// Absolute URL http://,https://,//
		if (/^(https?:)?\/\//i.test(url)) return url;

		// Data URI
		if (/^data:.*,.*$/i.test(url)) return url;

		// Blob URL
		if (/^blob:.*$/i.test(url)) return url;

		// Relative URL
		return path + url;
	}

	var GLTFLoader = function(manager) {
		this.manager = (manager !== undefined) ? manager : zen3d.DefaultLoadingManager;
		this.dracoLoader = null;
	}

	GLTFLoader.prototype.setDRACOLoader = function (dracoLoader) {
		this.dracoLoader = dracoLoader;
		return this;
	}

	GLTFLoader.prototype.load = function(url, onLoad, onProgress, onError) {
		var that = this;

		var path = extractUrlBase(url);

		// Tells the LoadingManager to track an extra item, which resolves after
		// the model is fully loaded. This means the count of items loaded will
		// be incorrect, but ensures manager.onLoad() does not fire early.
		that.manager.itemStart(url);

		var _onError = function (e) {
			if (onError) {
				onError(e);
			} else {
				console.error(e);
			}

			that.manager.itemError(url);
			that.manager.itemEnd(url);
		};

		var loader = new zen3d.FileLoader();
		loader.setResponseType('arraybuffer');
		loader.load(url, function(buffer) {
			that.parse(buffer, path, function(gltf) {
				if (onLoad !== undefined) {
					onLoad(gltf);
				}

				that.manager.itemEnd(url);
			}, _onError);
		}, onProgress, _onError);
	}

	GLTFLoader.prototype.parse = function(data, path, onLoad, onError) {
		var content;
		var extensions = {};

		if (typeof data === 'string') {
			content = data;
		} else {
			var magic = decodeText(new Uint8Array(data, 0, 4));
			if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
				try {
					extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
				} catch (error) {
					if (onError) onError(error);
					return;
				}
				content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;
			} else {
				content = decodeText(new Uint8Array(data));
			}
		}

		var json = JSON.parse(content);

		if (json.asset === undefined || json.asset.version[0] < 2) {
			if (onError) onError(new Error('GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported. Use LegacyGLTFLoader instead.'));
			return;
		}

		if (json.extensionsUsed) {
			if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_LIGHTS) >= 0) {
				extensions[EXTENSIONS.KHR_LIGHTS] = new GLTFLightsExtension(json);
			}

			if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_MATERIALS_UNLIT) >= 0) {
				extensions[EXTENSIONS.KHR_MATERIALS_UNLIT] = new GLTFMaterialsUnlitExtension(json);
			}

			if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS) >= 0) {
				extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS] = new GLTFMaterialsPbrSpecularGlossinessExtension();
			}

			if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_DRACO_MESH_COMPRESSION) >= 0) {
				extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION] = new GLTFDracoMeshCompressionExtension(this.dracoLoader);
			}

			if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_TEXTURE_TRANSFORM) >= 0) {
				extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] = new GLTFTextureTransformExtension();
			}
		}

		console.time('GLTFLoader');

		var glTFParser = new GLTFParser(json, extensions, {
			path: path,
			manager: this.manager
		});

		glTFParser.parse(function(scene, scenes, cameras, animations, asset) {
			console.timeEnd('GLTFLoader');

			var glTF = {
				scene: scene,
				scenes: scenes,
				cameras: cameras,
				animations: animations,
				asset: asset
			};

			onLoad(glTF);
		}, onError);
	}

	/* GLTFREGISTRY */

	function GLTFRegistry() {
		var objects = {};

		return {
			get: function(key) {
				return objects[key];
			},

			add: function(key, object) {
				objects[key] = object;
			},

			remove: function(key) {
				delete objects[key];
			},

			removeAll: function() {
				objects = {};
			}
		};
	}

	/* GLTF PARSER */

	function GLTFParser(json, extensions, options) {
		this.json = json || {};
		this.extensions = extensions || {};
		this.options = options || {};

		// loader object cache
		this.cache = new GLTFRegistry();

		// Geometry caching
		this.primitiveCache = [];

		this.textureLoader = new zen3d.ImageLoader(this.options.manager);

		this.fileLoader = new zen3d.FileLoader(this.options.manager);
		this.fileLoader.setResponseType('arraybuffer');
	}

	GLTFParser.prototype.parse = function(onLoad, onError) {
		var json = this.json;

		// Clear the loader cache
		this.cache.removeAll();

		// Mark the special nodes/meshes in json for efficient parse
		this.markDefs();

		// Fire the callback on complete
		this.getMultiDependencies([

			'scene',
			'animation',
			'camera'

		]).then(function(dependencies) {
			var scenes = dependencies.scenes || [];
			var scene = scenes[json.scene || 0];
			var animations = dependencies.animations || [];
			var asset = json.asset;
			var cameras = dependencies.cameras || [];

			onLoad(scene, scenes, cameras, animations, asset);
		}).catch(onError);
	}

	/**
     * Marks the special nodes/meshes in json for efficient parse.
     */
	GLTFParser.prototype.markDefs = function() {
		var nodeDefs = this.json.nodes || [];
		var skinDefs = this.json.skins || [];
		var meshDefs = this.json.meshes || [];

		var meshReferences = {};
		var meshUses = {};

		// Nothing in the node definition indicates whether it is a Bone or an
		// Object3D. Use the skins' joint references to mark bones.
		for (var skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
			var joints = skinDefs[skinIndex].joints;
			for (var i = 0, il = joints.length; i < il; i++) {
				nodeDefs[joints[i]].isBone = true;
			}
		}

		// Meshes can (and should) be reused by multiple nodes in a glTF asset. To
		// avoid having more than one zen3d.Mesh with the same name, count
		// references and rename instances below.
		//
		// Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
		for (var nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
			var nodeDef = nodeDefs[nodeIndex];

			if (nodeDef.mesh !== undefined) {
				if (meshReferences[nodeDef.mesh] === undefined) {
					meshReferences[nodeDef.mesh] = meshUses[nodeDef.mesh] = 0;
				}

				meshReferences[nodeDef.mesh]++;

				// Nothing in the mesh definition indicates whether it is
				// a SkinnedMesh or Mesh. Use the node's mesh reference
				// to mark SkinnedMesh if node has skin.
				if (nodeDef.skin !== undefined) {
					meshDefs[nodeDef.mesh].isSkinnedMesh = true;
				}
			}
		}

		this.json.meshReferences = meshReferences;
		this.json.meshUses = meshUses;
	};

	/**
     * Requests the specified dependency asynchronously, with caching.
     * @param {string} type
     * @param {number} index
     * @return {Promise<Object>}
     */
	GLTFParser.prototype.getDependency = function(type, index) {
		var cacheKey = type + ':' + index;
		var dependency = this.cache.get(cacheKey);

		if (!dependency) {
			var fnName = 'load' + type.charAt(0).toUpperCase() + type.slice(1);
			dependency = this[fnName](index);
			this.cache.add(cacheKey, dependency);
		}

		return dependency;
	};

	/**
     * Requests all dependencies of the specified type asynchronously, with caching.
     * @param {string} type
     * @return {Promise<Array<Object>>}
     */
	GLTFParser.prototype.getDependencies = function(type) {
		var dependencies = this.cache.get(type);

		if (!dependencies) {
			var parser = this;
			var defs = this.json[type + (type === 'mesh' ? 'es' : 's')] || [];

			dependencies = Promise.all(defs.map(function(def, index) {
				return parser.getDependency(type, index);
			}));

			this.cache.add(type, dependencies);
		}

		return dependencies;
	};

	/**
     * Requests all multiple dependencies of the specified types asynchronously, with caching.
     * @param {Array<string>} types
     * @return {Promise<Object<Array<Object>>>}
     */
	GLTFParser.prototype.getMultiDependencies = function(types) {
		var results = {};
		var pendings = [];

		for (var i = 0, il = types.length; i < il; i++) {
			var type = types[i];
			var value = this.getDependencies(type);

			value = value.then(function(key, value) {
				results[key] = value;
			}.bind(this, type + (type === 'mesh' ? 'es' : 's')));

			pendings.push(value);
		}

		return Promise.all(pendings).then(function() {
			return results;
		});
	};

	/**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
     * @param {number} sceneIndex
     * @return {Promise<zen3d.Scene>}
     */
	GLTFParser.prototype.loadScene = function() {
		// scene node hierachy builder

		function buildNodeHierachy(nodeId, parentObject, json, allNodes, skins) {
			var node = allNodes[nodeId];
			var nodeDef = json.nodes[nodeId];

			// build skeleton here as well

			if (nodeDef.skin !== undefined) {
				var meshes = node.type === zen3d.OBJECT_TYPE.GROUP ? node.children : [node];

				for (var i = 0, il = meshes.length; i < il; i++) {
					var mesh = meshes[i];
					var skinEntry = skins[nodeDef.skin];

					var bones = [];

					for (var j = 0, jl = skinEntry.joints.length; j < jl; j++) {
						var jointId = skinEntry.joints[j];
						var jointNode = allNodes[jointId];

						if (jointNode) {
							bones.push(jointNode);

							var mat = new zen3d.Matrix4();

							if (skinEntry.inverseBindMatrices !== undefined) {
								mat.fromArray(skinEntry.inverseBindMatrices.array, j * 16);
							}

							// copy mat to jointNode.offsetMatrix
							jointNode.offsetMatrix.copy(mat);
						} else {
							console.warn('GLTFLoader: Joint "%s" could not be found.', jointId);
						}
					}

					mesh.bind(new zen3d.Skeleton(bones), mesh.worldMatrix);
				}
			}

			// build node hierachy

			parentObject.add(node);

			if (nodeDef.children) {
				var children = nodeDef.children;

				for (var i = 0, il = children.length; i < il; i++) {
					var child = children[i];
					buildNodeHierachy(child, node, json, allNodes, skins);
				}
			}
		}

		return function loadScene(sceneIndex) {
			var json = this.json;
			var extensions = this.extensions;
			var sceneDef = this.json.scenes[sceneIndex];

			return this.getMultiDependencies([

				'node',
				'skin'

			]).then(function(dependencies) {
				var scene = new zen3d.Scene();
				if (sceneDef.name !== undefined) scene.name = sceneDef.name;

				if (sceneDef.extras) scene.userData = sceneDef.extras;

				var nodeIds = sceneDef.nodes || [];

				for (var i = 0, il = nodeIds.length; i < il; i++) {
					buildNodeHierachy(nodeIds[i], scene, json, dependencies.nodes, dependencies.skins);
				}

				// Ambient lighting, if present, is always attached to the scene root.
				if (sceneDef.extensions &&
                    sceneDef.extensions[EXTENSIONS.KHR_LIGHTS] &&
                    sceneDef.extensions[EXTENSIONS.KHR_LIGHTS].light !== undefined) {
					var lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
					scene.add(lights[sceneDef.extensions[EXTENSIONS.KHR_LIGHTS].light]);
				}

				return scene;
			});
		};
	}();

	/**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
     * @param {number} nodeIndex
     * @return {Promise<zen3d.Object3D>}
     */
	GLTFParser.prototype.loadNode = function(nodeIndex) {
		var json = this.json;
		var extensions = this.extensions;

		var meshReferences = json.meshReferences;
		var meshUses = json.meshUses;

		var nodeDef = json.nodes[nodeIndex];

		return this.getMultiDependencies([

			'mesh',
			'skin',
			'camera'

		]).then(function(dependencies) {
			var node;

			if (nodeDef.isBone === true) {
				node = new zen3d.Bone();
			} else if (nodeDef.mesh !== undefined) {
				var mesh = dependencies.meshes[nodeDef.mesh];

				node = mesh.clone();

				if (meshReferences[nodeDef.mesh] > 1) {
					node.name += '_instance_' + meshUses[nodeDef.mesh]++;
				}
			} else if (nodeDef.camera !== undefined) {
				node = dependencies.cameras[nodeDef.camera];
			} else if (nodeDef.extensions &&
                nodeDef.extensions[EXTENSIONS.KHR_LIGHTS] &&
                nodeDef.extensions[EXTENSIONS.KHR_LIGHTS].light !== undefined) {
				var lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
				node = lights[nodeDef.extensions[EXTENSIONS.KHR_LIGHTS].light];
			} else {
				node = new zen3d.Object3D();
			}

			if (nodeDef.name !== undefined) {
				node.name = sanitizeNodeName(nodeDef.name);
			}

			if (nodeDef.extras) node.userData = nodeDef.extras;

			if (nodeDef.matrix !== undefined) {
				var matrix = new zen3d.Matrix4();
				matrix.fromArray(nodeDef.matrix);
				node.matrix.multiplyMatrices(matrix, node.matrix);
				node.matrix.decompose(node.position, node.quaternion, node.scale);
			} else {
				if (nodeDef.translation !== undefined) {
					node.position.fromArray(nodeDef.translation);
				}

				if (nodeDef.rotation !== undefined) {
					node.quaternion.fromArray(nodeDef.rotation);
				}

				if (nodeDef.scale !== undefined) {
					node.scale.fromArray(nodeDef.scale);
				}
			}

			return node;
		});
	};

	/**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
     * @param {number} cameraIndex
     * @return {Promise<zen3d.Camera>}
     */
	GLTFParser.prototype.loadCamera = function(cameraIndex) {
		var camera = new zen3d.Camera();
		var cameraDef = this.json.cameras[cameraIndex];
		var params = cameraDef[cameraDef.type];

		if (!params) {
			console.warn('zen3d.GLTFLoader: Missing camera parameters.');
			return;
		}

		if (cameraDef.type === 'perspective') {
			camera.setPerspective(params.yfov, params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6);
		} else if (cameraDef.type === 'orthographic') {
			camera.setOrtho(params.xmag / -2, params.xmag / 2, params.ymag / -2, params.ymag / 2, params.znear || 1, params.zfar || 2e6);
		}

		if (cameraDef.name !== undefined) camera.name = cameraDef.name;

		if (cameraDef.extras) camera.userData = cameraDef.extras;

		return Promise.resolve(camera);
	}

	/**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
     * @param {number} skinIndex
     * @return {Promise<Object>}
     */
	GLTFParser.prototype.loadSkin = function(skinIndex) {
		var skinDef = this.json.skins[skinIndex];

		var skinEntry = { joints: skinDef.joints };

		if (skinDef.inverseBindMatrices === undefined) {
			return Promise.resolve(skinEntry);
		}

		return this.getDependency('accessor', skinDef.inverseBindMatrices).then(function (accessor) {
			skinEntry.inverseBindMatrices = accessor;

			return skinEntry;
		});
	}

	/**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
     * @param {number} animationIndex
     * @return {Promise<zen3d.KeyframeClip>}
     */
	GLTFParser.prototype.loadAnimation = function(animationIndex) {
		var json = this.json;

		var animationDef = json.animations[animationIndex];

		return this.getMultiDependencies([

			'accessor',
			'node'

		]).then(function (dependencies) {
			var tracks = [];

			var startFrame = 0;
			var endFrame = 0;

			for (var i = 0, il = animationDef.channels.length; i < il; i++) {
				var channel = animationDef.channels[i];
				var sampler = animationDef.samplers[channel.sampler];

				if (sampler) {
					var target = channel.target;
					var name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
					var input = animationDef.parameters !== undefined ? animationDef.parameters[sampler.input] : sampler.input;
					var output = animationDef.parameters !== undefined ? animationDef.parameters[sampler.output] : sampler.output;

					var inputAccessor = dependencies.accessors[input];
					var outputAccessor = dependencies.accessors[output];

					var node = dependencies.nodes[name];

					if (node) {
						node.updateMatrix();

						var TypedKeyframeTrack;

						switch (PATH_PROPERTIES[target.path]) {
						case PATH_PROPERTIES.rotation:
							TypedKeyframeTrack = zen3d.QuaternionKeyframeTrack;
							break;
						case PATH_PROPERTIES.weights:
							TypedKeyframeTrack = zen3d.NumberKeyframeTrack;
							break;
						case PATH_PROPERTIES.position:
						case PATH_PROPERTIES.scale:
						default:
							TypedKeyframeTrack = zen3d.VectorKeyframeTrack;
							break;
						}

						if (!TypedKeyframeTrack) {
							continue;
						}

						var input = new inputAccessor.array.constructor(inputAccessor.array.subarray(0, inputAccessor.array.length));
						var output = new outputAccessor.array.constructor(outputAccessor.array.subarray(0, outputAccessor.array.length));

						var targetNodes = [];

						if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
							node.traverse(function(object) {
								if (object.type === zen3d.OBJECT_TYPE.MESH && object.morphTargetInfluences) {
									targetNodes.push(object);
								}
							});
						} else {
							targetNodes.push(node);
						}

						for (var j = 0, jl = targetNodes.length; j < jl; j++) {
							var track = new TypedKeyframeTrack(targetNodes[j], PATH_PROPERTIES[target.path], input, output);
							tracks.push(track);
						}

						var maxTime = input[input.length - 1];
						if (endFrame < maxTime) {
							endFrame = maxTime;
						}
					}
				}
			}

			var name = animationDef.name !== undefined ? animationDef.name : 'animation_' + animationIndex;

			var clip = new zen3d.KeyframeClip(name);
			clip.tracks = tracks;
			clip.startFrame = startFrame;
			clip.endFrame = endFrame;
			clip.loop = true;

			return clip;
		});
	}

	/**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
     * @param {number} meshIndex
     * @return {Promise<zen3d.Group|zen3d.Mesh|zen3d.SkinnedMesh>}
     */
	GLTFParser.prototype.loadMesh = function(meshIndex) {
		var scope = this;
		var json = this.json;

		var meshDef = json.meshes[meshIndex];

		return this.getMultiDependencies([

			'accessor',
			'material'

		]).then(function(dependencies) {
			var group = new zen3d.Group();

			var primitives = meshDef.primitives;

			return scope.loadGeometries(primitives).then(function(geometries) {
				for (var i = 0, il = primitives.length; i < il; i++) {
					var primitive = primitives[i];
					var geometry = geometries[i];

					var material = primitive.material === undefined ?
						createDefaultMaterial() :
						dependencies.materials[primitive.material];

					// add a_Uv2 for aoMap
					// if (material.aoMap
					// 		&& geometry.attributes.a_Uv2 === undefined
					// 		&& geometry.attributes.a_Uv !== undefined) {
					// 	console.log('GLTFLoader: Duplicating UVs to support aoMap.');
					// 	geometry.addAttribute('a_Uv2', new zen3d.BufferAttribute(geometry.attributes.a_Uv.array, 2));
					// }

					// mark uv2
					if (geometry.attributes.a_Uv2 !== undefined) {
						material.defines = material.defines || {};
						material.defines['USE_UV2'] = '';
					}

					// If the material will be modified later on, clone it now.
					var useVertexTangents = geometry.attributes.a_Tangent !== undefined;
					var useVertexColors = geometry.attributes.a_Color !== undefined;
					var useFlatShading = geometry.attributes.a_Normal === undefined;
					var useSkinning = meshDef.isSkinnedMesh === true;

					if (useVertexTangents || useVertexColors || useFlatShading || useSkinning) {
						material = material.clone();
					}

					if (useVertexTangents) {
						material.vertexTangents = true;
					}

					if (useVertexColors) {
						switch (geometry.attributes.a_Color.size) {
						case 3:
							material.vertexColors = zen3d.VERTEX_COLOR.RGB;
							break;
						case 4:
							material.vertexColors = zen3d.VERTEX_COLOR.RGBA;
							break;
						default:
							console.warn("Illegal vertex color size: " + geometry.attributes.a_Color.size);
						}
					}

					if (useFlatShading) {
						material.shading = zen3d.SHADING_TYPE.FLAT_SHADING;
					}

					var mesh;

					if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
                        primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
                        primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
                        primitive.mode === undefined) {
						if (useSkinning) {
							mesh = new zen3d.SkinnedMesh(geometry, material);
						} else {
							mesh = new zen3d.Mesh(geometry, material);
						}

						if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
							material.drawMode = zen3d.DRAW_MODE.TRIANGLE_STRIP;
						} else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
							material.drawMode = zen3d.DRAW_MODE.TRIANGLE_FAN;
						}
					} else if (primitive.mode === WEBGL_CONSTANTS.LINES ||
                        primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ||
                        primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
						var cacheKey = 'LineMaterial:' + material.uuid;

						var lineMaterial = scope.cache.get(cacheKey);

						if (!lineMaterial) {
							lineMaterial = new zen3d.LineMaterial();
							lineMaterial.lineWidth = material.lineWidth;
							lineMaterial.diffuse.copy(material.diffuse);
							lineMaterial.diffuseMap = material.diffuseMap;
							lineMaterial.lights = false; // LineMaterial doesn't support lights

							lineMaterial.drawMode = primitive.mode;

							scope.cache.add(cacheKey, lineMaterial);
						}

						material = lineMaterial;

						mesh = new zen3d.Mesh(geometry, material);
					} else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
						var cacheKey = 'PointsMaterial:' + material.uuid;

						var pointsMaterial = scope.cache.get(cacheKey);

						if (!pointsMaterial) {
							pointsMaterial = new zen3d.PointsMaterial();
							zen3d.Material.prototype.copy.call(pointsMaterial, material);
							pointsMaterial.diffuse.copy(material.diffuse);
							pointsMaterial.diffuseMap = material.map;
							pointsMaterial.acceptLight = false; // PointsMaterial doesn't support lights yet

							scope.cache.add(cacheKey, pointsMaterial);
						}

						material = pointsMaterial;

						mesh = new zen3d.Mesh(geometry, material);
					} else {
						throw new Error('GLTFLoader: Primitive mode unsupported: ' + primitive.mode);
					}

					mesh.name = meshDef.name || ('mesh_' + meshIndex);

					if (meshDef.extras !== undefined) mesh.userData = meshDef.extras;
					if (primitive.extras !== undefined) mesh.geometry.userData = primitive.extras;

					if (Object.keys(mesh.geometry.morphAttributes).length > 0) {
						mesh.morphTargetInfluences = meshDef.weights.slice();
					}

					if (primitives.length > 1) {
						mesh.name += '_' + i;

						group.add(mesh);
					} else {
						return mesh;
					}
				}

				return group;
			});
		});
	};

	/**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
     * @param {Array<Object>} primitives
     * @return {Promise<Array<zen3d.Geometry>>}
     */
	GLTFParser.prototype.loadGeometries = function(primitives) {
		var parser = this;
		var extensions = this.extensions;
		var cache = this.primitiveCache;

		return this.getDependencies('accessor').then(function(accessors) {
			var geometries = [];
			var pending = [];

			for (var i = 0, il = primitives.length; i < il; i++) {
				var primitive = primitives[i];

				// See if we've already created this geometry
				var cached = getCachedGeometry(cache, primitive);

				var geometry;

				if (cached) {
					// Use the cached geometry if it exists
					pending.push(cached.then(function(geometry) {
						geometries.push(geometry);
					}));
				} else if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {
					// Use DRACO geometry if available
					var geometryPromise = extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
						.decodePrimitive(primitive, parser)
						.then(function(geometry) {
							addPrimitiveAttributes(geometry, primitive, accessors);

							geometries.push(geometry);

							return geometry;
						});

					cache.push({
						primitive: primitive,
						promise: geometryPromise
					});

					pending.push(geometryPromise);
				} else {
					// Otherwise create a new geometry
					geometry = new zen3d.Geometry();

					addPrimitiveAttributes(geometry, primitive, accessors);

					// Cache this geometry
					cache.push({

						primitive: primitive,
						promise: Promise.resolve(geometry)

					});

					geometries.push(geometry);
				}
			}

			return Promise.all(pending).then(function() {
				return geometries;
			});
		});
	};

	function isPrimitiveEqual(a, b) {
		if (a.indices !== b.indices) {
			return false;
		}

		var attribA = a.attributes || {};
		var attribB = b.attributes || {};
		var keysA = Object.keys(attribA);
		var keysB = Object.keys(attribB);

		if (keysA.length !== keysB.length) {
			return false;
		}

		for (var i = 0, il = keysA.length; i < il; i++) {
			var key = keysA[i];

			if (attribA[key] !== attribB[key]) {
				return false;
			}
		}

		return true;
	}

	function getCachedGeometry(cache, newPrimitive) {
		for (var i = 0, il = cache.length; i < il; i++) {
			var cached = cache[i];

			if (isPrimitiveEqual(cached.primitive, newPrimitive)) {
				return cached.promise;
			}
		}

		return null;
	}

	/**
     * @param  {zen3d.Geometry} geometry
     * @param  {GLTF.Primitive} primitiveDef
     * @param  {Array<zen3d.BufferAttribute|zen3d.InterleavedBufferAttribute>} accessors
     */
	function addPrimitiveAttributes(geometry, primitiveDef, accessors) {
		var attributes = primitiveDef.attributes;

		// attributes

		for (var gltfAttributeName in attributes) {
			var threeAttributeName = ATTRIBUTES[gltfAttributeName];
			var bufferAttribute = accessors[attributes[gltfAttributeName]];

			// Skip attributes already provided by e.g. Draco extension.
			if (!threeAttributeName) continue;
			if (threeAttributeName in geometry.attributes) continue;

			geometry.addAttribute(threeAttributeName, bufferAttribute);
		}

		// index

		if (primitiveDef.indices !== undefined && !geometry.index) {
			geometry.setIndex(accessors[primitiveDef.indices]);
		}

		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();

		// morphAttributes

		if (primitiveDef.targets !== undefined) {
			var targets = primitiveDef.targets;

			var hasMorphPosition = false;
			var hasMorphNormal = false;

			for (var i = 0, il = targets.length; i < il; i++) {
				var target = targets[i];

				if (target.POSITION !== undefined) hasMorphPosition = true;
				if (target.NORMAL !== undefined) hasMorphNormal = true;

				if (hasMorphPosition && hasMorphNormal) break;
			}

			if (!hasMorphPosition && !hasMorphNormal) {
				return;
			}

			if (hasMorphPosition) geometry.morphAttributes.position = [];
			if (hasMorphNormal) geometry.morphAttributes.normal = [];

			for (var i = 0, il = targets.length; i < il; i++) {
				var target = targets[i];
				if (hasMorphPosition) {
					geometry.morphAttributes.position.push(accessors[target.POSITION]);
				}
				if (hasMorphNormal) {
					geometry.morphAttributes.normal.push(accessors[target.NORMAL]);
				}
			}
		}
	}

	/**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
     * @param {number} accessorIndex
     * @return {Promise<zen3d.BufferAttribute|zen3d.InterleavedBufferAttribute>}
     */
	GLTFParser.prototype.loadAccessor = function(accessorIndex) {
		var parser = this;
		var json = this.json;

		var accessorDef = this.json.accessors[accessorIndex];

		if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {
			// Ignore empty accessors, which may be used to declare runtime
			// information about attributes coming from another source (e.g. Draco
			// compression extension).
			return Promise.resolve(null);
		}

		var pendingBufferViews = [];

		if (accessorDef.bufferView !== undefined) {
			pendingBufferViews.push(this.getDependency('bufferView', accessorDef.bufferView));
		} else {
			pendingBufferViews.push(null);
		}

		if (accessorDef.sparse !== undefined) {
			pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.indices.bufferView));
			pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.values.bufferView));
		}

		return Promise.all(pendingBufferViews).then(function(bufferViews) {
			var bufferView = bufferViews[0];

			var itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
			var TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];

			// For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
			var elementBytes = TypedArray.BYTES_PER_ELEMENT;
			var itemBytes = elementBytes * itemSize;
			var byteOffset = accessorDef.byteOffset || 0;
			var byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[accessorDef.bufferView].byteStride : undefined;
			var normalized = accessorDef.normalized === true;
			var array, bufferAttribute;

			// The buffer is not interleaved if the stride is the item size in bytes.
			if (byteStride && byteStride !== itemBytes) {
				var ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType;
				var ib = parser.cache.get(ibCacheKey);

				if (!ib) {
					// Use the full buffer if it's interleaved.
					array = new TypedArray(bufferView);

					// Integer parameters to IB/IBA are in array elements, not bytes.
					ib = new zen3d.InterleavedBuffer(array, byteStride / elementBytes);

					parser.cache.add(ibCacheKey, ib);
				}

				bufferAttribute = new zen3d.InterleavedBufferAttribute(ib, itemSize, byteOffset / elementBytes, normalized);
			} else {
				if (bufferView === null) {
					array = new TypedArray(accessorDef.count * itemSize);
				} else {
					array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
				}

				bufferAttribute = new zen3d.BufferAttribute(array, itemSize, normalized);
			}

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
			if (accessorDef.sparse !== undefined) {
				var itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
				var TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];

				var byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
				var byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

				var sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
				var sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);

				if (bufferView !== null) {
					// Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
					bufferAttribute.setArray(bufferAttribute.array.slice());
				}

				for (var i = 0, il = sparseIndices.length; i < il; i++) {
					var index = sparseIndices[i];

					bufferAttribute.array[index * bufferAttribute.itemSize] = sparseValues[i * itemSize];
					if (itemSize >= 2) bufferAttribute.array[index * bufferAttribute.itemSize + 1] = sparseValues[i * itemSize + 1];
					if (itemSize >= 3) bufferAttribute.array[index * bufferAttribute.itemSize + 2] = sparseValues[i * itemSize + 2];
					if (itemSize >= 4) bufferAttribute.array[index * bufferAttribute.itemSize + 3] = sparseValues[i * itemSize + 3];
					if (itemSize >= 5) throw new Error('zen3d.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.');
				}
			}

			return bufferAttribute;
		});
	};

	/**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
     * @param {number} bufferViewIndex
     * @return {Promise<ArrayBuffer>}
     */
	GLTFParser.prototype.loadBufferView = function(bufferViewIndex) {
		var bufferViewDef = this.json.bufferViews[bufferViewIndex];

		return this.getDependency('buffer', bufferViewDef.buffer).then(function(buffer) {
			var byteLength = bufferViewDef.byteLength || 0;
			var byteOffset = bufferViewDef.byteOffset || 0;
			return buffer.slice(byteOffset, byteOffset + byteLength);
		});
	};

	/**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
     * @param {number} bufferIndex
     * @return {Promise<ArrayBuffer>}
     */
	GLTFParser.prototype.loadBuffer = function(bufferIndex) {
		var bufferDef = this.json.buffers[bufferIndex];
		var loader = this.fileLoader;

		if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
			throw new Error('zen3d.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.');
		}

		// If present, GLB container is required to be the first buffer.
		if (bufferDef.uri === undefined && bufferIndex === 0) {
			return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
		}

		var options = this.options;

		return new Promise(function(resolve, reject) {
			loader.load(resolveURL(bufferDef.uri, options.path), resolve, undefined, function() {
				reject(new Error('zen3d.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));
			});
		});
	};

	/**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
     * @param {number} materialIndex
     * @return {Promise<zen3d.Material>}
     */
	GLTFParser.prototype.loadMaterial = function(materialIndex) {
		var parser = this;
		var json = this.json;
		var extensions = this.extensions;
		var materialDef = json.materials[materialIndex];

		var materialType;
		var materialParams = {};
		var materialExtensions = materialDef.extensions || {};

		var pending = [];

		if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
			var sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
			materialType = sgExtension.getMaterialType(materialDef);
			pending.push(sgExtension.extendParams(materialParams, materialDef, parser));
		} else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
			var kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
			materialType = kmuExtension.getMaterialType(materialDef);
			pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
		} else if (materialDef.pbrMetallicRoughness !== undefined) {
			// Specification:
			// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

			materialType = zen3d.PBRMaterial;

			var metallicRoughness = materialDef.pbrMetallicRoughness;

			materialParams.diffuse = new zen3d.Color3(1.0, 1.0, 1.0);
			materialParams.opacity = 1.0;

			if (Array.isArray(metallicRoughness.baseColorFactor)) {
				var array = metallicRoughness.baseColorFactor;

				materialParams.diffuse.fromArray(array);
				materialParams.opacity = array[3];
			}

			if (metallicRoughness.baseColorTexture !== undefined) {
				pending.push(parser.assignTexture(materialParams, 'diffuseMap', metallicRoughness.baseColorTexture));
				materialParams.diffuseMapCoord = metallicRoughness.baseColorTexture.texCoord || 0;
			}

			materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
			materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

			// metalnessMap and roughnessMap support
			if (metallicRoughness.metallicRoughnessTexture !== undefined) {
				pending.push(parser.assignTexture(materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture));
				pending.push(parser.assignTexture(materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture));
			}
		} else {
			materialType = zen3d.PhongMaterial;
		}


		if (materialDef.doubleSided === true) {
			materialParams.side = zen3d.DRAW_SIDE.DOUBLE;
		}

		var alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

		if (alphaMode === ALPHA_MODES.BLEND) {
			materialParams.transparent = true;
		} else {
			materialParams.transparent = false;

			if (alphaMode === ALPHA_MODES.MASK) {
				materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;
			}
		}

		if (materialDef.normalTexture !== undefined) {
			pending.push(parser.assignTexture(materialParams, 'normalMap', materialDef.normalTexture));

			// TODO normalScale support
			// materialParams.normalScale = new zen3d.Vector2( 1, 1 );
			//
			// if ( materialDef.normalTexture.scale !== undefined ) {
			//
			// 	materialParams.normalScale.set( materialDef.normalTexture.scale, materialDef.normalTexture.scale );
			//
			// }
		}

		if (materialDef.occlusionTexture !== undefined) {
			pending.push(parser.assignTexture(materialParams, 'aoMap', materialDef.occlusionTexture));

			materialParams.aoMapCoord = materialDef.occlusionTexture.texCoord || 0;

			if (materialDef.occlusionTexture.strength !== undefined) {
				materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
			}
		}

		if (materialDef.emissiveFactor !== undefined) {
			materialParams.emissive = new zen3d.Color3().fromArray(materialDef.emissiveFactor);
		}

		if (materialDef.emissiveTexture !== undefined) {
			pending.push(parser.assignTexture(materialParams, 'emissiveMap', materialDef.emissiveTexture));
			materialParams.emissiveMapCoord = materialDef.emissiveTexture.texCoord || 0;
		}

		return Promise.all(pending).then(function() {
			var material = new materialType();

			for (var key in materialParams) {
				material[key] = materialParams[key];
			}

			// if ( materialDef.name !== undefined ) material.name = materialDef.name;

			// TODO normalScale support
			// Normal map textures use OpenGL conventions:
			// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#materialnormaltexture
			// if ( material.normalScale ) {
			//
			// 	material.normalScale.x = - material.normalScale.x;
			//
			// }

			// if (material.aoMap) {
			// 	material.defines = material.defines || {};
			// 	material.defines['USE_UV2'] = '';
			// }

			// emissiveTexture and baseColorTexture use sRGB encoding.
			{ if (material.diffuseMap) material.diffuseMap.encoding = zen3d.TEXEL_ENCODING_TYPE.SRGB; }
			if (material.emissiveMap) material.emissiveMap.encoding = zen3d.TEXEL_ENCODING_TYPE.SRGB;

			if (materialDef.extras) material.userData = materialDef.extras;

			return material;
		});
	};

	/**
     * Asynchronously assigns a texture to the given material parameters.
     * @param {Object} materialParams
     * @param {string} textureName
     * @param {Object} mapDef
     * @return {Promise}
     */
	GLTFParser.prototype.assignTexture = function(materialParams, textureName, mapDef) {
		var parser = this;
		return this.getDependency('texture', mapDef.index).then(function(texture) {
			if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
				var transform = mapDef.extensions !== undefined ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] : undefined;

				if (transform) {
					texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(texture, transform);
				}
			}
			materialParams[textureName] = texture;
		});
	};

	/**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
     * @param {number} textureIndex
     * @return {Promise<zen3d.TextureBase>}
     */
	GLTFParser.prototype.loadTexture = function(textureIndex) {
		var parser = this;
		var json = this.json;
		var options = this.options;
		var textureLoader = this.textureLoader;

		var URL = window.URL || window.webkitURL;

		var textureDef = json.textures[textureIndex];
		var source = json.images[textureDef.source];
		var sourceURI = source.uri;
		var isObjectURL = false;

		if (source.bufferView !== undefined) {
			// Load binary image data from bufferView, if provided.

			sourceURI = parser.getDependency('bufferView', source.bufferView).then(function(bufferView) {
				isObjectURL = true;
				var blob = new Blob([bufferView], {
					type: source.mimeType
				});
				sourceURI = URL.createObjectURL(blob);
				return sourceURI;
			});
		}

		return Promise.resolve(sourceURI).then(function(sourceURI) {
			// Load Texture resource.

			// TODO different kinds of URI support
			// var loader = zen3d.Loader.Handlers.get( sourceURI ) || textureLoader;

			var loader = textureLoader;

			return new Promise(function(resolve, reject) {
				loader.load(resolveURL(sourceURI, options.path), resolve, undefined, reject);
			});
		}).then(function(image) {
			var texture = zen3d.Texture2D.fromImage(image);

			// Clean up resources and configure Texture.

			if (isObjectURL === true) {
				URL.revokeObjectURL(sourceURI);
			}

			texture.flipY = false;

			// if ( textureDef.name !== undefined ) texture.name = textureDef.name;

			texture.format = textureDef.format !== undefined ? WEBGL_TEXTURE_FORMATS[textureDef.format] : zen3d.WEBGL_PIXEL_FORMAT.RGBA;

			if (textureDef.internalFormat !== undefined && texture.format !== WEBGL_TEXTURE_FORMATS[textureDef.internalFormat]) {
				console.warn('zen3d.GLTFLoader: zen3d.js does not support texture internalFormat which is different from texture format. ' +
                    'internalFormat will be forced to be the same value as format.');
			}

			texture.type = textureDef.type !== undefined ? WEBGL_TEXTURE_DATATYPES[textureDef.type] : zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;

			var samplers = json.samplers || {};
			var sampler = samplers[textureDef.sampler] || {};

			texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
			texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || zen3d.WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;
			texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || zen3d.WEBGL_TEXTURE_WRAP.REPEAT;
			texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || zen3d.WEBGL_TEXTURE_WRAP.REPEAT;

			return texture;
		});
	};

	/**
	 * Unlit Materials Extension (pending)
	 *
	 * PR: https://github.com/KhronosGroup/glTF/pull/1163
	 */
	function GLTFMaterialsUnlitExtension(json) {
		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;
	}

	GLTFMaterialsUnlitExtension.prototype.getMaterialType = function (material) {
		return zen3d.BasicMaterial;
	};

	GLTFMaterialsUnlitExtension.prototype.extendParams = function (materialParams, material, parser) {
		var pending = [];

		materialParams.diffuse = new zen3d.Color3(1.0, 1.0, 1.0);
		materialParams.opacity = 1.0;

		var metallicRoughness = material.pbrMetallicRoughness;

		if (metallicRoughness) {
			if (Array.isArray(metallicRoughness.baseColorFactor)) {
				var array = metallicRoughness.baseColorFactor;

				materialParams.diffuse.fromArray(array);
				materialParams.opacity = array[3];
			}

			if (metallicRoughness.baseColorTexture !== undefined) {
				pending.push(parser.assignTexture(materialParams, 'diffuseMap', metallicRoughness.baseColorTexture));
				materialParams.diffuseMapCoord = metallicRoughness.baseColorTexture.texCoord || 0;
			}
		}

		return Promise.all(pending);
	};

	/**
	 * GLTFMaterialsPbrSpecularGlossinessExtension
	 */
	function GLTFMaterialsPbrSpecularGlossinessExtension() {
		this.name = EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS;
	}

	GLTFMaterialsPbrSpecularGlossinessExtension.prototype.getMaterialType = function (material) {
		return zen3d.PBR2Material;
	};

	GLTFMaterialsPbrSpecularGlossinessExtension.prototype.extendParams = function (materialParams, material, parser) {
		var pending = [];

		materialParams.diffuse = new zen3d.Color3(1.0, 1.0, 1.0);
		materialParams.opacity = 1.0;

		var pbrSpecularGlossiness = material.extensions[this.name];

		if (pbrSpecularGlossiness) {
			if (Array.isArray(pbrSpecularGlossiness.diffuseFactor)) {
				var array = pbrSpecularGlossiness.diffuseFactor;

				materialParams.diffuse.fromArray(array);
				materialParams.opacity = array[3];
			}

			if (pbrSpecularGlossiness.diffuseTexture !== undefined) {
				pending.push(parser.assignTexture(materialParams, 'diffuseMap', pbrSpecularGlossiness.diffuseTexture));
			}
		}

		materialParams.glossiness = pbrSpecularGlossiness.glossinessFactor !== undefined ? pbrSpecularGlossiness.glossinessFactor : 1.0;
		materialParams.specular = new zen3d.Color3(1.0, 1.0, 1.0);

		if (Array.isArray(pbrSpecularGlossiness.specularFactor)) {
			materialParams.specular.fromArray(pbrSpecularGlossiness.specularFactor);
		}

		if (pbrSpecularGlossiness.specularGlossinessTexture !== undefined) {
			var specGlossMapDef = pbrSpecularGlossiness.specularGlossinessTexture;
			pending.push(parser.assignTexture(materialParams, 'glossinessMap', specGlossMapDef));
			pending.push(parser.assignTexture(materialParams, 'specularMap', specGlossMapDef));
		}

		return Promise.all(pending);
	};

	/*********************************/
	/** ******** EXTENSIONS ***********/
	/*********************************/

	var EXTENSIONS = {
		KHR_BINARY_GLTF: 'KHR_binary_glTF',
		KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
		KHR_LIGHTS: 'KHR_lights',
		KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
		KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
		KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform'
	};

	/**
     * Lights Extension
     *
     * Specification: PENDING
     */
	function GLTFLightsExtension(json) {
		this.name = EXTENSIONS.KHR_LIGHTS;

		this.lights = {};

		var extension = (json.extensions && json.extensions[EXTENSIONS.KHR_LIGHTS]) || {};
		var lights = extension.lights || {};

		for (var lightId in lights) {
			var light = lights[lightId];
			var lightNode;

			var color = new zen3d.Color3().fromArray(light.color);

			switch (light.type) {
			case 'directional':
				lightNode = new zen3d.DirectionalLight();
				lightNode.color.copy(color);
				lightNode.position.set(0, 0, 1);
				break;

			case 'point':
				lightNode = new zen3d.PointLight();
				lightNode.color.copy(color);
				break;

			case 'spot':
				lightNode = new zen3d.SpotLight();
				lightNode.color.copy(color);
				lightNode.position.set(0, 0, 1);
				break;

			case 'ambient':
				lightNode = new zen3d.AmbientLight();
				lightNode.color.copy(color);
				break;
			}

			if (lightNode) {
				if (light.constantAttenuation !== undefined) {
					lightNode.intensity = light.constantAttenuation;
				}

				if (light.linearAttenuation !== undefined) {
					lightNode.distance = 1 / light.linearAttenuation;
				}

				if (light.quadraticAttenuation !== undefined) {
					lightNode.decay = light.quadraticAttenuation;
				}

				if (light.fallOffAngle !== undefined) {
					lightNode.angle = light.fallOffAngle;
				}

				if (light.fallOffExponent !== undefined) {
					console.warn('GLTFLoader:: light.fallOffExponent not currently supported.');
				}

				lightNode.name = light.name || ('light_' + lightId);
				this.lights[lightId] = lightNode;
			}
		}
	}

	/* BINARY EXTENSION */

	var BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
	var BINARY_EXTENSION_HEADER_LENGTH = 12;
	var BINARY_EXTENSION_CHUNK_TYPES = {
		JSON: 0x4E4F534A,
		BIN: 0x004E4942
	};

	function GLTFBinaryExtension(data) {
		this.name = EXTENSIONS.KHR_BINARY_GLTF;
		this.content = null;
		this.body = null;

		var headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);

		this.header = {
			magic: decodeText(new Uint8Array(data.slice(0, 4))),
			version: headerView.getUint32(4, true),
			length: headerView.getUint32(8, true)
		};

		if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
			throw new Error('GLTFLoader: Unsupported glTF-Binary header.');
		} else if (this.header.version < 2.0) {
			throw new Error('GLTFLoader: Legacy binary file detected. Use LegacyGLTFLoader instead.');
		}

		var chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
		var chunkIndex = 0;

		while (chunkIndex < chunkView.byteLength) {
			var chunkLength = chunkView.getUint32(chunkIndex, true);
			chunkIndex += 4;

			var chunkType = chunkView.getUint32(chunkIndex, true);
			chunkIndex += 4;

			if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
				var contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
				this.content = decodeText(contentArray);
			} else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
				var byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
				this.body = data.slice(byteOffset, byteOffset + chunkLength);
			}

			// Clients must ignore chunks with unknown types.

			chunkIndex += chunkLength;
		}

		if (this.content === null) {
			throw new Error('GLTFLoader: JSON content not found.');
		}
	}

	/**
     * DRACO Mesh Compression Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/pull/874
     */
	function GLTFDracoMeshCompressionExtension(dracoLoader) {
		if (!dracoLoader) {
			throw new Error('GLTFLoader: No DRACOLoader instance provided.');
		}

		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
		this.dracoLoader = dracoLoader;
	}

	GLTFDracoMeshCompressionExtension.prototype.decodePrimitive = function(primitive, parser) {
		var dracoLoader = this.dracoLoader;
		var bufferViewIndex = primitive.extensions[this.name].bufferView;
		var gltfAttributeMap = primitive.extensions[this.name].attributes;
		var threeAttributeMap = {};

		for (var attributeName in gltfAttributeMap) {
			if (!(attributeName in ATTRIBUTES)) continue;
			threeAttributeMap[ATTRIBUTES[attributeName]] = gltfAttributeMap[attributeName];
		}

		return parser.getDependency('bufferView', bufferViewIndex).then(function(bufferView) {
			return new Promise(function(resolve) {
				dracoLoader.decodeDracoFile(bufferView, resolve, threeAttributeMap);
			});
		});
	};

	/**
     * Texture Transform Extension
     *
     * https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
     *
     */
	function GLTFTextureTransformExtension() {
		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;
	}

	GLTFTextureTransformExtension.prototype.extendTexture = function (texture, transform) {
		texture = texture.clone();

		if (transform.offset !== undefined) {
			texture.offset.fromArray(transform.offset);
		}

		if (transform.rotation !== undefined) {
			texture.rotation = transform.rotation;
		}

		if (transform.scale !== undefined) {
			texture.repeat.fromArray(transform.scale);
		}

		if (transform.texCoord !== undefined) {
			console.warn('zen3d.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.');
		}

		texture.useUVTransform = true;

		return texture;
	}

	/*********************************/
	/** ******** WEBGL CONSTANTS ***********/
	/*********************************/

	var WEBGL_CONSTANTS = {
		FLOAT: 5126,
		// FLOAT_MAT2: 35674,
		FLOAT_MAT3: 35675,
		FLOAT_MAT4: 35676,
		FLOAT_VEC2: 35664,
		FLOAT_VEC3: 35665,
		FLOAT_VEC4: 35666,
		LINEAR: 9729,
		REPEAT: 10497,
		SAMPLER_2D: 35678,
		POINTS: 0,
		LINES: 1,
		LINE_LOOP: 2,
		LINE_STRIP: 3,
		TRIANGLES: 4,
		TRIANGLE_STRIP: 5,
		TRIANGLE_FAN: 6,
		UNSIGNED_BYTE: 5121,
		UNSIGNED_SHORT: 5123
	};

	var ATTRIBUTES = {
		POSITION: 'a_Position',
		NORMAL: 'a_Normal',
		TANGENT: 'a_Tangent',
		TEXCOORD_0: 'a_Uv',
		TEXCOORD0: 'a_Uv', // deprecated
		TEXCOORD: 'a_Uv', // deprecated
		TEXCOORD_1: 'a_Uv2',
		COLOR_0: 'a_Color',
		COLOR0: 'a_Color', // deprecated
		COLOR: 'a_Color', // deprecated
		WEIGHTS_0: 'skinWeight',
		WEIGHT: 'skinWeight', // deprecated
		JOINTS_0: 'skinIndex',
		JOINT: 'skinIndex' // deprecated
	}

	var WEBGL_TYPE_SIZES = {
		'SCALAR': 1,
		'VEC2': 2,
		'VEC3': 3,
		'VEC4': 4,
		'MAT2': 4,
		'MAT3': 9,
		'MAT4': 16
	};

	var WEBGL_COMPONENT_TYPES = {
		5120: Int8Array,
		5121: Uint8Array,
		5122: Int16Array,
		5123: Uint16Array,
		5125: Uint32Array,
		5126: Float32Array
	};

	var ALPHA_MODES = {
		OPAQUE: 'OPAQUE',
		MASK: 'MASK',
		BLEND: 'BLEND'
	};

	var WEBGL_TEXTURE_FORMATS = {
		6406: zen3d.WEBGL_PIXEL_FORMAT.ALPHA,
		6407: zen3d.WEBGL_PIXEL_FORMAT.RGB,
		6408: zen3d.WEBGL_PIXEL_FORMAT.RGBA,
		6409: zen3d.WEBGL_PIXEL_FORMAT.LUMINANCE,
		6410: zen3d.WEBGL_PIXEL_FORMAT.LUMINANCE_ALPHA
	};

	var WEBGL_TEXTURE_DATATYPES = {
		5121: zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE,
		32819: zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_SHORT_4_4_4_4,
		32820: zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_SHORT_5_5_5_1,
		33635: zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_SHORT_5_6_5
	};

	var WEBGL_FILTERS = {
		9728: zen3d.WEBGL_TEXTURE_FILTER.NEAREST,
		9729: zen3d.WEBGL_TEXTURE_FILTER.LINEAR,
		9984: zen3d.WEBGL_TEXTURE_FILTER.NEAREST_MIPMAP_NEAREST,
		9985: zen3d.WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_NEAREST,
		9986: zen3d.WEBGL_TEXTURE_FILTER.NEAREST_MIPMAP_LINEAR,
		9987: zen3d.WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR
	};

	var WEBGL_WRAPPINGS = {
		33071: zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE,
		33648: zen3d.WEBGL_TEXTURE_WRAP.MIRRORED_REPEAT,
		10497: zen3d.WEBGL_TEXTURE_WRAP.REPEAT
	};

	var PATH_PROPERTIES = {
		scale: 'scale',
		translation: 'position',
		rotation: 'quaternion',
		weights: 'morphTargetInfluences'
	};

	return GLTFLoader;
})();