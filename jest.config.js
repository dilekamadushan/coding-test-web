const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customConfig);
