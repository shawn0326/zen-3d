/**
 * JavaScript events for custom objects.
 * @memberof zen3d
 * @constructor
 */
function EventDispatcher() {

    this.eventMap = {};

}

Object.assign(EventDispatcher.prototype, /** @lends zen3d.EventDispatcher.prototype */{

    /**
     * Adds a listener to an event type.
     * @param {string} type - The type of event to listen to.
     * @param {function} listener - The function that gets called when the event is fired.
     * @param {Object} [thisObject = this] - The Object of calling listener method.
     */
    addEventListener: function(type, listener, thisObject) {
        var list = this.eventMap[type];

        if (!list) {
            list = this.eventMap[type] = [];
        }

        list.push({listener: listener, thisObject: thisObject || this});
    },

    /**
     * Removes a listener from an event type.
     * @param {string} type - The type of the listener that gets removed.
     * @param {function} listener - The listener function that gets removed.
     * @param {Object} [thisObject = this] thisObject - The Object of calling listener method.
     */
    removeEventListener: function(type, listener, thisObject) {
        var list = this.eventMap[type];

        if (!list) {
            return;
        }

        for (var i = 0, len = list.length; i < len; i++) {
            var bin = list[i];
            if (bin.listener == listener && bin.thisObject == (thisObject || this)) {
                list.splice(i, 1);
                break;
            }
        }
    },

    /**
     * Fire an event type.
     * @param {Object} event - The event that gets fired.
     */
    dispatchEvent: function(event) {
        event.target = this;
        this.notifyListener(event);
    },

    /**
     * notify listener
     * @private
     * @param {Object} event - The event that gets fired.
     */
    notifyListener: function(event) {
        var list = this.eventMap[event.type];

        if (!list) {
            return;
        }

        for (var i = 0, len = list.length; i < len; i++) {
            var bin = list[i];
            bin.listener.call(bin.thisObject, event);
        }
    }

});

export {EventDispatcher};