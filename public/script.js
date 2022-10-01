let socket = io();

let timers = {};

// Socket events
socket.on('Ticker:UpdatePotentialTrades', (data) => {
  // $('#unknownUser').show(true);
  updateTickerTable(JSON.parse(data));
});

function updateTickerTable(data) {
  //$('#TickerTable').find('tr:not(:first)').remove();

  for (const [key, value] of Object.entries(data)) {
    console.log(`${key}: ${JSON.stringify(value)}`);

    if (timers[key] == undefined) {
      $('#TickerTable tr:last').after(
        `<tr id="${key}" class="new-item">
        <td id="${key}-difference">$${
          value.Difference.PriceDifference
        } (${value.Difference.PercentageDifference.toFixed(2)}%)</td>
        <td id="${key}-Exchange1">${value.Exchange1.Exchange1Name} ($${
          value.Exchange1.Exchange1Data.Price
        })</td>
        <td id="${key}-Exchange2">${value.Exchange2.Exchange2Name} ($${
          value.Exchange2.Exchange2Data.Price
        })</td>
        </tr>`
      );
      //alert('nope');
      console.log(key);
    } else {
      clearTimeout(timers[key]);
      delete timers[key];

      $(`#${key}-difference`).html(
        `$${
          value.Difference.PriceDifference
        } (${value.Difference.PercentageDifference.toFixed(2)}%)`
      );

      $(`#${key}-Exchange1`).html(
        `${value.Exchange1.Exchange1Name} ($${value.Exchange1.Exchange1Data.Price})`
      );

      $(`#${key}-Exchange2`).html(
        `${value.Exchange2.Exchange2Name} ($${value.Exchange2.Exchange2Data.Price})`
      );
    }

    //Delete this row if it doesn't get updated again in 5 seconds.
    timers[key] = setTimeout(() => {
      $(`#${key}`).remove();
      delete timers[key];
    }, 15000);

    console.log(timers[key]);
  }
}

$(document).ready(function () {
  $('#refresh').click(function () {
    socket.emit('Ticker:RequestRefresh');
  });
});
