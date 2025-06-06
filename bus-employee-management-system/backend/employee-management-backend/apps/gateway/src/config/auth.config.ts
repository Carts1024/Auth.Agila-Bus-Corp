/* eslint-disable prettier/prettier */
export default () => ({
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    authServiceUrl: process.env.AUTH_SERVICE_URL,
  }
});
