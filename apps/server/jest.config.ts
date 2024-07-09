/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  preset: "ts-jest",
  coverageProvider: "v8",
  resetModules: false,
  setupFiles: ["./test/jest-setup.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "./test/environment/mongodb.ts",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  roots: ["<rootDir>/src"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
};

export default config;
