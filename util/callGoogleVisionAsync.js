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

  const parsed = await response.json();
  console.log("Result:", parsed);

  return parsed.responses[0].textAnnotations[0].description;
}

module.exports = callGoogleVisionAsync;
