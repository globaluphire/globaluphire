/* eslint-disable no-dupe-keys */
/**
 * import all cron required methods here
 */
const sampleCron = require("../cronController/sampleCron");
// const llmCron = require("../cronController/llmCron");
// const scrapeBlogLinks = require("../cronController/scrapeBlogLinksCron");
// const scrapeBlogData = require("../cronController/scrapeBlogDataCron");

/**
 * @description Register all methods which needs be run as cron here in format time <String> : method
 */
const CRONJOBS = {
    // Manage Time accordingly
    "5 * * * *": sampleCron.log,
    // "0 1 * * 0": llmCron.LLMCall,
    // "0 1 28-31 * *": scrapeBlogData.scrapeBlogData,
    // "0 1 * 1-12 *": scrapeBlogLinks.scrapeBlogLinks,
};

module.exports = CRONJOBS;
