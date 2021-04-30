const { expect } = require("chai");

const sortBeersByEuclideanDistance = require("../utils/sortBeersByEuclideanDistance");

describe("Sort Beers By Euclidean Distance", function() {
  const target = {
    averageBody: 4.2,
    averageAroma: 2.8,
    averageSparkling: 8.5
  };
  const beers = [{
    averageBody: 2.6,
    averageAroma: 9.1,
    averageSparkling: 7.1
  },{
    averageBody: 1.4,
    averageAroma: 6.5,
    averageSparkling: 4.1
  },{
    averageBody: 8.7,
    averageAroma: 3.3,
    averageSparkling: 6.3
  },{
    averageBody: 6.2,
    averageAroma: 1.2,
    averageSparkling: 4.9
  },{
    averageBody: 3.6,
    averageAroma: 7.3,
    averageSparkling: 2.7
  }];

  it("should sort beers by euclidean distance", function() {
    expect(sortBeersByEuclideanDistance(target, beers)).to.eql([
      {
        averageBody: 6.2,
        averageAroma: 1.2,
        averageSparkling: 4.9,
        distance: 4.418144406874904
      },
      {
        averageBody: 8.7,
        averageAroma: 3.3,
        averageSparkling: 6.3,
        distance: 5.033885179461287
      },
      {
        averageBody: 1.4,
        averageAroma: 6.5,
        averageSparkling: 4.1,
        distance: 6.394528911499267
      },
      {
        averageBody: 2.6,
        averageAroma: 9.1,
        averageSparkling: 7.1,
        distance: 6.649060083951716
      },
      {
        averageBody: 3.6,
        averageAroma: 7.3,
        averageSparkling: 2.7,
        distance: 7.365459931328117
      }
    ]);
  });
});
