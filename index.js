// const axios = require('axios');
// const fs = require('fs');
import axios from 'axios';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { Searcher } from './bot/searcher.js';
import { saveDB, loadDB } from './bot/DB.js';
import { Utils } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const CONFIG = {
  SimulatePrices: false,
  Pairs: { BTCUSDT: true },
};

app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// let DB = { Pairs: {}, Opportunities: {} };
let DB = null;

function startServer(loadedDB) {
  
  DB = loadedDB;
  //console.log(DB);
  
  Searcher.updateTrades(DB);

  server.listen(8080, () => {
    io.on('connection', (socket) => {
      //console.log("BALLZ: ", DB);
     
      socket.on('Ticker:RequestRefresh', () => {
        socket.emit('Ticker:UpdatePotentialTrades', getOpportunities(true));
      });
  
      console.log(
        `New Socket: ${socket.id} auth: ${socket.auth} secure: ${socket.secure}`
      );
  
      socket.join('Every1Seconds');
      socket.emit('Ticker:UpdatePotentialTrades', getOpportunities(true));
    });
  
    console.log(`Arbys listening on  ${8080}!`);
  });
}

// function CheckPairForOpprotunities(pairName) {
//   axios
//     .get(`https://api.cryptowat.ch/pairs/${pairName}`)
//     .then((res) => {
//       // console.log(`statusCode: ${res.status}`);
//       console.log('result: ', res.data);

//       ProcessPairResults(pairName, res.data);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// function ProcessPairResults(pairName, data) {
//   DB.Pairs[pairName] = new Map();

//   data.result.markets.forEach((entry) => {
//     DB.Pairs[pairName].set(entry.exchange, { Price: -1 });
//     GetPairPrices(entry.exchange, pairName);
//   });

//   saveDB(DB);
// }

// function GetPairPrices(exchangeName, pairName) {
//   axios
//     .get(`https://api.cryptowat.ch/markets/${exchangeName}/${pairName}/price`)
//     .then((res) => {

//       DB.Pairs[pairName].set(exchangeName, { Price: res.data.result.price });
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

function getOpportunities(stringify = false) {
  //console.log(DB)
  if (stringify) {
    return JSON.stringify(DB.Opportunities);
  } else {
    return DB.Opportunities;
  }
}

// function simulateShit() {
//   for (const [pair, exchangeData] of Object.entries(DB.Pairs)) {

//     exchangeData.forEach(function (data, exchangeName) {
//       const changeChance = 20;
//       if (Utils.getRandomInt(1, 100) < changeChance) {
//         const newPrice = data.Price + Utils.getRandomInt(-10, 10);
//         DB.Pairs[pair].set(exchangeName, {
//           Price: data.Price + Utils.getRandomInt(-10, 10),
//         });

//         //console.log(`${pair} on ${exchangeName} updated to $${newPrice}`);
//       }
//     });
//   }

//   Searcher.updateTrades();
// }

  
loadDB(startServer);