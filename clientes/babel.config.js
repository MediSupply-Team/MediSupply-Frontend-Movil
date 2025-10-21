module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@/types": "./types",
            "@/hooks": "./hooks",
            "@/services": "./services",
            "@/config": "./config",
            "@/components": "./components",
            "@/constants": "./constants"
          },
        },
      ],
    ],
  };
};