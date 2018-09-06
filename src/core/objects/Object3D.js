import {generateUUID} from '../base.js';
import {SHADOW_TYPE} from '../const.js';
import {Vector3} from '../math/Vector3.js';
import {Euler} from '../math/Euler.js';
import {Quaternion} from '../math/Quaternion.js';
import {Matrix4} from '../math/Matrix4.js';

/**
 * This is the base class for most objects in zen3d
 * and provides a set of properties and methods for manipulating objects in 3D space.
 * @constructor
 */
function Object3D() {

    /**
     * UUID of this object instance. 
     * This gets automatically assigned, so this shouldn't be edited.
     * @type {string}
     */
    this.uuid = generateUUID();

    /**
     * Optional name of the object (doesn't need to be unique).
     * @type {string}
     * @default ""
     */
    this.name = "";

    /**
     * Type of the object.
     * Set by Subclass.
     * @type {OBJECT_TYPE} 
     */
    this.type = "";

    /**
     * A Vector3 representing the object's local position.
     * @type {Vector3} 
     * @default Vector3(0, 0, 0)
     */
    this.position = new Vector3();

    /**
     * The object's local scale.
     * @type {Vector3} 
     * @default Vector3(1, 1, 1)
     */
    this.scale = new Vector3(1, 1, 1);

    /**
     * Object's local rotation as an {@link Euler}, in radians.
     * @type {Euler} 
     * @default Euler(0, 0, 0)
     */
    this.euler = new Euler();

    /**
     * Object's local rotation as a {@link Quaternion}.
     * @type {Quaternion}
     * @default Quaternion(0, 0, 0, 1)
     */
    this.quaternion = new Quaternion();

    // bind euler and quaternion
    var euler = this.euler, quaternion = this.quaternion;
    euler.onChange(function() {
        quaternion.setFromEuler(euler, false);
    });
    quaternion.onChange(function() {
        euler.setFromQuaternion(quaternion, undefined, false);
    });

    /**
     * The local transform matrix.
     * @type {Matrix4}
     */
    this.matrix = new Matrix4();

    /**
     * The global transform of the object. 
     * If the Object3D has no parent, then it's identical to the local transform {@link Object3D#matrix}.
     * @type {Matrix4}
     */
    this.worldMatrix = new Matrix4();

    /**
     * Object's parent in the scene graph. 
     * An object can have at most one parent.
     * @type {Object3D[]}
     */
    this.children = new Array();

    /**
     * Object's parent in the scene graph. 
     * An object can have at most one parent.
     * @type {Object3D}
     */
    this.parent = null;

    /**
     * Whether the object gets rendered into shadow map.
     * @type {boolean}
     * @default false
     */
    this.castShadow = false;

    /**
     * Whether the material receives shadows.
     * @type {boolean}
     * @default false
     */
    this.receiveShadow = false;

    /**
     * Defines shadow map type.
     * @type {SHADOW_TYPE}
     * @default SHADOW_TYPE.PCF_SOFT
     */
    this.shadowType = SHADOW_TYPE.PCF_SOFT;

    /**
     * When this is set, it checks every frame if the object is in the frustum of the camera before rendering the object. 
     * Otherwise the object gets rendered every frame even if it isn't visible.
     * @type {boolean}
     * @default true
     */
    this.frustumCulled = true;

    /**
     * Object gets rendered if true.
     * @type {boolean} 
     * @default true
     */
    this.visible = true;

    /**
     * This value allows the default rendering order of scene graph objects to be overridden although opaque and transparent objects remain sorted independently. 
     * Sorting is from lowest to highest renderOrder.
     * @type {number}
     * @default 0
     */
    this.renderOrder = 0;

    /**
     * An object that can be used to store custom data about the {@link Object3D}. 
     * It should not hold references to functions as these will not be cloned.
     * @type {Object}
     * @default {}
     */
    this.userData = {};
}

Object.assign(Object3D.prototype, {

    /**
     * An optional callback that is executed immediately before the Object3D is rendered.
     * @memberof Object3D#
     * @type {Function}
     */
    onBeforeRender: function () {},

    /**
     * An optional callback that is executed immediately after the Object3D is rendered.
     * @memberof Object3D#
     * @type {Function}
     */
	onAfterRender: function () {},

    /**
     * Add object as child of this object.
     * @memberof Object3D#
     * @param {Object3D} object
     */
    add: function(object) {
        this.children.push(object);
        object.parent = this;
    },

    /**
     * Remove object as child of this object.
     * @memberof Object3D#  
     * @param {Object3D} object
     */
    remove: function(object) {
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        object.parent = null;
    },

    /**
     * Searches through the object's children and returns the first with a matching name.
     * Note that for most objects the name is an empty string by default. 
     * You will have to set it manually to make use of this method.
     * @memberof Object3D#
     * @param {string} name - String to match to the children's {@link Object3D#name} property. 
     * @return {Object3D}
     */
    getObjectByName: function(name) {
        return this.getObjectByProperty('name', name);
    },

    /**
     * Searches through the object's children and returns the first with a property that matches the value given.
     * @memberof Object3D#
     * @param {string} name - the property name to search for. 
     * @param {number} value - value of the given property. 
     * @return {Object3D}
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
     * Update the local transform.
     * @memberof Object3D#
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

    /**
     * Returns a vector representing the direction of object's positive z-axis in world space.
     * This call must be after {@link Object3D#updateMatrix}.
     * @memberof Object3D#
     * @method
     * @param {Vector3} [optionalTarget=] — the result will be copied into this Vector3.
     * @return {Vector3} - the result.
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
     * Rotates the object to face a point in local space.
     * @memberof Object3D#
     * @method
     * @param {Vector3} target - A vector representing a position in local space.
     * @param {Vector3} up — A vector representing the up direction in local space.
     */
    lookAt: function() {

        var m = new Matrix4();

        return function lookAt(target, up) {

            m.lookAtRH(target, this.position, up);
            this.quaternion.setFromRotationMatrix(m);

        };

    }(),

    /**
     * Method to get intersections between a casted ray and this object.
     * @memberof Object3D#  
     * @abstract
     * @param {Raycaster} raycaster - The {@link Raycaster} instance.
     * @param {Array} intersects - output intersects array.
     */
    raycast: function(raycaster, intersects) {
        
    },

    /**
     * Executes the callback on this object and all descendants.
     * @memberof Object3D#  
     * @param {Function} callback - A function with as first argument an object3D object.
     */
    traverse: function ( callback ) {
        callback( this );

        var children = this.children;
        for ( var i = 0, l = children.length; i < l; i ++ ) {
            children[ i ].traverse( callback );
        }
    },
    
    /**
     * Returns a clone of this object and optionally all descendants.
     * @memberof Object3D#  
     * @param {Function} [recursive=true] - if true, descendants of the object are also cloned.
     * @return {Object3D}
     */
    clone: function ( recursive ) {
        return new this.constructor().copy( this, recursive );
    },

    /**
     * Copy the given object into this object.
     * @memberof Object3D#  
     * @param {Object3D} source - The object to be copied.
     * @param {Function} [recursive=true] - if true, descendants of the object are also copied.
     * @return {Object3D}
     */
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