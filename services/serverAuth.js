import { withSSRContext } from "aws-amplify";

export const checkAuth = async ({ req, res }) => {
  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();
    return {
      props: {
        authenticated: true,
        username: user.username,
      },
    };
  } catch (err) {
    res.writeHead(302, { Location: "/profile" });
    res.end();
  }
  return { props: {} };
};
