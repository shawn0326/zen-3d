/**
 * EventDispatcher Class
 **/
function EventDispatcher() {
    this.eventMap = {};
}

Object.assign(EventDispatcher.prototype, {

    /**
     * add a event listener
     **/
    addEventListener: function(type, listener, thisObject) {
        var list = this.eventMap[type];

        if(!list) {
            list = this.eventMap[type] = [];
        }

        list.push({listener: listener, thisObject: thisObject || this});
    },

    /**
     * remove a event listener
     **/
    removeEventListener: function(type, listener, thisObject) {
        var list = this.eventMap[type];

        if(!list) {
            return;
        }

        for(var i = 0, len = list.length; i < len; i++) {
            var bin = list[i];
            if(bin.listener == listener && bin.thisObject == (thisObject || this)) {
                list.splice(i, 1);
                break;
            }
        }
    },

    /**
     * dispatch a event
     **/
    dispatchEvent: function(event) {
        event.target = this;
        this.notifyListener(event);
    },

    /**
     * notify listener
     **/
    notifyListener: function(event) {
        var list = this.eventMap[event.type];

        if(!list) {
            return;
        }

        for(var i = 0, len = list.length; i < len; i++) {
            var bin = list[i];
            bin.listener.call(bin.thisObject, event);
        }
    }

});

export {EventDispatcher};