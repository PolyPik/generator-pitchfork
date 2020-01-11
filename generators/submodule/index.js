"use strict";
const path = require("path");
const yosay = require("yosay");
const PitchforkGenerator = require("../base.js");

module.exports = class extends PitchforkGenerator {
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
      this.props.fileRoot = path.join("libs", this.props.subModuleName);
      this.props.artifactName = this.props.subModuleName;
    });
  }

  async writing() {
    await super.writing();
  }

  install() {
    this.installDependencies();
  }
};
