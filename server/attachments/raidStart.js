
if ( message.attachments.keyArray().length >= 1 && cityPattern.test(channelName) && ( ( currentTime.hour() <= 21 && currentTime.hour() >= 6 ) ) ) {
  //&& ( ( currentTime.hour() <= 21 && currentTime.hour() >= 6 ) || (typeof message.guild !== 'undefined' && typeof message.guild.name !== 'undefined' && message.guild.name === 'square bot test') ) )

message.attachments.forEach(function (item, index) {
  //console.log(item);
  let attachment = [item.url];
  let img = item.url;
  //console.log( img );
  let gymResults = '',
  timerResults = '',
  androidTimeResults = '',
  //levelResults = '',
  nameResults = '';
  //cpResults = '';

  request.get(img, function (err, res, body) {
    if (err !== null) {
      console.log(err);
    }
    Exif(body, (error, metaData) => {
      if (error) {
        //console.log(error);
      }
      let endedTime = '',
      timerDate = '';
      let currentDate = Moment().tz('America/New_York').format();
      let ssTakenDate = '';
      if( typeof metaData !== 'undefined' && typeof metaData.DateCreated !== 'undefined' ){
        let ssTakenArray = metaData.DateCreated.replace(" ", ":").split(":");
        ssTakenDate = ssTakenArray[0] + '-' + ssTakenArray[1] + '-' + ssTakenArray[2] + ' ' + ssTakenArray[3] + ':' + ssTakenArray[4] + ':' + ssTakenArray[5] + '-04:00';
        ssTakenDate = Moment(ssTakenDate).tz('America/New_York').format(); //"2017-08-05 23:27:00-04:00"
      }
      
      //let howLong = DateTime.isoTimeDiff(currentDate, ssTakenDate);
      //console.log(ssTakenDate);
      Jimp.read(img)
      .then(function (image) {
        image.resize(750, Jimp.AUTO);
        let gymImage = image.clone(),
        timerImage = image.clone(),
        androidTimeImage = image.clone(),
        //levelImage = image.clone(),

        nameImage = image.clone(),
        //cpImage = image.clone(),
        imgWidth = image.bitmap.width,
        imgHeight = image.bitmap.height,
        gymHcrop = 1275,
        gymW = 150,
        gymH = 80,
        nameHcrop = 1220,
        nameW = 0,
        nameH = 315,
        timerHcrop = 1280,
        timerW = 565,
        timerH = 790,
        cpHcrop = 1220;

        if( imgHeight < 1331 ){
          gymHcrop =  1200;
          timerHcrop = 1215;
          timerH = 750;
          timerW = 550;
          nameHcrop = 1150;
          nameW = 0;
          nameH = 300;
          cpHcrop = 1180;
        }else if( imgHeight >= 1542){
          gymHcrop =  1450;
          gymH = 150;
          timerHcrop = 1490;
          timerH = 870;
          nameHcrop = 1440;
          nameH = 400;
        }
        // do stuff with the image
        gymImage.crop(gymW, gymH, (imgWidth - 140), (imgHeight - gymHcrop))
        .quality(100)
        .invert()
        .greyscale()
        .contrast(-0.46)
        .normalize() //.write( './tmp/edited.png')
        .getBuffer(gymImage.getMIME(), function (err, buffer) {
          if (err) {
            console.log(err);
          }
          textract.fromBufferWithMime(gymImage.getMIME(), buffer, function (error, text) {
            if (err) {
              console.log(err);
            }
            gymResults = text;

            timerImage.crop(timerW, timerH, (imgWidth - 620), (imgHeight - timerHcrop))
            .quality(100)
            .invert()
            .greyscale()
            .contrast(-0.46)
            .normalize() //.write( './tmp/edited1.png')
            .getBuffer(timerImage.getMIME(), function (err, buffer) {
              if (err) {
                console.log(err);
              }
              textract.fromBufferWithMime(timerImage.getMIME(), buffer, function (error, text) {
                if (err) {
                  console.log(err);
                }
                timerResults = text;

                nameImage.crop(nameW, nameH, (imgWidth), (imgHeight - nameHcrop))
                .quality(100)
                .invert()
                .greyscale()
                .contrast(-0.46)
                .normalize() //.write( './tmp/edited1.png')
                .getBuffer(nameImage.getMIME(), function (err, buffer) {
                  if (err) {
                    console.log(err);
                  }
                  textract.fromBufferWithMime(nameImage.getMIME(), buffer, function (error, text) {
                    if (err) {
                      console.log(err);
                    }
                    nameResults = text;
                    if( ssTakenDate == '' ){
                      androidTimer( message, nameResults, gymResults, timerResults, androidTimeResults, ssTakenDate, channelName, attachment, img, androidTimeImage, 150 , imgWidth, imgHeight );
                    }else{
                      sendRaidMessage( message, nameResults, gymResults, timerResults, '', ssTakenDate, channelName, attachment, img );
                    }
                  });
                }); // save
              });
            });
          }); // save
        });
      }).catch(function (err) {
        // handle an exception
        if (err) {
          console.log(err);
        }
      });
    });
  });
});
}

if (typeof message.guild !== 'undefined' && typeof message.guild.name !== 'undefined' && message.guild.name === 'square bot test') {
  //client.emit("guildMemberAdd", message.guild.members.get("297918949214126081"));339590026973282304
  //var channelRole = message.channel.server.roles.get('name', channelName);       339590026973282304
  //let role = member.guild.roles.find("name", 'Raidrz');
  //member.addRole(role).catch(console.error);

  //message.pin();
}
});

function androidTimer( message, nameResults, gymResults, timerResults, androidTimeResults, ssTakenDate, channelName, attachment, img, androidTimeImage, androidTimeW, imgWidth, imgHeight ){
  var androidTimerClone = androidTimeImage.clone();

  androidTimerClone.crop((imgWidth - androidTimeW) , 0, androidTimeW , (imgHeight - ( imgHeight - 50)))
  .quality(100)
  .invert()
  .greyscale()
  .contrast(-0.46)
  .normalize() //.write( './tmp/edited1.png')
  .getBuffer(androidTimerClone.getMIME(), function (err, buffer) {
    if (err) {
      console.log(err);
    }
    textract.fromBufferWithMime(androidTimerClone.getMIME(), buffer, function (error, text) {
      if (err) {
        console.log(err);
      }
      androidTimeResults = text.match(/((([0-9]?)[0-9]):[0-9][0-9](\s?)((pm|am)?))/i);
      //console.log(text);
      if( androidTimeResults && androidTimeResults.length >= 0 ){
        androidTimeResults = androidTimeResults[0].trim();
        sendRaidMessage( message, nameResults, gymResults, timerResults, androidTimeResults, ssTakenDate, channelName, attachment, img );
      }else if( androidTimeW >= 80){
        androidTimer( message, nameResults, gymResults, timerResults, androidTimeResults, ssTakenDate, channelName, attachment, img, androidTimeImage, androidTimeW - 22 , imgWidth, imgHeight );
      }else{
        androidTimeResults = '';
        sendRaidMessage( message, nameResults, gymResults, timerResults, androidTimeResults, ssTakenDate, channelName, attachment, img );
      }
    });
  });
}

function sendRaidMessage( message, nameResults, gymResults, timerResults, androidTimeResults, ssTakenDate, channelName, attachment, img ){
  let found = 0,
  raidBoss = '',
  raidBossImg = '',
  timerArr = {};

  nameResults = nameResults.toLowerCase();
  Object.keys(raidBosses).forEach(function (key) {

    var pattern = new RegExp(key, "i");

    if (nameResults.match(pattern) !== null) {
      raidBoss = key;
      raidBossImg = raidBosses[key].image;
    }
  });

  gymResults = gymResults.toLowerCase().trim().replace('/^.[\\,\.\/<>\?;:\'\"\[\]!@#\$%\^&\*()\-_=\+`~\|]/', '').trim();

  let raidImage = img;
  if (raidBoss !== '') {
    found++;
  } else {
    raidBossImg = raidImage;
    raidBoss = '';
  }
  if (gymResults !== '') {
    found++;
  } else {
    gymResults = 'Please tab on thumbnail';
  }
  if (timerResults !== '') {
    found++;
    timerArr = timerResults.split(':');
    //console.log(timerResults);
    //console.log(timerArr);
    //console.log(ssTakenDate);
    //console.log(androidTimeResults);
    if( androidTimeResults != '' ){
      ssTakenDate = moment( Moment().tz('America/New_York').format("YYYY-MM-DD") + ' ' + androidTimeResults);
      //console.log(androidTimeResults);
      //console.log(ssTakenDate);
      endedTime = ssTakenDate.add({ hours: timerArr[0], minutes: timerArr[1], seconds: timerArr[2] }).format("h:mm:ss A");
    }else{
      endedTime = moment(ssTakenDate).add({ hours: timerArr[0], minutes: timerArr[1], seconds: timerArr[2] }).tz('America/New_York').format("h:mm:ss A");
    }
  } else {
    timerResults = 'Please tab on thumbnail';
  }
  /*if (cpResults !== '') {
  found++;
} else {
cpResults = 'Please tab on thumbnail';
}*/
let roleToMention = message.guild.roles.find('name', channelName);
roleToMention = (roleToMention) ? '<@&' + roleToMention.id + '>' : '';
let raidBossMention = message.guild.roles.find('name', raidBoss);
raidBossMention = (raidBossMention) ? '<@&' + raidBossMention.id + '>' : '';
if ( timerResults !== '' && timerArr.length == 3 && endedTime !== 'Invalid date' ) {
  let oldMessage = message;
  message.channel.send(`${roleToMention} there is a ${raidBossMention} Raid`, {
    "embed": {
      "color": 3447003,
      "title": 'Raid Posted!',
      "thumbnail": {
        "url": raidBossImg,
      },
      "fields": [{
        "name": "Gym",
        "value": gymResults,
        "inline": true
      }, {
        "name": "Timer",
        "value": timerResults,
        "inline": true
      }, {
        "name": "Ends At",
        "value": endedTime,
        "inline": true
      }]
    },
    "files": attachment,
  }).then(message => {
    oldMessage.delete();
    message.pin();
  });

}
}
