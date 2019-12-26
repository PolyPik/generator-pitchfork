"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");
const path = require("path");

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
        choices: ["Library", "Application"],
        default: "Library"
      },
      {
        type: "input",
        name: "artifactName",
        message(answers) {
          if (answers.artifactType === "Library") {
            return "What's the name of the library artifact?";
          }

          return "What's the name of the executable artifact?";
        },
        default(answers) {
          if (answers.artifactType === "Library") {
            return "mylib";
          }

          return "myapp";
        }
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
      artifactName,
      separateHeaders
    } = this.props;

    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      { projectName, projectDescription }
    );

    if (artifactType === "Library") {
      const headerDir = separateHeaders ? "include" : "src";

      this.fs.copyTpl(
        this.templatePath("lib.h.ejs"),
        this.destinationPath(path.join(headerDir, `${artifactName}.h`)),
        { headerGuardName: `${artifactName.replace("-", "_").toUpperCase()}_H` }
      );

      this.fs.copyTpl(
        this.templatePath("lib.cpp.ejs"),
        this.destinationPath(`src/${artifactName}.cpp`),
        { headerName: `${artifactName}.h` }
      );
    } else {
      this.fs.copy(
        this.templatePath("main.cpp"),
        this.destinationPath("src/main.cpp")
      );
    }
  }
};
