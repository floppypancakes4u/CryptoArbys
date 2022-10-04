export const Searcher = {
    DB: null,

    Init(DB) {
        Searcher.DB = DB;
    },

    updateTrades(DB) {
        console.log(DB)
        
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
}