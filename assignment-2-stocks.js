function loadStockAPI() {
  const rangeSelected = document.getElementById("dayRange").value;
  const stockSelected = document.getElementById("stockTicker").value;
  
  
  console.log("Range Selected:", rangeSelected)
  console.log("Stock Ticker", stockSelected)
  const today = new Date();
      // change thirty with the value from the form 
  const range = today.getTime()-rangeSelected*24*60*60*1000;
      const now = today.getTime();
      return fetch(`https://api.polygon.io/v2/aggs/ticker/${stockSelected}/range/1/day/${range}/${now}?adjusted=true&sort=asc&limit=120&apiKey=8l0cAPG6RzPgX2xiRmk68KSSUWRfOMjI`)
      .then((result) =>
      result.json()
    );


}

let myChart 

async function populateChart() {
    const data = await loadStockAPI();
    console.log("Stock Data", data);


    // Getting all dates from API 
    const allDates = data.results.map(date => new Date(date.t).toLocaleDateString());
    console.log("dates", allDates);
    
    // Getting all prices from API
    const allClosingPrices = data.results.map(closingPrice => closingPrice.c);
    console.log("closing price", allClosingPrices);


    
    const ctx = document.getElementById('myChart');

    ctx.style.backgroundColor = 'white';

    if (myChart){
        myChart.destroy();
    }
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: allDates,
      datasets: [{
        label: '($) Stock Price',
        data: allClosingPrices,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
async function bullOrBear() {
  // Get todays date in milliseconds
  const today = new Date();

  // convert to seconds
  const todayEpoch = Math.floor(today.getTime() / 1000);
  console.log("Today's epoch:", todayEpoch)

  // convert to ISO date for API
  const formattedDate = new Date(todayEpoch * 1000).toISOString().split('T')[0];
  console.log("Formatted Date (yyyy-mm-dd):", formattedDate);

  const result = await fetch(`https://tradestie.com/api/v1/apps/reddit?date=2022-04-03`)
    .then((response) => 
    response.json());

  console.log("reddit stock", result); 

  const topStocks = result.slice(0, 5);
  console.log("Top 5 Stocks", topStocks);

  const tableBody = document.getElementById('bullishOrBearish').querySelector('tbody');
  tableBody.innerHTML = "";

  topStocks.forEach(stock => {
    const row = document.createElement('tr');

    const tickerRow = document.createElement('td');
    tickerRow.textContent = stock.ticker; 

    const commentRow = document.createElement('td');
    commentRow.textContent = stock.no_of_comments; 

    const sentimentRow = document.createElement('td');
    const sentimentImage = document.createElement('img');
    sentimentImage.width = 100;
    sentimentImage.height = 100;

    if (stock.sentiment.toLowerCase() === 'bullish') {
      sentimentImage.src = 'bull.jpeg'; // Bull icon
      sentimentImage.alt = 'Bullish';
      sentimentRow.appendChild(sentimentImage);
    } else if (stock.sentiment.toLowerCase() === 'bearish') {
      sentimentImage.src = 'bear.jpeg'; // Bear icon
      sentimentImage.alt = 'Bearish';
      sentimentRow.appendChild(sentimentImage);
    }
    row.appendChild(tickerRow);
    row.appendChild(commentRow);
    row.appendChild(sentimentRow);

    
    tableBody.appendChild(row);
  })
}



window.onload = bullOrBear;