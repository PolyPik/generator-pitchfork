"use strict";
const { noBlankName } = require("../generators/validation-helpers.js");

describe("validation-helpers", () => {
  it("returns an error message if name is blank", () => {
    expect(noBlankName("")).toBe("The name cannot be blank.");
  });

  it("returns true if name is not blank", () => {
    expect(noBlankName("Test")).toBe(true);
  });
});
