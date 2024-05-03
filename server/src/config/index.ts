import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  password_reset_secret: process.env.PASSWORD_RESET_SECRET,
  password_reset_expires_in: process.env.PASSWORD_RESET_EXPIRES_IN,
  client_base_url: process.env.CLIENT_BASE_URL,
  mailSender: {
    email: process.env.APP_EMAIL,
    pass: process.env.APP_PASS,
  },
  ssl: {
    storeId: process.env.STORE_ID,
    storePass: process.env.STORE_PASS,
    successUrl: process.env.SUCCESS_URL,
    cancelUrl: process.env.CANCEL_URL,
    failUrl: process.env.FAIL_URL,
    paymentApi: process.env.SSL_PAYMENT_API,
    validationApi: process.env.SSL_VALIDATION_API,
  },
};
