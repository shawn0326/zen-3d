(function() {
    /**
     * ImageLoader
     * @class
     * Loader for image
     */
    var ImageLoader = function() {
        this.crossOrigin = undefined;
        this.path = undefined;
    }

    ImageLoader.prototype.load = function(url, onLoad, onProgress, onError) {
        if (url === undefined) url = '';
        if (this.path !== undefined) url = this.path + url;

        var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');

        image.addEventListener('load', function() {
            if (onLoad) onLoad(this);
        }, false);

        // image.addEventListener('progress', function(event) {
        //     if (onProgress) onProgress(event);
        // }, false);

        image.addEventListener('error', function(event) {
            if (onError) onError(event);
        }, false);

        if (url.substr(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;
        }

        image.src = url;

        return image;
    }

    ImageLoader.prototype.setCrossOrigin = function(value) {
        this.crossOrigin = value;
        return this;
    }

    ImageLoader.prototype.setPath = function(value) {
        this.path = value;
        return this;
    }

    zen3d.ImageLoader = ImageLoader;
})();