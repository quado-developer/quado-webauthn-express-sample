/*
  Functions operating FIDO2 operations.
  Please refer https://doc.quado.io/api.html for more details.
 */


(function (configs) {
    'use strict';

    let endpoint = configs.apiEndpoint
    let header = {
        'Content-Type': 'application/json'
    }

    // Error handler for 4xx/5xx error
    let handleErrors = function (response) {
        if (!response.ok) {
            return response.json().then(function (err) {
                throw Error(`Server responed status:${response.status}. The message is: ${err.message}`);
            });
        } else {
            return response;
        }
    }

    // Common process of response
    let prepare = function (response) {
        if (response.status === 204) {
            return response.text()
        } else {
            return response.json()
        }
    }


    // Translate PublicKeyCredential to serialised JSON
    let publicKeyCredentialToJSON = (pubKeyCred) => {
        if (pubKeyCred instanceof Array) {
            let arr = [];
            for (let i of pubKeyCred)
                arr.push(publicKeyCredentialToJSON(i));
            return arr
        }
        if (pubKeyCred instanceof ArrayBuffer) {
            return base64url.encode(pubKeyCred)
        }
        if (pubKeyCred instanceof Object) {
            let obj = {};
            for (let key in pubKeyCred) {
                obj[key] = publicKeyCredentialToJSON(pubKeyCred[key])
            }
            return obj
        }
        return pubKeyCred
    }

    // Decodes arrayBuffer required fields.
    let preformatMakeCredReq = (makeCredReq) => {
        makeCredReq.challenge = base64url.decode(makeCredReq.challenge);
        makeCredReq.user.id = base64url.decode(makeCredReq.user.id);
        if (makeCredReq.excludeCredentials) {
            for (let cred of makeCredReq.excludeCredentials) {
                cred.id = base64url.decode(cred.id);
            }
        }

        return makeCredReq
    }

    // Decodes arrayBuffer required fields.
    let preformatGetAssertReq = (getAssert) => {
        getAssert.challenge = base64url.decode(getAssert.challenge);

        if (getAssert.allowCredentials) {
            for (let allowCred of getAssert.allowCredentials) {
                allowCred.id = base64url.decode(allowCred.id);
            }
        }
        return getAssert
    }

    // Create challenge for registration
    let getMakeCredentialsChallenge = (uid, username, authenticatorSelection, attestation, timeout, extensions) => {
        let body = {uid,
                    params: {
                        user: {name: username, displayName: username},
                        authenticatorSelection,
                        timeout,
                        attestation}
                    }
        return fetch(endpoint + '/registrations', {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        })
            .then(handleErrors)
            .then(prepare)
            .then(function (response) {
                let request = preformatMakeCredReq(response.fido_request)
                return request
            })
    }

    // Send response for registration
    let sendWebAuthnRegResponse = (cred) => {
        let body = {
            "fido_response": publicKeyCredentialToJSON(cred)
        }
        return fetch(endpoint + '/registrations', {
            method: 'PATCH',
            headers: header,
            body: JSON.stringify(body)
        })
            .then(handleErrors)
            .then(prepare)
    }


    // Create challenge for authentication
    let getGetAssertionChallenge = (uid, userVerification = 'preferred', timeout=10000, extensions=null) => {
        let body = {uid,
                    params: {
                        userVerification,
                        timeout,
                        extensions}
                    }

        return fetch(endpoint + '/authentications', {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        })
            .then(handleErrors)
            .then(prepare)
            .then(function (response) {
                let request = preformatGetAssertReq(response.fido_request)
                return request
            })
    }

    // Send response for authentication
    let sendWebAuthnAuthResponse = (assertion) => {
        let body = {
            "fido_response": publicKeyCredentialToJSON(assertion)
        }
        return fetch(endpoint + '/authentications', {
            method: 'PATCH',
            headers: header,
            body: JSON.stringify(body)
        })
            .then(handleErrors)
            .then(prepare)
    }


    // Get registered keys of user
    let getRegisteredKeys = (uid) => {
        return fetch(`${endpoint}/users/${uid}/registered_keys`, {
            method: 'GET',
            headers: header
        })
            .then(handleErrors)
            .then(prepare)
    }

    // Delete registered keys of user
    let deleteRegisteredKey = (uid, keyId) => {
        return fetch(`${endpoint}/users/${uid}/registered_keys/${keyId}`, {
            method: 'DELETE',
            headers: header
        })
            .then(handleErrors)
            .then(prepare)
    }

    let methods = {
        getMakeCredentialsChallenge: getMakeCredentialsChallenge,
        sendWebAuthnRegResponse: sendWebAuthnRegResponse,
        getGetAssertionChallenge: getGetAssertionChallenge,
        sendWebAuthnAuthResponse: sendWebAuthnAuthResponse,
        getRegisteredKeys: getRegisteredKeys,
        deleteRegisteredKey: deleteRegisteredKey,
        preformatMakeCredReq: preformatMakeCredReq,
        preformatGetAssertReq: preformatGetAssertReq,
        publicKeyCredentialToJSON: publicKeyCredentialToJSON
    }

    // Exporting and stuff
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = methods;

    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function () {
                return methods
            });
        } else {
            window.fido2 = methods;
        }
    }
})(window.configs);
