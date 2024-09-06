import axios from 'axios';
import chalk from 'chalk';
import crypto from 'crypto';

//import http from 'http';
//axios.defaults.headers['X-CW-API-Key'] = `${DB.APIPublicKey}`;
// import Binance from 'node-binance-us-api';
// const binance = new Binance().options({
//   APIKEY: 'A0Mk8ZtKcOsY765I5ExrAH76I9K0kgtIIfw9l3NDYzG7YZ4iz5wZyvGoM5rM0K2m',
//   APISECRET: 'jpQ43spdbQR1zhKu5JXnlJueoc5eILcntEJFCNsOnwjxWOIP8lfkZNXZI88HiVoY',
// });
//console.info(await binance.futuresBalance());
export const Searcher = {
	DB: null,
	Init(DB) {
		Searcher.DB = DB;
	},
	updateTrades(DB) {
    return;
    console.clear()
		//console.log(DB);
		for(const [pair, pairData] of Object.entries(DB.Pairs)) {
			axios.get(pairData[0].bookTicker, {
				headers: {
					'X-CW-API-Key': DB.APIPublicKey,
				},
			}).then(function(response) {
				// handle success
				if(response.status == 200) {
					let coin1Data = response.data;
					axios.get(pairData[1].bookTicker, {
						headers: {
							'X-CW-API-Key': DB.APIPublicKey,
						},
					}).then(function(response) {
						// handle success
						if(response.status == 200) {
							let coin2Data = response.data;
              
              const difference = Math.abs(coin1Data.askPrice - coin2Data.askPrice)
              if (DB.RequiredDifference <= difference) {
                
                //console.log(coin1Data.price.last, coin2Data.price.last);
                console.log(`[${pairData[0].Name} - ${pairData[1].Name}] ` + chalk.green(`${difference}`))
              }
						
								//console.log(response.data);
						}
					}).catch(function(error) {
						// handle error
						console.log(error);
					}).then(function() {
						// always executed
					});
				}
			}).catch(function(error) {
				// handle error
				console.log(error);
			}).then(function() {
				// always executed
			});


			// axios
			//   .get(pairData.SummaryRoute, {
			//     headers: {
			//       'X-CW-API-Key': DB.APIPublicKey,
			//     },
			//   })
			//   .then(function (response) {
			//     // handle success
			//     console.log(response.data);
			//   })
			//   .catch(function (error) {
			//     // handle error
			//     console.log(error);
			//   })
			//   .then(function () {
			//     // always executed
			//   });
			// var options = {
			//   host: pairData.SummaryRoute,
			//   port: 80,
			//   path: '',
			//   method: 'POST',
			// };
			// var req = http.request(options, function (res) {
			//   console.log('STATUS: ' + res.statusCode);
			//   console.log('HEADERS: ' + JSON.stringify(res.headers));
			//   res.setEncoding('utf8');
			//   res.on('data', function (chunk) {
			//     console.log('BODY: ' + chunk);
			//   });
			// });
			// req.on('error', function (e) {
			//   console.log(e);
			//   console.log('problem with request: ' + e.message);
			// });
			// write data to request body
			//req.write('data\n');
			//req.write('data\n');
			//req.end();
		}
		return;
		for(const [pair, exchangeData] of Object.entries(DB.Pairs)) {
			// Get all pairs
			exchangeData.forEach(function(Exchange1Data, Exchange1Name) {
				//console.log(Exchange1Data, Exchange1Name);
				exchangeData.forEach(function(Exchange2Data, Exchange2Name) {
					//console.log(Exchange2Data, Exchange2Name);
					// Skip if this is our entry
					if(Exchange1Name === Exchange2Name) return;
					// Stupid way of generating a unique key. lmao
					let name = [Exchange1Name, Exchange2Name].sort();
					name.push(pair);
					let result = name.join();
					result = result.replace(',', '-');
					const KeyName = result.replace(',', '-');
					//console.log(KeyName);
					if(DB.Opportunities[KeyName] != undefined) return;
					DB.Opportunities[KeyName] = {
						Exchange1: {
							Exchange1Name,
							Exchange1Data
						},
						Exchange2: {
							Exchange2Name,
							Exchange2Data
						},
						Difference: {
							PriceDifference: Math.abs(Exchange1Data.Price - Exchange2Data.Price),
							PercentageDifference: 100 - (Math.min(Exchange1Data.Price, Exchange2Data.Price) / Math.max(Exchange1Data.Price, Exchange2Data.Price)) * 100,
						},
					};
				});
			});
		}
	},

  Test(DB) {

    // // BUILD SIGN
    // const sign crypto.createHmac('sha256', DB.APIPrivateKey).update(data).digest('hex');
    // console.log("testing")
    // axios.post(`https://api.binance.us/api/v3/myTrades`, {
    //   headers: {
    //     'X-MBX-APIKEY': DB.APIPrivateKey,
    //   },
    // }).then(function(response) {
    //   console.log(response);
    // }).catch(function(error) {
    //   // handle error
    //   console.log(error);
    // })
  },

  executeTrade(DB, BuyTicker, SellTicker) {
    axios.get(pairData[0].bookTicker, {
      headers: {
        'X-CW-API-Key': DB.APIPrivateKey,
      },
    }).then(function(response) {
      // handle success
      // if(response.status == 200) {
      //   let coin1Data = response.data;
      //   axios.get(pairData[1].bookTicker, {
      //     headers: {
      //       'X-CW-API-Key': DB.APIPrivateKey,
      //     },
      //   }).then(function(response) {
      //     // handle success
      //     if(response.status == 200) {
      //       let coin2Data = response.data;
            
      //       const difference = Math.abs(coin1Data.askPrice - coin2Data.askPrice)
      //       if (DB.RequiredDifference <= difference) {
              
      //         //console.log(coin1Data.price.last, coin2Data.price.last);
      //         console.log(`[${pairData[0].Name} - ${pairData[1].Name}] ` + chalk.green(`${difference}`))
      //       }
          
      //         //console.log(response.data);
      //     }
      //   }).catch(function(error) {
      //     // handle error
      //     console.log(error);
      //   }).then(function() {
      //     // always executed
      //   });
      // }
    }).catch(function(error) {
      // handle error
      console.log(error);
    }).then(function() {
      // always executed
    });
  }
};
// export const Searcher = {
//   DB: null,
//   Init(DB) {
//     Searcher.DB = DB;
//   },
//   updateTrades(DB) {
//     console.log(DB);
//     for (const [pair, exchangeData] of Object.entries(DB.Pairs)) {
//       // Get all pairs
//       exchangeData.forEach(function (Exchange1Data, Exchange1Name) {
//         //console.log(Exchange1Data, Exchange1Name);
//         exchangeData.forEach(function (Exchange2Data, Exchange2Name) {
//           //console.log(Exchange2Data, Exchange2Name);
//           // Skip if this is our entry
//           if (Exchange1Name === Exchange2Name) return;
//           // Stupid way of generating a unique key. lmao
//           let name = [Exchange1Name, Exchange2Name].sort();
//           name.push(pair);
//           let result = name.join();
//           result = result.replace(',', '-');
//           const KeyName = result.replace(',', '-');
//           //console.log(KeyName);
//           if (DB.Opportunities[KeyName] != undefined) return;
//           DB.Opportunities[KeyName] = {
//             Exchange1: { Exchange1Name, Exchange1Data },
//             Exchange2: { Exchange2Name, Exchange2Data },
//             Difference: {
//               PriceDifference: Math.abs(
//                 Exchange1Data.Price - Exchange2Data.Price
//               ),
//               PercentageDifference:
//                 100 -
//                 (Math.min(Exchange1Data.Price, Exchange2Data.Price) /
//                   Math.max(Exchange1Data.Price, Exchange2Data.Price)) *
//                   100,
//             },
//           };
//         });
//       });
//     }
//   },
// };