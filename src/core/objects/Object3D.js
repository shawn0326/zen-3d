(function() {
    /**
     * Object3D
     * @class
     */
    var Object3D = function() {

        this.uuid = zen3d.generateUUID();

        // a custom name for this object
        this.name = "";

        // type of this object, set by subclass
        this.type = "";

        // position
        this.position = new zen3d.Vector3();
        // scale
        this.scale = new zen3d.Vector3(1, 1, 1);

        // euler rotate
        var euler = this.euler = new zen3d.Euler();
        // quaternion rotate
        var quaternion = this.quaternion = new zen3d.Quaternion();

        // bind euler and quaternion
        euler.onChange(function() {
            quaternion.setFromEuler(euler, false);
        });
        quaternion.onChange(function() {
            euler.setFromQuaternion(quaternion, undefined, false);
        });

        // transform matrix
        this.matrix = new zen3d.Matrix4();
        // world transform matrix
        this.worldMatrix = new zen3d.Matrix4();

        // children
        this.children = new Array();
        // parent
        this.parent = null;

        // shadow
        this.castShadow = false;
        this.receiveShadow = false;
        this.shadowType = zen3d.SHADOW_TYPE.PCF_SOFT;

        // frustum test
        this.frustumCulled = true;

        this.userData = {};
    }

    Object.defineProperties(Object3D.prototype, {
        /**
         * rotation set by euler
         **/
        rotation: {
            get: function() {
                return this.euler;
            },
            set: function(euler) {
                var _euler = this.euler;
                _euler.copyFrom(euler);

                this.quaternion.setFromEuler(euler);
            }
        }
    });

    /**
     * add child to object3d
     */
    Object3D.prototype.add = function(object) {
        this.children.push(object);
        object.parent = this;
    }

    /**
     * remove child from object3d
     */
    Object3D.prototype.remove = function(object) {
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        object.parent = null;
    }

    /**
     * get object by name
     */
    Object3D.prototype.getObjectByName = function(name) {
        return this.getObjectByProperty('name', name);
    }

    /**
     * get object by property
     */
    Object3D.prototype.getObjectByProperty = function(name, value) {
        if (this[name] === value) return this;

        for (var i = 0, l = this.children.length; i < l; i++) {

            var child = this.children[i];
            var object = child.getObjectByProperty(name, value);

            if (object !== undefined) {

                return object;

            }

        }

        return undefined;
    }

    /**
     * update matrix
     */
    Object3D.prototype.updateMatrix = function() {
        var matrix = this.matrix.transform(this.position, this.scale, this.quaternion);

        this.worldMatrix.copy(matrix);

        if (this.parent) {
            var parentMatrix = this.parent.worldMatrix;
            this.worldMatrix.premultiply(parentMatrix);
        }

        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            children[i].updateMatrix();
        }
    }

    /*
     * get world direction
     * must call after world matrix updated
     */
    Object3D.prototype.getWorldDirection = function() {

        var position = new zen3d.Vector3();
        var quaternion = new zen3d.Quaternion();
        var scale = new zen3d.Vector3();

        return function getWorldDirection(optionalTarget) {

            var result = optionalTarget || new zen3d.Vector3();

            this.worldMatrix.decompose(position, quaternion, scale);

            result.set(0, 0, 1).applyQuaternion(quaternion);

            return result;

        };
    }();

    /**
     * set view by look at, this func will set quaternion of this camera
     */
    Object3D.prototype.setLookAt = function(target, up) {
        var eye = this.position;

        var zaxis = new zen3d.Vector3();
        target.subtract(eye, zaxis); // right-hand coordinates system
        zaxis.normalize();

        var xaxis = new zen3d.Vector3();
        xaxis.crossVectors(up, zaxis);
        xaxis.normalize();

        var yaxis = new zen3d.Vector3();
        yaxis.crossVectors(zaxis, xaxis);

        this.quaternion.setFromRotationMatrix(zen3d.helpMatrix.set(
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1
        ));
    }

    /**
     * raycast
     */
    Object3D.prototype.raycast = function() {
        // implemental by subclass
    }

    Object3D.prototype.traverse = function ( callback ) {
		callback( this );

		var children = this.children;
		for ( var i = 0, l = children.length; i < l; i ++ ) {
			children[ i ].traverse( callback );
		}
	}

    Object3D.prototype.clone = function ( recursive ) {
		return new this.constructor().copy( this, recursive );
	}

    Object3D.prototype.copy = function( source, recursive ) {
        if ( recursive === undefined ) recursive = true;

        this.name = source.name;

        this.type = source.type;

        this.position.copy( source.position );
		this.quaternion.copy( source.quaternion );
		this.scale.copy( source.scale );

        this.matrix.copy( source.matrix );
		this.worldMatrix.copy( source.worldMatrix );

        this.castShadow = source.castShadow;
		this.receiveShadow = source.receiveShadow;

        this.frustumCulled = source.frustumCulled;

        this.userData = JSON.parse( JSON.stringify( source.userData ) );

        if ( recursive === true ) {

			for ( var i = 0; i < source.children.length; i ++ ) {

				var child = source.children[ i ];
				this.add( child.clone() );

			}

		}

		return this;
    }

    zen3d.Object3D = Object3D;
})();