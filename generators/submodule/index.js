"use strict";
const fs = require("fs");
const path = require("path");
const util = require("util");
const Generator = require("yeoman-generator");
const yosay = require("yosay");

const mkdir = util.promisify(fs.mkdir);

const { writeLibProjFiles, writeAppProjFiles } = require("../common-utils.js");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Let's add a new submodule`));

    const prompts = [
      {
        type: "input",
        name: "subModuleName",
        message: "What is the name of this submodule?"
      },
      {
        type: "list",
        name: "artifactType",
        message: "What type of artifact will this submodule produce?",
        choices: ["Library", "Application"],
        default: "Library"
      },
      {
        type: "confirm",
        name: "separateHeaders",
        message:
          "Do you wish to place the public headers in a separate directory?",
        default: false,
        when(answers) {
          return answers.artifactType === "Library";
        }
      },
      {
        type: "checkbox",
        name: "optionalDirs",
        message: "Which of these optional directories do you want to include?",
        choices: ["tests", "data", "examples", "docs"],
        default: []
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  async writing() {
    const {
      subModuleName,
      artifactType,
      separateHeaders,
      optionalDirs
    } = this.props;

    const optionalDirsPromise = Promise.all(
      optionalDirs.map(name => mkdir(name))
    );

    const subModuleRoot = path.join("libs", subModuleName);

    if (artifactType === "Library") {
      writeLibProjFiles(this.fs, subModuleRoot, subModuleName, separateHeaders);
    } else {
      writeAppProjFiles(this.fs, subModuleRoot);
    }

    await optionalDirsPromise;
  }

  install() {
    this.installDependencies();
  }
};
