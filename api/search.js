import * as jose from 'jose';

// setup auth0 remote keyset
const JWKS = jose.createRemoteJWKSet(
  new URL('https://infinitysearch.us.auth0.com/.well-known/jwks.json')
);

// https://github.com/panva/jose/blob/main/docs/interfaces/jwt_verify.JWTVerifyOptions.md
const JWTOptions = {
  algorithms: ['RS256'],
  issuer: 'https://infinitysearch.us.auth0.com/',
  audience: 'https://infinitysearch.xyz',
};

// this function will be launched when the API is called.
module.exports = async (req, res) => {
  let subscriber;

  try {
    subscriber = await validateRequest(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
  // TODO: lookup jobnimbus token using subscriber
  // TODO: make request to kolla for data
  // TODO: return the results

  sampleResult['subscriber'] = subscriber;
  // for now just return the subscriber
  res.status(200).json(sampleResult);
};

// handler to validate the JWT authentication token
async function validateRequest(req) {
  const authHeader = req.headers['authorization'];
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw 'invalid authentication header';
  }

  const jwt = parts[1];

  // token, JWTVerifyGetKey, JWTVerifyOptions
  const { payload, protectedHeader } = await jose.jwtVerify(
    jwt,
    JWKS,
    JWTOptions
  );
  // https://github.com/panva/jose/blob/main/docs/interfaces/types.JWTVerifyResult.md

  const subscriber = payload['sub'];

  return subscriber;
}

const sampleResult = {
  jobnimbus: {
    meta: {
      logo: 'https://3401zs241c1u3z7ulj3z6g7u-wpengine.netdna-ssl.com/wp-content/uploads/2020/10/cropped-5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x-32x32.png',
      display_name: 'JobNimbus',
    },
    results: [
      {
        title: 'Contact - Clint Berry',
        description: 'Clint Berry is a contact in JobNimbus',
        link: 'https://app.jobnimbus.com/contact/kwqtnapghyhm2cmsdvu5l51',
        kvdata: {
          Phone: '8015551234',
        },
      },
      {
        title: 'Task - Lead Aging Warning',
        description: 'Lead aging warning for Clinton Sanzota',
        link: 'https://app.jobnimbus.com/task/kyqf1n6vc8su2wuukyfk0jy',
        kvdata: {
          Priority: 'HIGH',
        },
      },
    ],
  },
};
