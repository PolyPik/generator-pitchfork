"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

jest.mock("../../generators/submodule/index.js", () => {
  const helpers = require("yeoman-test");
  return helpers.createDummyGenerator();
});

describe("generator-pitchfork:app", () => {
  let runContext;
  const optionalDirs = [
    "tests",
    "examples",
    "external",
    "data",
    "tools",
    "docs"
  ];

  beforeEach(() => {
    runContext = helpers.run(path.join(__dirname, "../../generators/app"));
  });

  describe("Layout", () => {
    it("uses the prompt answers for the project name and description", async () => {
      await runContext.withPrompts({
        projectName: "Test Project",
        projectDescription: "Project Description."
      });

      assert.fileContent("README.md", "# Test Project\n\nProject Description.");
    });

    it("creates a library project with separated header placement", async () => {
      await runContext.withPrompts({
        artifactType: "Library",
        artifactName: "test",
        separateHeaders: true
      });

      assert.file("include/test.h");
      assert.noFile("src/test.h");
      assert.file("src/test.cpp");
    });

    it("creates an application project", async () => {
      await runContext.withPrompts({
        artifactType: "Application",
        artifactName: "test"
      });

      assert.noFile("include");
      assert.file("src/main.cpp");
    });

    it("creates a submodule project", async () => {
      await runContext.withPrompts({ usingSubmodules: true });
      assert.noFile("src");
    });

    it("creates the optional directories", async () => {
      await runContext.withPrompts({ optionalDirs });
      assert.file(optionalDirs);
    });
  });
});
