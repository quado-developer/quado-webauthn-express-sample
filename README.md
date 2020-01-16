# Quado FIDO2/WebAuthn Relying Party Sample

This is a sample code for understanding how to integrate Quado in your relying party.
Server side code is written in Express.js and front side code is written in pure javascript.

**NOTE:** For simplicity, this sample uses localstorage of browser in order to manage users. Thus, username, password and uid are saved in browser. In a production environment, you should implement user management functionality on server side.

## Live Demo

**[VIEW LIVE DEMO](https://demo.quado.io)**

## Supported Browser

| <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/edge/edge_512x512.png" alt="Edge" width="48px" height="48px" /></br> Microsoft Edge | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox/firefox_512x512.png" alt="Firefox" width="48px" height="48px" /></br> Mozilla Firefox | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome/chrome_512x512.png" alt="Chrome" width="48px" height="48px" /></br> Google Chrome | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/safari/safari_512x512.png" alt="Safari" width="48px" height="48px" /></br> Safari
| --- | --- | --- | --- |
| 18+ | 60+ | 67+ | 13+ |

## Setup

### Register new relying party

First of all, you need to sign up [Quado console](https://quado.io) to register new relying party.
Please refer to this [document](https://doc.quado.io/quick_start/#register-new-relying-party) for more details.

Set the parameters below on "CONFIGURATION" page of Quado console.

|  Parameter  |  Value |
| ---- | ---- |
|  Allowed domain  |  localhost  |
|  Allowed origins  |  http://localhost:2000  |

**NOTE:** If you run this server in another domain, change these parameters according to your environment.

You can find `API key` and `API endpoint` in the bottom of `CONFIGURATION` page. These values will be used later.

### Run

Install dependencies.

``` bash
# In case of yarn
yarn install

# In case of npm
npm install
```

Specify your `API key` and `API endpoint` in `app.js` file.


``` javascript
const API_KEY = "YOUR_API_KEY"
const ENDPOINT = "https://api.quado.io/webauthn/api/v1"
```

Start web server and you can access `http://localhost:2000`.

``` bash
node app.js
```

## Usage

### Registration

After sign up and click "Register new FIDO2 device" button, you can see registration page below.

<img src="fig/registration.png" width="700">

Click "Start Registration" to register new FIDO key.

**NOTE:** The optional `authenticatorAttachment` attribute filters eligible authenticator by type.
The value “platform” indicates a platform authenticator, such as Windows Hello or MacOS's TouchID.
The value "cross-platform" value indicates a roaming authenticator, such as a security key.

Once your FIDO key was registered, you can see registered key from "/top.html".

### Authentication

After registration, you can try authentication from "/auth.html".

<img src="fig/authentication.png" width="700">

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 © <a href="https://www.quado.io" target="_blank">Quado, Inc.</a>.
