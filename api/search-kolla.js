import * as jose from 'jose'

/*
For dependencies listed in a package.json file at the root of a project, the following behavior is used:

If a package-lock.json file is present in the project, npm install is used.
Otherwise, yarn is used, by default.

*/

// setup auth0 remote keyset
const JWKS = jose.createRemoteJWKSet(
  new URL('https://infinitysearch.us.auth0.com/.well-known/jwks.json')
)

// https://github.com/panva/jose/blob/main/docs/interfaces/jwt_verify.JWTVerifyOptions.md
const JWTOptions = {
  algorithms: ['RS256'],
  issuer: 'https://infinitysearch.us.auth0.com/'
  // audience: 'https://infinitysearch.xyz'
}

// this function will be launched when the API is called.
module.exports = async (req, res) => {
  var subscriber

  try {
    subscriber = await validateRequest(req)
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }
  // TODO: lookup jobnimbus token using subscriber
  // TODO: make request to kolla for data
  // TODO: return the results
  var result = {
    subscriber: subscriber,
    headers: req.headers
  }

  // for now just return the subscriber
  res.status(200).json(result)
}

// handler to validate the JWT authentication token
async function validateRequest (req) {
  const authHeader = req.headers['authorization']
  const parts = authHeader.split(' ')

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw 'invalid authentication header'
  }

  const jwt = parts[1]

  // token, JWTVerifyGetKey, JWTVerifyOptions
  const { payload, protectedHeader } = await jose.jwtVerify(
    jwt,
    JWKS,
    JWTOptions
  )
  // https://github.com/panva/jose/blob/main/docs/interfaces/types.JWTVerifyResult.md

  const subscriber = payload['sub']

  return subscriber
}
