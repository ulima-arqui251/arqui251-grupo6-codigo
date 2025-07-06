const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
    output: {
        path: join(__dirname, '../../dist/apps/huggingface-service'),
    },
    plugins: [
        new NxAppWebpackPlugin({
            target: 'node',
            compiler: 'tsc',
            main: './src/main.ts',
            tsConfig: './tsconfig.app.json',
            assets: [
                {
                    input: './src/assets',
                    glob: '**/*',
                    ignore: [],
                    output: 'assets',
                },
            ],
            optimization: false,
            outputHashing: 'none',
            generatePackageJson: true,
        }),
    ],
};