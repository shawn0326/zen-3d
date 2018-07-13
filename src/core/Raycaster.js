(function() {

    // imports
    var Ray = zen3d.Ray;

    function Raycaster(origin, direction, near, far) {
        this.ray = new Ray(origin, direction);

        this.near = near || 0;

        this.far = far || Infinity;
    }

    function ascSort(a, b) {
        return a.distance - b.distance;
    }

    function intersectObject(object, raycaster, intersects, recursive) {
        object.raycast(raycaster, intersects);

        if (recursive === true) {
            var children = object.children;

            for (var i = 0, l = children.length; i < l; i++) {
                intersectObject(children[i], raycaster, intersects, true);
            }
        }
    }

    Raycaster.prototype = Object.assign(Raycaster.prototype, {

        set: function(origin, direction) {
            this.ray.set(origin, direction);
        },

        setFromCamera: function(coords, camera) {
            // if ((camera && camera.isPerspectiveCamera)) {
                this.ray.origin.setFromMatrixPosition(camera.worldMatrix);
                this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
            // } else if ((camera && camera.isOrthographicCamera)) {
            //     this.ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera); // set origin in plane of camera
            //     this.ray.direction.set(0, 0, -1).transformDirection(camera.worldMatrix);
            // } else {
            //     console.error('Raycaster: Unsupported camera type.');
            // }
        },

        intersectObject: function(object, recursive) {
            var intersects = [];
    
            intersectObject(object, this, intersects, recursive);
    
            intersects.sort(ascSort);
    
            return intersects;
        },

        intersectObjects: function(objects, recursive) {
            var intersects = [];
    
            if (Array.isArray(objects) === false) {
                console.warn('Raycaster.intersectObjects: objects is not an Array.');
                return intersects;
            }
    
            for (var i = 0, l = objects.length; i < l; i++) {
                intersectObject(objects[i], this, intersects, recursive);
            }
    
            intersects.sort(ascSort);
    
            return intersects;
        }

    });

    // exports
    zen3d.Raycaster = Raycaster;
    
})();