const serviceAccount = {
  type: "service_account",
  project_id: "chatbot-437523",
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: "calendarapi-75@chatbot-437523.iam.gserviceaccount.com",
  client_id: "108922814601814519342",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/calendarapi-75%40chatbot-437523.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

module.exports = { serviceAccount };
