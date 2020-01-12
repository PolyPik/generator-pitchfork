"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-pitchfork:app", () => {
  const optionalDirs = [
    "tests",
    "examples",
    "external",
    "data",
    "tools",
    "docs"
  ];

  describe("Defaults", () => {
    let dirName;

    beforeAll(async () => {
      await helpers
        .run(path.join(__dirname, "../../generators/app"))
        .inTmpDir(dir => {
          dirName = path.basename(dir);
        });
    });

    it("uses the directory name as the project name", async () => {
      assert.fileContent(
        "README.md",
        `# ${dirName}\n\nThis project was generated using the Yeoman Pitchfork generator`
      );
    });

    it("uses the MIT license as the default license", async () => {
      assert.fileContent("LICENSE", /.*MIT License.*/);
    });

    it("creates a library project with merged header placement", async () => {
      assert.file("src/mylib.h");
      assert.file("src/mylib.cpp");
    });

    it("doesn't create any of the optional directories", async () => {
      assert.noFile(optionalDirs);
    });

    it("adds a '.yo-rc.json' file to the project directory", async () => {
      assert.file(".yo-rc.json");
    });
  });
});
