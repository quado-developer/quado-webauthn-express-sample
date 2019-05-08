const express = require("express")
const request = require("request")
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json());

// Set API_KEY value to your API key
const API_KEY = "YOUR_API_KEY"


const ENDPOINT = "https://api.quado.io/webauthn/api/v1"
const PORT = 2000
app.use('/', express.static(__dirname + '/public'))

const server = app.listen(PORT, () => {
  console.log('Listening at http://localhost:%s', server.address().port);
});

// Add API key to headers
app.use((req, res, next) => {
  req.headers['x-api-key'] = API_KEY
  next();
});

// If URL schema of this server is http, NODE_TLS_REJECT_UNAUTHORIZED must be 0.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

app.post("/registrations", (req, res) => {
  request({
    url: ENDPOINT + '/registrations',
    method: "POST",
    headers: req.headers,
    json: req.body
  }).pipe(res)
})

app.patch("/registrations", (req, res) => {
  request({
    url: ENDPOINT + '/registrations/' + req.body.messageId,
    method: "PATCH",
    headers: req.headers,
    json: req.body
  }).pipe(res)
})

app.post("/authentications", (req, res) => {
  request({
    url: ENDPOINT + '/authentications',
    method: "POST",
    headers: req.headers,
    json: req.body
  }).pipe(res)
})

app.patch("/authentications", (req, res) => {
  request({
    url: ENDPOINT + '/authentications/' + req.body.messageId,
    method: "PATCH",
    headers: req.headers,
    json: req.body
  }).pipe(res)
})

app.get("/users/:uid", (req, res) => {
  request({
    url: ENDPOINT + '/users/' + req.params.uid,
    method: "GET",
    headers: req.headers,
  }).pipe(res)
})

app.get("/users/:uid/registered_keys", (req, res) => {
  request({
    url: ENDPOINT + '/users/' + req.params.uid + '/registered_keys',
    method: "GET",
    headers: req.headers,
  }).pipe(res)
})

app.delete("/users/:uid/registered_keys/:key_id", (req, res) => {
  request({
    url: ENDPOINT + '/users/' + req.params.uid + '/registered_keys/' + req.params.key_id,
    method: "DELETE",
    headers: req.headers,
  }).pipe(res)
})
