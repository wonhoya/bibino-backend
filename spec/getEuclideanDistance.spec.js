const { expect } = require("chai");

const getEuclideanDistance = require("../utils/getEuclideanDistance");

describe("Euclidean Distance", function() {
  const base = [0,0,0];
  const pointA = [4.1, 7.5, 3.3];
  const pointB = [-4, -111, 73];
  it("should return the euclidean distance between two 3D points", function() {
    expect(getEuclideanDistance(...base, ...pointA)).to.eql(9.162423260251623);
    expect(getEuclideanDistance(...base, ...pointB)).to.eql(132.9135057095403);
  });
});
