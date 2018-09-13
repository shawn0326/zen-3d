import {OBJECT_TYPE} from '../../const.js';
import {Object3D} from '../Object3D.js';
import {Matrix4} from '../../math/Matrix4.js';
import {Frustum} from '../../math/Frustum.js';
import {Vector4} from '../../math/Vector4.js';
import {Quaternion} from '../../math/Quaternion.js';
import {Vector3} from '../../math/Vector3.js';

/**
 * The camera used for rendering a 3D scene.
 * @memberof zen3d
 * @constructor
 * @extends zen3d.Object3D
 */
function Camera() {

    Object3D.call(this);

    this.type = OBJECT_TYPE.CAMERA;

    // view matrix
    this.viewMatrix = new Matrix4();

    // projection matrix
    this.projectionMatrix = new Matrix4();

    // camera frustum
    this.frustum = new Frustum();

    // gamma space or linear space
    this.gammaFactor = 2.0;
    this.gammaInput = false;
    this.gammaOutput = false;
    
    /**
     * Where on the screen is the camera rendered in normalized coordinates.
     * @type {zen3d.Vector4}
     * @default zen3d.Vector4(0, 0, 1, 1)
     */
    this.rect = new Vector4(0, 0, 1, 1);

    /**
     * When this is set, it checks every frame if objects are in the frustum of the camera before rendering objects. 
     * Otherwise objects gets rendered every frame even if it isn't visible.
     * @type {boolean}
     * @default true
     */
    this.frustumCulled = true;

}

Camera.prototype = Object.assign(Object.create(Object3D.prototype), /** @lends zen3d.Camera.prototype */{

    constructor: Camera,

    /**
     * set view by look at, this func will set quaternion of this camera
     */
    lookAt: function() {
        var m = new Matrix4();

        return function lookAt(target, up) {

            m.lookAtRH(this.position, target, up);
            this.quaternion.setFromRotationMatrix(m);

        };
    }(),

    /**
     * set orthographic projection matrix
     */
    setOrtho: function(left, right, bottom, top, near, far) {
        this.projectionMatrix.set(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        );
    },

    /**
     * set perspective projection matrix
     */
    setPerspective: function(fov, aspect, near, far) {
        this.projectionMatrix.set(
            1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
            0, 1 / (Math.tan(fov / 2)), 0, 0,
            0, 0, -(far + near) / (far - near), -2 * far * near / (far - near),
            0, 0, -1, 0
        );
    },

    /*
        * get world direction (override)
        * must call after world matrix updated
        */
    getWorldDirection: function() {

        var position = new Vector3();
        var quaternion = new Quaternion();
        var scale = new Vector3();

        return function getWorldDirection(optionalTarget) {

            var result = optionalTarget || new Vector3();

            this.worldMatrix.decompose(position, quaternion, scale);

            result.set(0, 0, -1).applyQuaternion(quaternion);

            return result;

        };
    }(),

    updateMatrix: function() {

        var matrix = new Matrix4();

        return function updateMatrix() {
            Object3D.prototype.updateMatrix.call(this);

            this.viewMatrix.getInverse(this.worldMatrix); // update view matrix
    
            matrix.multiplyMatrices(this.projectionMatrix, this.viewMatrix); // get PV matrix
            this.frustum.setFromMatrix(matrix); // update frustum
        }
        
    }(),

    copy: function ( source, recursive ) {
        Object3D.prototype.copy.call( this, source, recursive );

        this.viewMatrix.copy( source.viewMatrix );
        this.projectionMatrix.copy( source.projectionMatrix );

        return this;
    }

});

export {Camera};