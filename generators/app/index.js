"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");

const { promisify } = require("util");
const mkdir = promisify(fs.mkdir);

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay("Please answer the following questions."));

    const infoPrompts = [
      {
        type: "input",
        name: "projectName",
        message: "Project Name:",
        default: this.determineAppname()
      },
      {
        type: "input",
        name: "projectDescription",
        message: "Project Description:"
      }
    ];

    const configPrompts = [
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
        message: "Will this project use submodules?",
        default: false
      },
      {
        type: "confirm",
        name: "separateHeaders",
        message:
          "Do you want to place the public headers in a separate directory?",
        default: false,
        when(answers) {
          return answers.projectType === "Library Project";
        }
      }
    ];

    this.log("Project Info");

    return this.prompt(infoPrompts)
      .then(props => {
        // To access props later use this.props.someAnswer;
        this.props = props;

        this.log("Project Config");

        return this.prompt(configPrompts);
      })
      .then(props => {
        this.props = { ...this.props, ...props };
      });
  }

  async writing() {
    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      {
        projectName: this.props.projectName,
        projectDescription: this.props.projectDescription
      }
    );

    const rootDir = this.props.usingSubmodules ? "libs/submodule" : "";

    if (this.props.projectType === "Library Project") {
      const fsPromises = [
        mkdir(path.join(rootDir, "src"), { recursive: true })
      ];

      if (this.props.separateHeaders) {
        fsPromises.push(
          mkdir(path.join(rootDir, "include"), { recursive: true })
        );
      }

      await Promise.all(fsPromises);
    } else {
      this.fs.copy(
        this.templatePath("main.cpp"),
        this.destinationPath(path.join(rootDir, "src/main.cpp"))
      );
    }
  }
};
