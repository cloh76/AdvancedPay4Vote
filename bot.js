const SteemBot = require('../dist/loader').default;

const username = 'Your Bot Name';

const activeKey = 'Your Private Active Key'; 

function isValidSteemitLink(link) {
  return link.indexOf('steemit.com') > -1;
}

const bot = new SteemBot({username, activeKey});

bot.onDeposit(username, handleDeposit);

function handleDeposit(data, responder) {
  if (parseFloat(data.amount) >= 0.01 &&  isValidSteemitLink(data.memo)) {
    const randomVote = (Math.random() * 4).toFixed(2) + 1;

    responder.upvoteOnMemo(randomVote)
      .then(() => {
        responder.commentOnMemo(
          `This post received a ${randomVote}% upvote from @Your_Bot_Name thanks to @${data.from}! For more information, click here!`
        );
      });
  } else {
    if (data.amount.indexOf('STEEM') > -1) {
      responder.sendSteem(
        data.amount,
        'Sending back the money, should be at least 2 STEEM or SBD with a valid steemit link in memo'
      );
    } else {
      responder.sendSbd(
        data.amount,
        'Sending back the money, should be at least 2 STEEM or SBD with a valid steemit link in memo'
      );
    }
  }
}

bot.start();