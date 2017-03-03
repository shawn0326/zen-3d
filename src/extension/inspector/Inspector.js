(function() {

    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;

    function countObject(object, result) {
        result = result || {
            point: 0,
            canvas2D: 0,
            mesh: 0,
            sprite: 0,
            ambientLight: 0,
            directLight: 0,
            pointLight: 0,
            spotLight: 0,
            shadowLight: 0,
            spotLight: 0,
            group: 0
        };

        for(var i = 0; i < object.children.length; i++) {
            countObject(object.children[i], result);
        }

        // cache all type of objects
        switch (object.type) {
            case OBJECT_TYPE.POINT:
                result.point++;
                break;
            case OBJECT_TYPE.CANVAS2D:
                result.canvas2D++;
                break;
            case OBJECT_TYPE.MESH:
                result.mesh++;
                break;
            case OBJECT_TYPE.SPRITE:
                result.sprite++;
                break;
            case OBJECT_TYPE.LIGHT:
                if (object.lightType == LIGHT_TYPE.AMBIENT) {
                    result.ambientLight++;
                } else if (object.lightType == LIGHT_TYPE.DIRECT) {
                    result.directLight++;
                } else if (object.lightType == LIGHT_TYPE.POINT) {
                    result.pointLight++;
                } else if (object.lightType == LIGHT_TYPE.SPOT) {
                    result.spotLight++;
                }

                if (object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
                    result.shadowLight++;
                }
                break;
            case OBJECT_TYPE.CAMERA:
                // do nothing
                break;
            case OBJECT_TYPE.SCENE:
                // do nothing
                break;
            case OBJECT_TYPE.GROUP:
                result.group++;
                break;
            default:
                console.log("undefined object type")
        }

        return result;
    }

    var Inspector = function() {
        this.performancePanel = null;

        this.scenePanel = null;

        this.capabilitiesPanel = null;
    }

    Inspector.prototype.showPerformanceInfo = function(performance) {
        performance.enableCounter = true;

        if(!this.performancePanel) {
            var performancePanel = document.createElement("div");
            performancePanel.style.position = "absolute";
            performancePanel.style.top = "0px";
            performancePanel.style.left = "0px";
            performancePanel.style.backgroundColor = "rgba(0,0,0,0.6)";
            performancePanel.style.color = "rgba(255,255,255,1)";
            document.body.appendChild(performancePanel);

            this.performancePanel = performancePanel;
        }

        var renderPerformance = performance.getEntity("render");
    	var updateMatrixPerformance = performance.getEntity("updateMatrix");
        var cacheScenePerformance = performance.getEntity("cacheScene");
    	var renderShadowPerformance = performance.getEntity("renderShadow");
    	var renderListPerformance = performance.getEntity("renderList");

        var fps = performance.getFps();
        this.performancePanel.innerHTML =
            "<span>fps: </span>" + (fps || "--") + "<br/>" +
            "<span>all render cost: </span>" + (renderPerformance ? Math.floor(renderPerformance.averageDelta) : "--") + "ms<br/>" +
            "<span>matrix cost: </span>" + (updateMatrixPerformance ? Math.floor(updateMatrixPerformance.averageDelta): "--") + "ms<br/>" +
            "<span>cache cost: </span>" + (cacheScenePerformance ? Math.floor(cacheScenePerformance.averageDelta) : "--") + "ms<br/>" +
            "<span>renderShadow cost: </span>" + (renderShadowPerformance ? Math.floor(renderShadowPerformance.averageDelta) : "--") + "ms<br/>" +
            "<span>renderList cost: </span>" + (renderListPerformance ? Math.floor(renderListPerformance.averageDelta) : "--") + "ms";
    }

    Inspector.prototype.showSceneInfo = function(scene) {
        if(!this.scenePanel) {
            var scenePanel = document.createElement("div");
            scenePanel.style.position = "absolute";
            scenePanel.style.top = "200px";
            scenePanel.style.left = "0px";
            scenePanel.style.backgroundColor = "rgba(0,0,0,0.6)";
            scenePanel.style.color = "rgba(255,255,255,1)";
            document.body.appendChild(scenePanel);

            this.scenePanel = scenePanel;
        }

        var result = countObject(scene);

        var html = "";
        for(var key in result) {
            html += "<span>" + key + ": </span>" + result[key] + "<br/>";
        }
        this.scenePanel.innerHTML = html;
    }

    Inspector.prototype.showCapabilitiesInfo = function(capabilities) {
        if(!this.capabilitiesPanel) {
            var capabilitiesPanel = document.createElement("div");
            capabilitiesPanel.style.position = "absolute";
            capabilitiesPanel.style.top = "100px";
            capabilitiesPanel.style.left = "0px";
            capabilitiesPanel.style.backgroundColor = "rgba(0,0,0,0.6)";
            capabilitiesPanel.style.color = "rgba(255,255,255,1)";
            document.body.appendChild(capabilitiesPanel);

            this.capabilitiesPanel = capabilitiesPanel;
        }

        var html = "";
        html += "<span>maxPrecision: </span>" + capabilities.maxPrecision + "<br/>";
        html += "<span>maxTextures: </span>" + capabilities.maxTextures + "<br/>";
        html += "<span>maxTextureSize: </span>" + capabilities.maxTextureSize + "<br/>";
        html += "<span>maxCubemapSize: </span>" + capabilities.maxCubemapSize + "<br/>";
        html += "<span>maxVertexUniformVectors: </span>" + capabilities.maxVertexUniformVectors + "<br/>";

        this.capabilitiesPanel.innerHTML = html;
    }

    zen3d.Inspector = Inspector;
})();