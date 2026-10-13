module.exports = function (api) {
    api.cache(true);

    return {
        presets: ["babel-preset-expo", "nativewind/babel"],
        plugins: [
            [
                "@tamagui/babel-plugin",
                {
                    components: ["tamagui", "@fundacja-peryskop/ui"],
                    config: "./node_modules/@fundacja-peryskop/ui/dist/cjs/config/tamagui.config.js",
                },
            ],
        ],
    };
};
