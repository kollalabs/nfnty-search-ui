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
    jwt = req.headers['authentication']
    jwt = jwt.replace('Bearer ', '')

    // https://github.com/panva/jose/blob/main/docs/interfaces/jwt_verify.JWTVerifyOptions.md
    options = {
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
  } catch (error) {
    return res.status(400).json({ error: 'My custom 400 error' })
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
