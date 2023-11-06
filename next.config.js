const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
};

module.exports = nextConfig;

module.exports = withSentryConfig(
    module.exports,
    { silent: true },
    { hideSourceMaps: true }
);
