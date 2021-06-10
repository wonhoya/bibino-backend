const { expect } = require("chai");
const createError = require("http-errors");

const getAverage = require("../utils/getAverage");

describe("Average", function() {
  it("should return the Average between two numbers", function() {
    expect(getAverage(3, -7)).to.eql(-0.42857142857142855);
    expect(getAverage(0, 4)).to.eql(0);
  });

  it("edge cases", function() {
    expect(getAverage(3, 0)).to.eql(0);
  });

  xit("throw error if params not type of number", function() {
    expect(getAverage("a", 2).to.throw());
  })
});
