import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

import Tesseract from 'tesseract.js';
import Jimp from 'jimp';



const checkDate = () => {
  let operation = `checkDate`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {

    let currentDate = new Date();

    let endDate = new Date("January 06 2018 00:00");

    console.log(`\x1b[45m${currentDate}\x1b[0m`);
    console.log(`\x1b[45m${endDate}\x1b[0m`);

    console.log(`\x1b[45m${currentDate > endDate}\x1b[0m`);
      if(currentDate > endDate) {
        reject(new Error(`Contest submissions have ended.`));
      } else {
        resolve();
      }
  });
};

const fetchAttachment = (attachmentInfo) => {
  let operation = `fetchAttachment`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  let URI = attachmentInfo.url;
  return new Promise((resolve, reject) => {
    fetch(URI, { method: 'GET' })
    .then((result) => {
      if(result.ok && result.status === 200){
        resolve(result);
      } else if (result.status === 404){
        reject(new Error(`Could not locate ${URI}`));
      } else {
        reject(new Error(`Error downloading from ${URI}`));
      }
    })
    .catch(reject);
  });
};

const findOrCreateDirectory = (message) => {
  let operation = `findOrCreateDirectory`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let processRoot = process.cwd();  //  Get the server root folder from the process
    let destDir = path.resolve(processRoot, 'images', message.author.username);
    //  Test if directory for user exists...
    fs.access(destDir, fs.constants.R_OK | fs.constants.W_OK, (error) => {
      if(error) { //  If error...
        if(error.code === 'ENOENT') { //  Directory doesn't exist
          fs.mkdir(destDir, (error) => {
            if (error) {
              console.log(`\x1b[42m`, error, `\x1b[0m`);
              reject(new Error('Unable to create user directory.'));
            } else {
              resolve(destDir);
            }
          });
        } else {
          console.log(`\x1b[42m`, error, `\x1b[0m`);
          reject(new Error('Unable to locate or create user directory.'));
        }
      } else {  //  No error, directory exists and is writable
        resolve(destDir);
      }
    });
  });
}


const saveAttachmentToDirectory = ([attachment, directory]) => {
  let operation = `saveAttachmentToDirectory`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let filename = attachment.url.substring(attachment.url.lastIndexOf('/')+1);
    const mimeType = attachment.url.substring(attachment.url.lastIndexOf('.')+1);
      if(!['jpg', 'jpeg', 'png'].includes(mimeType.toLowerCase())){
        reject(new Error('Images must be .png or .jpg.'));
      } else {
        filename = filename.replace(mimeType, "") + Date.now() + '.' + mimeType;
        const streamWrite = fs.createWriteStream(path.resolve(directory, filename));
        streamWrite.on('error', (error) => {  //  Clean up any streams that error
          streamWrite.destroy();
          reject(error);
        });
        streamWrite.on('finish', () => {  // Report that the stream successfully completed
          console.log(`\x1b[45m`, `Successfully wrote ${filename} to ${directory}`, `\x1b[0m`);
          resolve();
        });
        //  Start the stream
        attachment.body.pipe(streamWrite);
      }
  });
};

export const saveFileToUserDirectory = (message) => {
  for (const file of message.attachments) {
    return new Promise((resolve, reject) => {
      let [messageId, attachmentInfo] = file;

      checkDate()
      .then(() => {
        return Promise.all([
          fetchAttachment(attachmentInfo),
          findOrCreateDirectory(message)
        ])
      })
      .then(saveAttachmentToDirectory)
      .then(resolve)
      .catch(reject);
    });
  }
}
