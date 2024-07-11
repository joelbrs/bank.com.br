module.exports = {
  src: "./src",
  artifactDirectory: "./__generated__",
  language: "typescript",
  schema: "./data/schema.graphql",
  excludes: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
};
