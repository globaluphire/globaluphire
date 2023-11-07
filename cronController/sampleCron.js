const cron = require("node-cron");

// Creating a cron job which runs on every 10 second
cron.schedule("*/5 * * * * ", function () {
    console.log("running a task every 5 second");
});
