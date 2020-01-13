module.exports = {
  noBlankName(val) {
    if (val === "") {
      return "The name cannot be blank.";
    }

    return true;
  }
};
