"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-pitchfork:app", () => {
  let runContext;

  beforeEach(() => {
    runContext = helpers.run(path.join(__dirname, "../generators/app"));
  });

  describe("Project Name", () => {
    it("uses the directory name as the project name", async () => {
      let dirName;
      await runContext.inTmpDir(dir => {
        dirName = path.basename(dir);
      });

      assert.fileContent("README.md", `# ${dirName}`);
    });

    it("uses the prompt answer as the project name", async () => {
      await runContext.withPrompts({
        projectName: "Test Project"
      });

      assert.fileContent("README.md", "# Test Project");
    });
  });

  describe("Project Description", () => {
    it("uses the prompt answer as the project description", async () => {
      await runContext.withPrompts({
        projectName: "Test Project",
        projectDescription: "Project Description."
      });

      assert.fileContent("README.md", "# Test Project\n\nProject Description.");
    });
  });

  describe("Submodules", () => {
    it("creates a library project without submodules", async () => {
      await runContext.withPrompts({
        projectType: "Library Project",
        usingSubmodules: false
      });

      assert.file("src");
    });

    it("creates a library project with submodules", async () => {
      await runContext.withPrompts({
        projectType: "Library Project",
        usingSubmodules: true
      });

      assert.file(["libs", "include"]);
    });

    it("creates an application project without submodules", async () => {
      await runContext.withPrompts({
        projectType: "Application Project",
        usingSubmodules: false
      });

      assert.file("src/main.cpp");
      assert.noFile("include");
    });

    it("creates an application project with submodules", async () => {
      await runContext.withPrompts({
        projectType: "Application Project",
        usingSubmodules: true
      });

      assert.file("libs/main/src/main.cpp");
      assert.noFile("include");
    });
  });

  describe("Library Header Placement", () => {
    it("creates a library project with merged header placement", async () => {
      await runContext.withPrompts({ separateHeaders: false });

      assert.noFile("include");
    });

    it("creates a library project with separated header placement", async () => {
      await runContext.withPrompts({ separateHeaders: true });

      assert.file("include");
    });
  });
});
