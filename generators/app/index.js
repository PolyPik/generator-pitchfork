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
        name: "artifactType",
        message: "What type of artifact will this project produce?",
        choices: ["Library", "Executable"],
        default: "Library"
      },
      {
        type: "confirm",
        name: "separateHeaders",
        message:
          "Do you want to place the public headers in a separate directory?",
        default: false,
        when(answers) {
          return answers.artifactType === "Library";
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
    const {
      projectName,
      projectDescription,
      artifactType,
      separateHeaders
    } = this.props;

    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      { projectName, projectDescription }
    );

    if (artifactType === "Library") {
      const fsPromises = [mkdir("src")];

      if (separateHeaders) {
        fsPromises.push(mkdir("include"));
      }

      await Promise.all(fsPromises);
    } else {
      this.fs.copy(
        this.templatePath("main.cpp"),
        this.destinationPath("src/main.cpp")
      );
    }
  }
};
