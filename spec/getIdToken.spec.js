const { expect } = require("chai");

const getIdToken = require("../utils/getIdToken");

describe("Euclidean Distance", function() {
  it("should return the token except Bearer", function() {
    const authorization = "Bearer abcdefghijklmn"
    expect(getIdToken(authorization)).to.eql("abcdefghijklmn");
  });
});
