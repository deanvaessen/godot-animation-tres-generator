module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/recommended"
        //'plugin:prettier/recommended',
    ],
    plugins: ["@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module"
    },
    rules: {
        //"prettier/prettier": "error",
        //"jest/no-focused-tests": 2,
        //"jest/no-identical-title": 2,
        indent: "off", // conflicts with ts indent
        "@typescript-eslint/indent" : ["error", 4],
        quotes: ["error", "double"],
        "newline-before-return": "error",
        semi: ["error", "always"],
        "brace-style": [
            "error",
            "1tbs",
            {
                allowSingleLine: true
            }
        ],
        "no-console": ["off"],
        "no-unused-vars": ["warn"],
        "space-in-parens": [
            "error",
            "always",
            {
                exceptions: []
            }
        ],
        "@typescript-eslint/no-explicit-any": [1],
        "array-bracket-spacing": ["error", "always"],
        "@typescript-eslint/type-annotation-spacing": [ "error", {
            "before": true,
            "after": true
        } ],
        // Does not play nice with dependency injection framework
        "@typescript-eslint/explicit-member-accessibility" : [ "error", { overrides: { constructors: 'off' } } ],
        "@typescript-eslint/interface-name-prefix" : [ "error", "always" ],
        "@typescript-eslint/no-empty-interface" : "off",
        "object-curly-spacing": [
            "error",
            "always",
            {
                arraysInObjects: true,
                objectsInObjects: true
            }
        ],
        "max-len": [
            "error",
            {
                code: 150
            }
        ],
        "no-tabs": ["error"],
        "key-spacing": [
            "error",
            {
                beforeColon: true
            }
        ],
        "no-param-reassign": "off",
        "function-paren-newline": "off",
        "import/no-extraneous-dependencies": 0,
        "import/prefer-default-export": 0
    }
};
