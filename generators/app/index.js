"use strict";
const yosay = require("yosay");
const PitchforkGenerator = require("../base.js");

const generatorSubmodule = require("../submodule/index.js");
const { licenses } = require("generator-license");

module.exports = class extends PitchforkGenerator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay("Please answer the following questions."));

    const infoPrompts = [
      {
        type: "input",
        name: "projectName",
        message: "What is the name of this project?",
        default: this.determineAppname()
      },
      {
        type: "input",
        name: "projectDescription",
        message: "Please give a brief project description:",
        default:
          "This project was generated using the Yeoman Pitchfork generator."
      },
      {
        type: "list",
        name: "license",
        message: "Which license do you want to use?",
        choices: licenses,
        default: "MIT"
      },
      {
        type: "input",
        name: "ownerName",
        message: "Who is the project owner?",
        default: this.user.git.name()
      },
      {
        type: "confirm",
        name: "ownerEmailYN",
        message: "Would you like to provide the project owner's email address?",
        default: false
      },
      {
        type: "input",
        name: "ownerEmail",
        message: "What is the project owner's email address?",
        default: this.user.git.email(),
        when(answers) {
          return answers.ownerEmailYN;
        }
      },
      {
        type: "input",
        name: "ownerWebsite",
        message: "What is the URL of the project owner's website?",
        filter(val) {
          return val ? val : "";
        }
      }
    ];

    const configPrompts = [
      {
        type: "confirm",
        name: "usingSubmodules",
        message: "Will this project be organized using submodules?",
        default: false
      },
      {
        type: "list",
        name: "artifactType",
        message: "What type of artifact will this project produce?",
        choices: ["Library", "Application"],
        default: "Library",
        when(answers) {
          return !answers.usingSubmodules;
        }
      },
      {
        type: "input",
        name: "artifactName",
        message(answers) {
          const artifactTypeStr =
            answers.artifactType === "Library" ? "library" : "executable";

          return `What's the name of the ${artifactTypeStr} artifact?`;
        },
        default(answers) {
          return answers.artifactType === "Library" ? "mylib" : "myapp";
        },
        when(answers) {
          return !answers.usingSubmodules;
        }
      },
      {
        type: "confirm",
        name: "separateHeaders",
        message:
          "Do you wish to place the public headers in a separate directory?",
        default: false,
        when(answers) {
          return !answers.usingSubmodules && answers.artifactType === "Library";
        }
      },
      {
        type: "checkbox",
        name: "optionalDirs",
        message: "Which of these optional directories do you want to include?",
        choices(answers) {
          const choices = [
            "tests",
            "examples",
            "external",
            "data",
            "tools",
            "docs"
          ];

          if (answers.usingSubmodules) {
            choices.push("extras");
          }

          return choices;
        },
        default: []
      }
    ];

    this.log("Project Info");

    return this.prompt(infoPrompts)
      .then(props => {
        this.props = props;

        if (!props.ownerEmailYN) {
          this.props.ownerEmail = "";
        }

        this.log("Project Config");

        return this.prompt(configPrompts);
      })
      .then(props => {
        this.props = { ...this.props, ...props, fileRoot: "" };

        if (props.usingSubmodules) {
          this.composeWith(
            {
              Generator: generatorSubmodule,
              path: require.resolve("../submodule")
            },
            { extra: false }
          );
          this.props.artifactType = null;
        }

        this.composeWith(require.resolve("generator-license"), {
          name: this.props.ownerName,
          email: this.props.ownerEmail,
          website: this.props.ownerWebsite,
          license: this.props.license
        });
      });
  }

  configuring() {
    this.config.save();
  }

  async writing() {
    const { projectName, projectDescription } = this.props;

    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      { projectName, projectDescription }
    );

    await super.writing();
  }
};
