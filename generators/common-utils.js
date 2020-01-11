const path = require("path");

module.exports = {
  writeLibProjFiles(fs, dir, artifactName, separateHeaders) {
    const headerDir = separateHeaders ? "include" : "src";
    const headerPath = path.join(dir, headerDir, `${artifactName}.h`);
    const sourcePath = path.join(dir, "src", `${artifactName}.cpp`);

    const headerGuardName = `${artifactName.replace("-", "_").toUpperCase()}_H`;

    const headerContents = `#ifndef ${headerGuardName}
#define ${headerGuardName}

#endif`;

    const sourceContents = `#include "${artifactName}.h"`;

    fs.write(headerPath, headerContents);
    fs.write(sourcePath, sourceContents);
  },
  writeAppProjFiles(fs, dir) {
    const sourcePath = path.join(dir, "src/main.cpp");

    const sourceContents = `#include <iostream>

int main(int argc, char* argv[])
{
    std::cout << "Hello World" << std::endl;

    return 0;
}`;

    fs.write(sourcePath, sourceContents);
  }
};
