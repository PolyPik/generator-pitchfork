"use strict";
const path = require("path");
const yosay = require("yosay");
const PitchforkGenerator = require("../base.js");

module.exports = class extends PitchforkGenerator {
  constructor(args, opts) {
    super(args, opts);

    this.option("extra", {
      type: Boolean,
      alias: "x",
      desc:
        "If specified, the submodule will placed in the 'extras' directory instead of the 'libs' directory"
    });
  }

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
        name: "subModuleType",
        message: "Is this a 'main' submodule or an 'extra' submodule?",
        choices: ["Main", "Extra"],
        default: "Main",
        when: this.options.extra === undefined
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
      const { subModuleType, subModuleName, ...otherProps } = props;

      this.props = otherProps;

      const subModuleDir =
        this.options.extra || subModuleType === "Extra" ? "extras" : "libs";

      this.props.fileRoot = path.join(subModuleDir, subModuleName);
      this.props.artifactName = subModuleName;
    });
  }

  async writing() {
    await super.writing();
  }
};
