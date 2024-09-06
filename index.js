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
import { get, request } from "./bot/auth.js"

import { GetOrderBook } from './bot/orderbook.js';

import moment from "moment"

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

  // setInterval(() => {
  //   Searcher.updateTrades(DB);
  // }, DB.RefreshRate)
  // Searcher.updateTrades(DB);

  //Searcher.Test(DB);

  
  const offset = 15000;
  //const newTime = moment().unix()*1000 - offset;
  const newTime = moment().unix()*1000;

  // axios.get(`https://api.binance.us/api/v3/time`).then(function(response) {
  //   console.log(response.data.serverTime, newTime, Math.abs(newTime - response.data.serverTime));
  // }).catch(function(error) {
  //   // handle error
  //   console.log(error);
  // })

  // const data = {symbol: "LTCBTC", "timestamp": newTime};

  // request("/api/v3/openOrders", data, DB.APIPublicKey, DB.APISecretKey).then(result => { 
  //   console.log(result)
  // });

  // const data = {symbol: "LTCBTC", "limit": 10};

 

  // get("/api/v3/depth", data, DB.APIPublicKey, DB.APISecretKey).then(result => { 
  //   console.log(result)
  // })

  GetOrderBook("AVAXUSDT", 20)




  server.listen(8080, () => {
    io.on('connection', (socket) => {
      //console.log("BALLZ: ", DB);

      // socket.on('Ticker:RequestRefresh', () => {
      //   socket.emit('Ticker:UpdatePotentialTrades', getOpportunities(true));
      // });

      console.log(
        `New Socket: ${socket.id} auth: ${socket.auth} secure: ${socket.secure}`
      );

      // socket.join('Every1Seconds');
      // socket.emit('Ticker:UpdatePotentialTrades', getOpportunities(true));
    });

    console.log(`Arbys listening on  ${8080}!`);
  });
}

loadDB(startServer);
