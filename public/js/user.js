/**
 * User management service on LocalStorage.
 *
 * Key is Username and value is user attribute in json string format.
 * User attribute have password and uid which is alias ID used in FIDO server.
 */

(function () {
    'use strict';

    let storage = localStorage

    let guid = () => {
        function _p8(s) {
            let p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    /**
     * Get user item from name&password
     * If force option is specified, ignore password check
     */
    let get = (name, password, force = false) => {
        let data = storage.getItem(name)
        if (data) {
            let props = JSON.parse(data)
            if (props.password === password || force) {
                return {name, props}
            }
        }
        return null;
    }

    /**
     * Get user item from uid
     * If force option is specified, ignore password check
     */
    let getByUid = (uid) => {
        let name = storage.getItem(uid)
        if (name) {
            return get(name, null, true)
        }
        return null
    }

    /**
     * Create user item
     */
    let create = (name, props) => {
        props.uid = guid()
        storage.setItem(name, JSON.stringify(props))
        // Enable to get username from uid
        storage.setItem(props.uid, name)
        return {name, props}
    }

    /**
     * Get username from uid
     */
    let getUid = (name) => {
        let data = storage.getItem(name)
        if (data) {
            return JSON.parse(data).uid || null
        }
        return null;
    }

    /**
     * Check where the same username exist
     */
    let exist = (name) => storage.getItem(name) ? true : false

    window.user = {
        get: get,
        getByUid: getByUid,
        create: create,
        getUid: getUid,
        exist: exist
    }
})(window.configs);
