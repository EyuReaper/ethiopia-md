// .prettierrc.cjs
/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

module.exports = {
    plugins: [require.resolve('prettier-plugin-astro')],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
    singleQuote: true,
    semi: true,
    tabWidth: 2,
};
