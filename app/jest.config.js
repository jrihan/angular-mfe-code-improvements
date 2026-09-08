const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

const pathsMapped = compilerOptions?.paths
  ? pathsToModuleNameMapper(compilerOptions.paths)
  : {};
const esModules = [
  "@angular",
  "@ngrx",
  "d3",
  "@ngx-translate",
  "uuid",
  "@quickweb/mfe-context",
];

// https://github.com/thymikee/jest-preset-angular#brief-explanation-of-config
module.exports = {
  verbose: true,
  preset: "jest-preset-angular",
  globalSetup: "jest-preset-angular/global-setup",
  collectCoverage: true,
  testEnvironment: "@happy-dom/jest-environment",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/app/**/*.ts"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  coveragePathIgnorePatterns: [
    "setup-jest.ts",
    "public_api.ts",
    ".module.ts",
    ".interface.ts",
    ".utils.ts",
    ".enum.ts",
    ".type.ts",
    ".const.ts",
    ".stub.ts",
    ".mock.ts",
    "index.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  ...pathsMapped,
  uuid: require.resolve("uuid"),
  moduleNameMapper: {
    ...pathsMapped,
    "^@ids/web$": "<rootDir>/__mocks__/ids-web.js",
    "^@ids/web/(.*)$": "<rootDir>/__mocks__/ids-web.js",
    uuid: require.resolve("uuid"),
  },
  modulePaths: ["<rootDir>"],
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!.*\\.mjs$|${esModules.join("|")})`,
  ],
  testPathIgnorePatterns: [
    "<rootDir>/cypress/",

    "<rootDir>/cypress/",
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "<rootDir>/cypress",
  ],
};
