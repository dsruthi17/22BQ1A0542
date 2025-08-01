// logging-middleware/logger.js
const axios = require("axios");

async function logEvent(stack, level, pkg, message, token) {
  try {
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Log success:", response.data);
  } catch (err) {
    console.error("Log error:", err.response?.data || err.message);
  }
}

module.exports = { logEvent };
