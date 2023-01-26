const chat = require("./result.json");
const fs = require("fs");

const botId = "user5383706578";
const userId = "user1351161054";

function writeDownloadFile(links, tagName) {
  fs.writeFileSync(`./download_files/${tagName}.txt`, links.join("\n"));
}

function sumLengthsBeforeIndex(array, index) {
  let sum = 0;
  for (let i = 0; i < index; i++) {
    sum += array[i].length;
  }
  return sum;
}

function chunkArray(lengthArray, dataArray) {
  const chunks = [];
  let startIndex = 0;
  for (let i = 0; i < lengthArray.length; i++) {
    const chunk = dataArray.slice(
      startIndex,
      startIndex + lengthArray[i].length
    );
    chunks.push({
      tag: lengthArray[i].tag,
      data: chunk,
    });
    startIndex += lengthArray[i].length;
  }
  return chunks;
}

let result = {};

async function main() {
  const userMessages = chat.messages
    .filter((message) => message.from_id == userId)
    .map((message) => {
      const textEntity = message.text_entities[0];
      const isMetaData = textEntity.type == "plain";

      return { isMetaData, text: textEntity.text };
    });

  const tags = userMessages
    .map((message) => {
      if (message.isMetaData) {
        const metaData = JSON.parse(message.text);
        return metaData;
      }
      return undefined;
    })
    .filter((t) => !!t);

  const botMessages = chat.messages
    .filter((message) => message.from_id == botId)
    .map((message) => message.text[2].text);

  const data = chunkArray(tags, botMessages);
  for (const chapter of data) {
    if (chapter.data.length > 0) {
      writeDownloadFile(chapter.data, chapter.tag);
    }
  }

  // fs.writeFileSync(
  //   "physics-links.json",
  //   JSON.stringify(processUserMessages(userMessages), null, 2)
  // );
}

function processUserMessages(array) {
  const groups = {};
  let currentTag = "";
  for (let i = 0; i < array.length; i++) {
    const obj = array[i];
    if (obj.isMetaData) {
      const metadata = JSON.parse(obj.text);
      currentTag = metadata.tag;
      groups[currentTag] = [];
    } else {
      groups[currentTag].push(obj.text);
    }
  }
  return groups;
}
main();
