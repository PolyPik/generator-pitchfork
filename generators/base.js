"use strict";
const path = require("path");
const fs = require("fs");
const util = require("util");
const Generator = require("yeoman-generator");

const mkdir = util.promisify(fs.mkdir);

module.exports = class PitchforkGenerator extends Generator {
  async writing() {
    const {
      artifactType,
      artifactName,
      separateHeaders,
      optionalDirs,
      fileRoot
    } = this.props;

    const optionalDirsPromise = Promise.all(
      optionalDirs.map(name =>
        mkdir(path.join(fileRoot, name), { recursive: true })
      )
    );

    if (artifactType === "Library") {
      const headerDir = separateHeaders ? "include" : "src";
      const headerPath = path.join(fileRoot, headerDir, `${artifactName}.h`);
      const sourcePath = path.join(fileRoot, "src", `${artifactName}.cpp`);

      const headerGuardName = `${artifactName
        .replace("-", "_")
        .toUpperCase()}_H`;

      const headerContents = `#ifndef ${headerGuardName}
#define ${headerGuardName}

#endif`;

      const sourceContents = `#include "${artifactName}.h"`;

      this.fs.write(headerPath, headerContents);
      this.fs.write(sourcePath, sourceContents);
    } else {
      const sourcePath = path.join(fileRoot, "src/main.cpp");

      const sourceContents = `#include <iostream>

int main(int argc, char* argv[])
{
    std::cout << "Hello World" << std::endl;

    return 0;
}`;

      this.fs.write(sourcePath, sourceContents);
    }

    await optionalDirsPromise;
  }
};
