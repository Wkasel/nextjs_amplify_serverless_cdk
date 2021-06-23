import Amplify, { withSSRContext } from "aws-amplify";
import config from "../../aws-exports.js";

// Amplify SSR configuration needs to be enabled within each API route
Amplify.configure({ ...config, ssr: true });

/*
  ****** signInUserSession contains JWT:
  {
  "sub": "34c3570a-c8af-4ce7-96f4-b055408d17ee",
  "email_verified": true,
  "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_9ZCvC6IYS",
  "cognito:username": "wk",
  "origin_jti": "fa15b543-19b7-4681-8aa5-1aec2228cfd8",
  "aud": "3stgtfnpkrgdit0nnncgtmv3a4",
  "event_id": "c2a69065-5116-4582-97ff-6add2b9918ab",
  "token_use": "id",
  "auth_time": 1624432406,
  "exp": 1624436006,
  "iat": 1624432406,
  "jti": "191d6bce-ab95-441a-96b0-0f86f3f6b9e7",
  "email": "williamkasel@me.com"
}
*/

export default async (req, res) => {
  const { Auth } = withSSRContext({ req });
  try {
    const {
      username,
      attributes: { email, email_verified },
      signInUserSession,
    } = await Auth.currentAuthenticatedUser();
    res.json({ user: { username, email, email_verified, signInUserSession } });
  } catch (err) {
    res.statusCode = 200;
    res.json({ user: null });
  }
};
