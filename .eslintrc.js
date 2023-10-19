module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ["standard", "prettier"],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "object-curly-spacing": ["error", "always"],
    },
    settings: {
        react: {
            version: "latest",
        },
    },
};
