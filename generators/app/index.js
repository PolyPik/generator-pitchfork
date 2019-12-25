"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");
const fs = require("fs");

const { promisify } = require("util");
const mkdir = promisify(fs.mkdir);

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay("Please answer the following questions."));

    const prompts = [
      {
        type: "list",
        name: "projectType",
        message: "What type of project do you wish to create?",
        choices: ["Library Project", "Application Project"],
        default: "Library Project"
      },
      {
        type: "confirm",
        name: "usingSubmodules",
        message: "Will this project be using submodules?",
        default: false
      },
      {
        type: "confirm",
        name: "separateHeaders",
        message:
          "Do you want to place the public headers in a separate directory?",
        default: false
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    if (this.props.projectType === "Library Project") {
      if (this.props.usingSubmodules || this.props.separateHeaders) {
        mkdir("include");
      }

      if (this.props.usingSubmodules) {
        mkdir("libs");
      } else {
        mkdir("src");
      }
    } else {
      let destPath;

      if (this.props.usingSubmodules) {
        destPath = this.destinationPath("libs/main/src/main.cpp");
      } else {
        destPath = this.destinationPath("src/main.cpp");
      }

      this.fs.copy(this.templatePath("main.cpp"), destPath);
    }
  }

  install() {
    this.installDependencies();
  }
};
