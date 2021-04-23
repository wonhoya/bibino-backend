const fetch = require("node-fetch");
const { googleVisionApiUrl } = require("../config");

async function callGoogleVisionAsync(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [{ type: "TEXT_DETECTION", maxResults: 8 }],
      },
    ],
  };

  const response = await fetch(googleVisionApiUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log("google respones");

  const parsed = await response.json();

  if (Object.entries(parsed.responses[0]).length === 0) {
    console.log("empty!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    return [];
  }

  console.log("parsed", parsed);
  // console.log("Result:", parsed);
  // console.log("Result: responses", parsed.responses);
  // console.log("Result: responses", parsed.responses);
  // console.log("Result: textAnno", parsed.responses[0].textAnnotations);
  // console.log("Result: fullTextAnno", parsed.responses[0].fullTextAnnotation);

  return parsed.responses[0].textAnnotations[0].description;
}

module.exports = callGoogleVisionAsync;
