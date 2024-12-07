const cron = require("cron");
const https = require("https");
const User = require("../models/user");

const backendUrl = "https://hotel-api-16lp.onrender.com/";

// Cron Job 1: Ping the server every 14 minutes to keep it active
const keepAliveJob = new cron.CronJob("*/14 * * * *", function () {
  console.log(`[Cron Job] Attempting to keep server active on ${backendUrl}`);

  // Perform an HTTPS GET request to keep the backend server active
  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("[Cron Job] Server is active, received status 200.");
      } else {
        console.error(
          `[Cron Job] Failed to restart server with status code: ${res.statusCode}`
        );
      }
    })
    .on("error", (err) => {
      console.error(
        "[Cron Job] Error during server keep-alive request:",
        err.message
      );
    });
});

// Cron Job 2: Delete expired users every hour
const deleteExpiredUsersJob = new cron.CronJob("0 * * * *", async () => {
  try {
    const now = Date.now();
    const result = await User.deleteMany({
      verificationTokenExpiresAt: { $lt: now },
      verified: false, // Only delete if they haven't verified their account
    });

    console.log(`[Cron Job] ${result.deletedCount} expired users removed.`);
  } catch (error) {
    console.error("[Cron Job] Error deleting expired users:", error);
  }
});

// Start both cron jobs
keepAliveJob.start();
deleteExpiredUsersJob.start();

module.exports = {
  keepAliveJob,
  deleteExpiredUsersJob,
};
