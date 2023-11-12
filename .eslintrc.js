module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        mocha: true,
    },
    globals: {
        browser: true,
        driver: true,
        $: true,
        $$: true,
    },
    extends: [
        'airbnb-base',
        'plugin:import/recommended',
        'plugin:playwright/recommended',
    ],
    plugins: [
        'import',
    ],
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: [],
        'import/prefer-default-export': [
            'off',
            { target: 'any' },
        ],
        'max-len': ['error', {
            code: 120,
            ignoreComments: true,
            ignoreTrailingComments: true,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreRegExpLiterals: true,
        }],
    },
};
