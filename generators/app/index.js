"use strict";
const fs = require("fs");
const util = require("util");
const Generator = require("yeoman-generator");
const yosay = require("yosay");

const mkdir = util.promisify(fs.mkdir);

const { writeLibProjFiles, writeAppProjFiles } = require("../common-utils.js");

const licenses = [
  { name: "Apache 2.0", value: "Apache-2.0" },
  { name: "MIT", value: "MIT" },
  { name: "Mozilla Public License 2.0", value: "MPL-2.0" },
  { name: "BSD 2-Clause (FreeBSD) License", value: "BSD-2-Clause-FreeBSD" },
  { name: "BSD 3-Clause (NewBSD) License", value: "BSD-3-Clause" },
  { name: "Internet Systems Consortium (ISC) License", value: "ISC" },
  { name: "GNU AGPL 3.0", value: "AGPL-3.0" },
  { name: "GNU GPL 3.0", value: "GPL-3.0" },
  { name: "GNU LGPL 3.0", value: "LGPL-3.0" },
  { name: "Unlicense", value: "unlicense" },
  { name: "No License (Copyrighted)", value: "UNLICENSED" }
];

module.exports = class extends Generator {
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
        type: "confirm",
        name: "ownerWebsiteYN",
        message: "Would you like to provide the project owner's website URL?",
        default: false
      },
      {
        type: "input",
        name: "ownerWebsite",
        message: "What is the project owner's website URL?",
        when(answers) {
          return answers.ownerWebsiteYN;
        }
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
        choices: ["tests", "examples", "external", "data", "tools", "docs"],
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

        if (!props.ownerWebsiteYN) {
          this.props.ownerWebsite = "";
        }

        this.log("Project Config");

        return this.prompt(configPrompts);
      })
      .then(props => {
        this.props = { ...this.props, ...props };

        this.composeWith(require.resolve("generator-license"), {
          name: this.props.ownerName,
          email: this.props.ownerEmail,
          website: this.props.ownerWebsite,
          license: this.props.license
        });
      });
  }

  async writing() {
    const {
      projectName,
      projectDescription,
      artifactType,
      artifactName,
      separateHeaders,
      optionalDirs
    } = this.props;

    const optionalDirsPromise = Promise.all(
      optionalDirs.map(name => mkdir(name))
    );

    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      { projectName, projectDescription }
    );

    if (artifactType === "Library") {
      writeLibProjFiles(this.fs, "", artifactName, separateHeaders);
    } else {
      writeAppProjFiles(this.fs, "");
    }

    await optionalDirsPromise;
  }
};
