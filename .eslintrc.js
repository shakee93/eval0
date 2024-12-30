module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint'],
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    ignorePatterns: ['dist/', 'node_modules/', 'coverage/'],
}; 