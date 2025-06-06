/* eslint-disable prettier/prettier */
export default () => ({
  app: {  // <-- NAMESPACE!
    port: parseInt(process.env.PORT || '3001', 10),
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : [],
  }
});
