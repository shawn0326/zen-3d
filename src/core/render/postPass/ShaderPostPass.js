import {Scene} from '../../objects/Scene.js';
import {Camera} from '../../objects/camera/Camera.js';
import {Vector3} from '../../math/Vector3.js';
import {PlaneGeometry} from '../../geometry/PlaneGeometry.js';
import {ShaderMaterial} from '../../material/ShaderMaterial.js';
import {Mesh} from '../../objects/Mesh.js';

function cloneUniforms(uniforms_src) {
    var uniforms_dst = {};

    for(var name in uniforms_src) {
        var uniform_src = uniforms_src[name];
        // TODO zen3d object clone
        if ( Array.isArray( uniform_src ) ) {
            uniforms_dst[name] = uniform_src.slice();
        } else {
            uniforms_dst[name] = uniform_src;
        }
    }

    return uniforms_dst;
}

function ShaderPostPass(shader) {
    var scene = new Scene();

    var camera = this.camera = new Camera();
    camera.frustumCulled = false;
    camera.position.set(0, 1, 0);
    camera.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, -1));
    camera.setOrtho(-1, 1, -1, 1, 0.1, 2);
    scene.add(camera);

    var geometry = new PlaneGeometry(2, 2, 1, 1);
    this.uniforms = cloneUniforms(shader.uniforms);
    var material = this.material = new ShaderMaterial(shader.vertexShader, shader.fragmentShader, this.uniforms);
    Object.assign( material.defines, shader.defines ); // copy defines
    var plane = new Mesh(geometry, material);
    plane.frustumCulled = false;
    scene.add(plane);

    // static scene
    scene.updateMatrix();
    this.renderList = scene.updateRenderList(camera);

    this.renderConfig = {};
}

Object.assign(ShaderPostPass.prototype, {

    render: function(glCore) {
        glCore.renderPass(this.renderList.opaque, this.camera, this.renderConfig);
    }

});

export {ShaderPostPass};