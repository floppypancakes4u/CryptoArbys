// const axios = require('axios');
// const fs = require('fs');
import axios from 'axios';
import fs from 'fs';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let DB = { Pairs: {}, Opportunities: {} };

server.listen(8080, () => {
  io.on('connection', (socket) => {
    // socket.on('login', (data) => {
    //   UserTools.Login(socket, data);
    // });
    socket.on('Ticker:RequestRefresh', () => {
      socket.emit('Ticker:UpdatePotentialTrades', getOpportunities(true));
    });

    console.log(
      `New Socket: ${socket.id} auth: ${socket.auth} secure: ${socket.secure}`
    );

    socket.join('Every1Seconds');

    const data = JSON.stringify(DB.Opportunities);
    socket.emit('Ticker:UpdatePotentialTrades', getOpportunities(true));
  });

  console.log(`Arbys listening on  ${8080}!`);
});

const CONFIG = {
  SimulatePrices: true,
  Pairs: { BTCUSDT: true },
};

function loadDB() {
  fs.readFile('DB.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log('DB.json not detected. Creating.');
        fs.writeFile('DB.json', JSON.stringify(DB), 'utf8', function () {}); // write it back
      } else {
        console.log(err);
      }
    } else {
      DB = JSON.parse(data); //now it an object

      console.log('DB Loaded');
    }
  });
}

function saveDB() {
  json = JSON.stringify(DB); //convert it back to json
  fs.writeFile('DB.json', json, 'utf8', function () {}); // write it back
}

function CheckPairForOpprotunities(pairName) {
  axios
    .get(`https://api.cryptowat.ch/pairs/${pairName}`)
    .then((res) => {
      // console.log(`statusCode: ${res.status}`);
      console.log('result: ', res.data);

      ProcessPairResults(pairName, res.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function ProcessPairResults(pairName, data) {
  console.log('PROCESSING: ', data);
  DB.Pairs[pairName] = new Map();

  data.result.markets.forEach((entry) => {
    //GetPairPrices(entry.exchange, pairName);
    DB.Pairs[pairName].set(entry.exchange, { Price: -1 });
  });

  saveDB();
}

function GetPairPrices(exchangeName, pairName) {
  axios
    .get(`https://api.cryptowat.ch/markets/${exchangeName}/${pairName}/price`)
    .then((res) => {
      // console.log(`statusCode: ${res.status}`);
      console.log('result: ', res.data);

      DB.Pairs[pairName].set(exchange, { Price: res.data.result.price });
    })
    .catch((error) => {
      console.error(error);
    });
}

// //setTimeout(() => {
// CheckPairForOpprotunities('BTCUSDT');
// //}, 200);

// setTimeout(() => {
//   for (const [key, value] of Object.entries(DB.Pairs)) {
//     console.log(`${key}: ${value}`);
//   }

//   // DB.Pairs.forEach(function(value, key) {
//   //   console.log(key + " = " + value);
//   //   GetPairPrices(key)
//   // })
// }, 3000);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateTrades() {
  DB.Opportunities = {};
  for (const [pair, exchangeData] of Object.entries(DB.Pairs)) {
    // Get all pairs
    exchangeData.forEach(function (Exchange1Data, Exchange1Name) {
      //console.log(Exchange1Data, Exchange1Name);

      exchangeData.forEach(function (Exchange2Data, Exchange2Name) {
        //console.log(Exchange2Data, Exchange2Name);

        // Skip if this is our entry
        if (Exchange1Name === Exchange2Name) return;
        // DB.Opportunities.push({
        //   Exchange1: { Exchange1Name, Exchange1Data },
        //   Exchange2: { Exchange2Name, Exchange2Data },
        //   Difference: {
        //     PriceDifference: Math.abs(
        //       Exchange1Data.Price - Exchange2Data.Price
        //     ),
        //     PercentageDifference:
        //       (Math.min(Exchange1Data.Price, Exchange2Data.Price) /
        //         Math.max(Exchange1Data.Price, Exchange2Data.Price)) *
        //       100,
        //   },
        // });

        // Stupid way of generating a unique key. lmao
        let name = [Exchange1Name, Exchange2Name].sort();
        name.push(pair);
        let result = name.join();
        result = result.replace(',', '-');
        const KeyName = result.replace(',', '-');
        //console.log(KeyName);

        if (DB.Opportunities[KeyName] != undefined) return;
        DB.Opportunities[KeyName] = {
          Exchange1: { Exchange1Name, Exchange1Data },
          Exchange2: { Exchange2Name, Exchange2Data },
          Difference: {
            PriceDifference: Math.abs(
              Exchange1Data.Price - Exchange2Data.Price
            ),
            PercentageDifference:
              100 -
              (Math.min(Exchange1Data.Price, Exchange2Data.Price) /
                Math.max(Exchange1Data.Price, Exchange2Data.Price)) *
                100,
          },
        };
      });
    });
  }

  //console.log(getOpportunities()); //
  // io.to('Every1Seconds').emit(
  //   'Ticker:UpdatePotentialTrades',
  //   getOpportunities(true)
  // );
}

function getOpportunities(stringify = false) {
  if (stringify) {
    return JSON.stringify(DB.Opportunities);
  } else {
    return DB.Opportunities;
  }
}
function simulateShit() {
  for (const [pair, exchangeData] of Object.entries(DB.Pairs)) {
    //console.log(exchangeData);

    exchangeData.forEach(function (data, exchangeName) {
      const changeChance = 20;
      if (getRandomInt(1, 100) < changeChance) {
        const newPrice = data.Price + getRandomInt(-10, 10);
        DB.Pairs[pair].set(exchangeName, {
          Price: data.Price + getRandomInt(-10, 10),
        });

        //console.log(`${pair} on ${exchangeName} updated to $${newPrice}`);
      }
    });
  }

  updateTrades();
}

if (CONFIG.SimulatePrices) {
  DB.Pairs['BTCUSDT'] = new Map();
  DB.Pairs['BTCUSDT'].set('BINANCE', { Price: 200 });
  DB.Pairs['BTCUSDT'].set('ANYSWAP', { Price: 200 });
  DB.Pairs['BTCUSDT'].set('UNISWAP', { Price: 200 });
  DB.Pairs['BTCUSDT'].set('PANCAKESWAP', { Price: 200 });
  DB.Pairs['BTCUSDT'].set('GOOGLE', { Price: 200 });

  simulateShit();
  simulateShit();
  simulateShit();
  simulateShit();
  simulateShit();
  simulateShit();

  setInterval(() => {
    simulateShit();
  }, 1000);

  console.log('simulating');
} else {
  loadDB();
}

// setTimeout(() => {
//   updateTrades();
// }, 3000);
