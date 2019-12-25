"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-pitchfork:app", () => {
  let runContext;

  beforeEach(() => {
    runContext = helpers.run(path.join(__dirname, "../generators/app"));
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
    });

    it("creates an application project with submodules", async () => {
      await runContext.withPrompts({
        projectType: "Application Project",
        usingSubmodules: true
      });

      assert.file("libs/main/src/main.cpp");
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
