"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-pitchfork:app", () => {
  let runContext;

  beforeEach(() => {
    runContext = helpers.run(path.join(__dirname, "../../generators/app"));
  });

  describe("License", () => {
    it("uses the prompt answer for selecting a project license", async () => {
      await runContext.withPrompts({ license: "Apache-2.0" });

      assert.fileContent("LICENSE", /.*Apache License, Version 2\.0.*/);
    });

    it.each`
      email    | website  | info
      ${false} | ${false} | ${"name"}
      ${true}  | ${false} | ${"name and email address"}
      ${false} | ${true}  | ${"name and website URL"}
      ${true}  | ${true}  | ${"name, email address and website URL"}
    `(
      "adds the owner's $info to the license file ",
      async ({ email, website }) => {
        const promptAnswers = {
          ownerName: "John Doe"
        };

        let expectStr = "John Doe";

        if (email) {
          promptAnswers.ownerEmail = "jdoe@example.com";
          expectStr += ` <${promptAnswers.ownerEmail}>`;
        }

        if (website) {
          promptAnswers.ownerWebsite = "somewebsite.com";
          expectStr += ` (${promptAnswers.ownerWebsite})`;
        }

        await runContext.withPrompts(promptAnswers);

        assert.fileContent("LICENSE", expectStr);
      }
    );
  });
});
