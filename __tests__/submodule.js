"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-pitchfork:submodule", () => {
  let runContext;
  const optionalDirs = ["tests", "data", "examples", "docs"];

  beforeEach(() => {
    runContext = helpers
      .run(path.join(__dirname, "../generators/submodule"))
      .withPrompts({ subModuleName: "test" });
  });

  it("creates a submodule using default prompt answers", async () => {
    await runContext;

    assert.noFile("src");
    assert.file("libs/test/src/test.h");
    assert.file("libs/test/src/test.cpp");

    assert.noFile(optionalDirs);
  });

  it("creates a library submodule with header files in a separate directory", async () => {
    await runContext.withPrompts({ separateHeaders: true });

    assert.noFile("src");
    assert.file("libs/test/include/test.h");
    assert.noFile("libs/test/src/test.h");
    assert.file("libs/test/src/test.cpp");
  });

  it("creates an application submodule", async () => {
    await runContext.withPrompts({ artifactType: "Application" });

    assert.noFile("src");
    assert.file("libs/test/src/main.cpp");
  });

  it("creates the optional directories", async () => {
    await runContext.withPrompts({ optionalDirs });
    assert.file(optionalDirs.map(name => path.join("libs/test", name)));
  });

  it("creates an 'extra' submodule using prompts", async () => {
    await runContext.withPrompts({ subModuleType: "Extra" });

    assert.file("extras/test/src/test.h");
    assert.file("extras/test/src/test.cpp");
  });

  it("creates an 'extra' submodule using options", async () => {
    await runContext.withOptions({ extra: true });

    assert.file("extras/test/src/test.h");
    assert.file("extras/test/src/test.cpp");
  });
});
