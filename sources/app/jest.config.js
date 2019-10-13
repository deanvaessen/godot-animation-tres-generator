//https://huafu.github.io/ts-jest/user/config/diagnostics#enabling-diagnostics-for-test-files-only
module.exports = {
    globals : {
        "ts-jest" : {
            diagnostics : {
                warnOnly : true
            }
        }
    },
    preset : "ts-jest",
    testEnvironment : "node",
    roots : [
        "<rootDir>/src"
    ],
    transform : {
        "^.+\\.tsx?$" : "ts-jest"
    },
    silent : false
};