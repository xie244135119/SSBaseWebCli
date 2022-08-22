module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-empty": [2, "always"],
    "scope-empty": [2, "always"],
    "subject-empty": [2, "always"],
    "header-max-length": [2, "always", 100],
    "body-empty": [2, "always"],
    "footer-empty": [2, "always"],
    "action-enum": [
      2,
      "always",
      ["Fixed", "Closed", "Feature", "Refactor", "Resource", "Add", "Create", "Modify", "Update", "Delete"]
    ]
  },
  plugins: []
};
