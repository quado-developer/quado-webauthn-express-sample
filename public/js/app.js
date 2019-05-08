/**
 * Sample controller.
 */

(function (configs, userStore) {
    'use strict';

    let getRootPath = () => {
        let paths = location.pathname.split('/')
        paths.pop()
        return paths.join('/')
    }

    let rootName = getRootPath()
    let storage = localStorage
    let lastUserKey = 'last'
    let loggingInUserKey = 'loggingIn'
    let twoStepCustomScheme = 'loggingInWithCustomScheme'
    let currentUserKey = 'current'

    let customScheme = configs.customScheme || 'controll://idsettings'
    let indexPath = `${rootName}/index.html`
    let topPath = `${rootName}/top.html`
    let twoStepPath = `${rootName}/2step.html`

    let User = userStore    // 要user.js

    let login = (name, password, opts = {}) => {
        let force = opts.force || false
        let user = User.get(name, password, force)
        if (user) {
            let useCustomScheme = opts.useCustomScheme || false
            storage.setItem(currentUserKey, name)
            storage.setItem(lastUserKey, name)
            storage.removeItem(loggingInUserKey)
            storage.removeItem(twoStepCustomScheme)
            if (useCustomScheme) {
                window.location = customScheme
            } else {
                window.location = topPath
            }
            return user
        }
        return null;
    }

    let loginByKey = (key, useCustomScheme = false) => {
        let user = User.getByUid(key.uid)
        let force = true
        if (user) {
            login(user.name, null, {force, useCustomScheme})
            return user
        }
        return null
    }

    let twoStepLogin = (name, password, useCustomScheme = false) => {
        let force = false
        let user = User.get(name, password, {force})
        if (user) {
            storage.setItem(loggingInUserKey, name)
            storage.setItem(twoStepCustomScheme, useCustomScheme)
            window.location = twoStepPath
            return true
        }
        return false;
    }

    let twoStepLoginConfirm = (key) => {
        let name = loggingInUserName()
        let user = User.getByUid(key.uid)
        let useCustomScheme = storage.getItem(twoStepCustomScheme)
        let force = true
        if (name === user.name) {
            login(name, null, {force, useCustomScheme})
            return user
        }
    }

    let logout = () => {
        storage.removeItem(currentUserKey)
        storage.removeItem(loggingInUserKey)
        storage.removeItem(twoStepCustomScheme)
        window.location = indexPath
    }

    let signup = (username, password) => {
        if (User.exist(username)) {
            throw new Error(username + " aleady exists.");
        } else {
            User.create(username, {password})
            if (!login(username, password)) {
                throw new Error("Signup failed")
            }
        }
    }

    let checkLogin = () => {
        if (currentUserName()) {
            window.location = topPath
            return true
        }
        return false
    }

    let checkLogout = () => {
        if (!currentUserName()) {
            logout()
            return true
        }
        return false
    }

    let lastUserName = () => storage.getItem(lastUserKey) || ''

    let loggingInUserName = () => storage.getItem(loggingInUserKey)

    let loggingInUserID = () => User.getUid(loggingInUserName())

    let currentUserName = () => storage.getItem(currentUserKey)

    let currentUserID = () => User.getUid(currentUserName())

    let moveToRoot = () => {
        if (currentUserName()) {
            window.location = topPath
        } else {
            window.location = indexPath
        }
    }

    let clear = () => storage.clear()

    window.app = {
        login: login,
        twoStepLogin: twoStepLogin,
        twoStepLoginConfirm: twoStepLoginConfirm,
        loginByKey: loginByKey,
        logout: logout,
        signup: signup,
        checkLogin: checkLogin,
        checkLogout: checkLogout,

        getLastUserName: lastUserName,
        getLoggingInUID: loggingInUserID,
        getCurrentUserName: currentUserName,
        getCurrentUID: currentUserID,
        getUid: user.getUid,

        moveToRoot: moveToRoot,
        clear: clear
    }
})(window.configs, window.user);
