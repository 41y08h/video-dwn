const axios = require("axios");
const { URL } = require("url");
const config = require("./config.json");
const { spawn } = require("promisify-child-process");

const contentTypes = ["videos", "DppVideos"];

async function getVideoURLForContentType(tag, contentType) {
  const res = await axios.get(
    "https://api.penpencil.co/v2/batches/class-12th--lakshya-neet-443931/subject/chemistry-326756/contents",
    {
      params: {
        page: 1,
        contentType: contentType,
        tag: tag,
      },
      headers: {
        authorization:
          `Bearer ${process.env.TOKEN}`,
        "client-id": "5eb393ee95fab7468a79d189",
        "client-type": "WEB",
        "client-version": "1728",
        randomid: "1e7a85b8-00b0-4e56-89e8-32ed99fb6602",
      },
    }
  );

  return res.data.data.map((video) => video.url);
}

const formatURL = (link) => {
  const url = new URL(link);
  url.hostname = "d1d34p8vz63oiq.cloudfront.net";

  return url.href;
};

async function getVideoURLsForTag(tag) {
  let URLs = [];
  for (const contentType of contentTypes) {
    const urls = await getVideoURLForContentType(tag, contentType);
    URLs = URLs.concat(urls);
  }

  URLs = URLs.map(formatURL);
  return URLs;
}

async function main() {
  const tags = config.tags;

  for (const tag of tags) {
    const tagVideoURLs = await getVideoURLsForTag(tag);

    await spawn("python", [
      "./messenger.py",
      JSON.stringify({ length: tagVideoURLs.length, tag }),
      ...tagVideoURLs,
    ]);
  }
}

main();
