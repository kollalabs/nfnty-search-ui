import * as jose from 'jose'

/*
For dependencies listed in a package.json file at the root of a project, the following behavior is used:

If a package-lock.json file is present in the project, npm install is used.
Otherwise, yarn is used, by default.

*/

// setup link to the remote keyset
const JWKS = jose.createRemoteJWKSet(
  new URL('https://infinitysearch.us.auth0.com/.well-known/jwks.json')
)

module.exports = async (req, res) => {
  // this function will be launched when the API is called.
  try {
    let authHeader = req.headers['authorization']
    let parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ error: 'invalid authentication header' })
    }

    let jwt = parts[1]

    // https://github.com/panva/jose/blob/main/docs/interfaces/jwt_verify.JWTVerifyOptions.md
    let options = {
      algorithms: ['RS256'],
      issuer: 'https://infinitysearch.us.auth0.com/',
      audience: 'https://infinitysearch.xyz'
    }

    // token, JWTVerifyGetKey, JWTVerifyOptions
    const { payload, protectedHeader } = await jose.jwtVerify(
      jwt,
      JWKS,
      options
    )
    // https://github.com/panva/jose/blob/main/docs/interfaces/types.JWTVerifyResult.md
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message })
  }

  subscriber = payload['sub']
  console.log(subscriber)
  // lookup jobnimbus token using subscriber
  // make request to kolla for data
  // return the results
  var result = {
    subscriber: subscriber,
    headers: req.headers
  }

  // for now just return the subscriber
  res.status(200).json(result)
}
