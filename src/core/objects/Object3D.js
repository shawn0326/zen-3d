import {generateUUID} from '../base.js';
import {SHADOW_TYPE} from '../const.js';
import {Vector3} from '../math/Vector3.js';
import {Euler} from '../math/Euler.js';
import {Quaternion} from '../math/Quaternion.js';
import {Matrix4} from '../math/Matrix4.js';

/**
 * Object3D
 * @class
 */
function Object3D() {

    this.uuid = generateUUID();

    // a custom name for this object
    this.name = "";

    // type of this object, set by subclass
    this.type = "";

    // position
    this.position = new Vector3();
    // scale
    this.scale = new Vector3(1, 1, 1);

    // euler rotate
    var euler = this.euler = new Euler();
    // quaternion rotate
    var quaternion = this.quaternion = new Quaternion();

    // bind euler and quaternion
    euler.onChange(function() {
        quaternion.setFromEuler(euler, false);
    });
    quaternion.onChange(function() {
        euler.setFromQuaternion(quaternion, undefined, false);
    });

    // transform matrix
    this.matrix = new Matrix4();
    // world transform matrix
    this.worldMatrix = new Matrix4();

    // children
    this.children = new Array();
    // parent
    this.parent = null;

    // shadow
    this.castShadow = false;
    this.receiveShadow = false;
    this.shadowType = SHADOW_TYPE.PCF_SOFT;

    // frustum test
    this.frustumCulled = true;

    this.visible = true;

    this.userData = {};

    // render from lowest to highest
    this.renderOrder = 0;
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

Object.assign(Object3D.prototype, {

    onBeforeRender: function () {},
	onAfterRender: function () {},

    /**
     * add child to object3d
     */
    add: function(object) {
        this.children.push(object);
        object.parent = this;
    },

    /**
     * remove child from object3d
     */
    remove: function(object) {
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        object.parent = null;
    },

    /**
     * get object by name
     */
    getObjectByName: function(name) {
        return this.getObjectByProperty('name', name);
    },

    /**
     * get object by property
     */
    getObjectByProperty: function(name, value) {
        if (this[name] === value) return this;

        for (var i = 0, l = this.children.length; i < l; i++) {

            var child = this.children[i];
            var object = child.getObjectByProperty(name, value);

            if (object !== undefined) {

                return object;

            }

        }

        return undefined;
    },

    /**
     * update matrix
     */
    updateMatrix: function() {
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
    },

    /*
        * get world direction
        * must call after world matrix updated
        */
    getWorldDirection: function() {

        var position = new Vector3();
        var quaternion = new Quaternion();
        var scale = new Vector3();

        return function getWorldDirection(optionalTarget) {

            var result = optionalTarget || new Vector3();

            this.worldMatrix.decompose(position, quaternion, scale);

            result.set(0, 0, 1).applyQuaternion(quaternion);

            return result;

        };
    }(),

    /**
     * set view by look at, this func will set quaternion of this object
     */
    lookAt: function() {

        var m = new Matrix4();

        return function lookAt(target, up) {

            m.lookAtRH(target, this.position, up);
            this.quaternion.setFromRotationMatrix(m);

        };

    }(),

    /**
     * raycast
     */
    raycast: function() {
        // implemental by subclass
    },

    traverse: function ( callback ) {
        callback( this );

        var children = this.children;
        for ( var i = 0, l = children.length; i < l; i ++ ) {
            children[ i ].traverse( callback );
        }
    },

    clone: function ( recursive ) {
        return new this.constructor().copy( this, recursive );
    },

    copy: function( source, recursive ) {
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

});

export {Object3D};