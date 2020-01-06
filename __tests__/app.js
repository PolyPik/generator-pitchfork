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

  describe("License", () => {
    it("uses the MIT license as the default license", async () => {
      await runContext;

      assert.fileContent("LICENSE", /.*MIT License.*/);
    });

    it("uses the prompt answer for selecting a project license", async () => {
      await runContext.withPrompts({
        license: "Apache-2.0"
      });

      assert.fileContent("LICENSE", /.*Apache License, Version 2\.0.*/);
    });

    it("only adds the owner's name to the license file", async () => {
      await runContext.withPrompts({
        ownerName: "John Doe",
        ownerEmailYN: false,
        ownerWebsiteYN: false
      });

      assert.fileContent("LICENSE", /.*John Doe\n.*/);
    });

    it("adds the owner's name and email address to the license file", async () => {
      await runContext.withPrompts({
        ownerName: "John Doe",
        ownerEmailYN: true,
        ownerEmail: "jdoe@example.com",
        ownerWebsiteYN: false
      });

      assert.fileContent("LICENSE", /.*John Doe <jdoe@example\.com>.*/);
    });

    it("adds the owner's name and website URL to the license file", async () => {
      await runContext.withPrompts({
        ownerName: "John Doe",
        ownerEmailYN: false,
        ownerWebsiteYN: true,
        ownerWebsite: "somewebsite.com"
      });

      assert.fileContent("LICENSE", /.*John Doe \(somewebsite\.com\).*/);
    });

    it("adds the owner's name, email address and website URL to the license file", async () => {
      await runContext.withPrompts({
        ownerName: "John Doe",
        ownerEmailYN: true,
        ownerEmail: "jdoe@example.com",
        ownerWebsiteYN: true,
        ownerWebsite: "somewebsite.com"
      });

      assert.fileContent(
        "LICENSE",
        /.*John Doe <jdoe@example\.com> \(somewebsite\.com\).*/
      );
    });
  });

  describe("Library Project", () => {
    it("creates a library project with merged header placement", async () => {
      await runContext.withPrompts({
        artifactType: "Library",
        artifactName: "test",
        separateHeaders: false
      });

      assert.noFile("include/test.h");
      assert.file("src/test.h");
      assert.file("src/test.cpp");
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
  });

  describe("Application Project", () => {
    it("creates an application project", async () => {
      await runContext.withPrompts({
        artifactType: "Application",
        artifactName: "test"
      });

      assert.noFile("include");
      assert.file("src/main.cpp");
    });
  });

  describe("Optional Directories", () => {
    const optionalDirs = [
      "tests",
      "examples",
      "external",
      "data",
      "tools",
      "docs"
    ];

    it("doesn't create any the optional directories by default", async () => {
      await runContext;

      assert.noFile(optionalDirs);
    });

    it("creates the optional directories", async () => {
      await runContext.withPrompts({ optionalDirs });

      assert.file(optionalDirs);
    });
  });
});
