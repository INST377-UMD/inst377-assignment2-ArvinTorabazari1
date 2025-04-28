function loadStockAPI() {
  const rangeSelected = document.getElementById("dayRange").value;
  const stockSelected = document.getElementById("stockTicker").value.toUpperCase();
  
  
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
 

  const result = await fetch(`https://tradestie.com/api/v1/apps/reddit?date=2022-04-03`)
    .then((response) => 
    response.json());

  console.log("reddit stock", result); 

  const topStocks = result.slice(0, 5);
  console.log("Top Stocks", topStocks);

  const tableBody = document.getElementById('bullishOrBearish').querySelector('tbody');
  tableBody.innerHTML = "";

  topStocks.forEach(stock => {
    const row = document.createElement('tr');

    const tickerItem = document.createElement('td');
    const tickerLink = document.createElement('a');
    tickerLink.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
    tickerLink.target = "_blank";
    tickerLink.textContent = stock.ticker;
    tickerItem.appendChild(tickerLink);

    const commentItem = document.createElement('td');
    commentItem.textContent = stock.no_of_comments; 

    const sentimentItem = document.createElement('td');
    const sentimentImage = document.createElement('img');
    sentimentImage.width = 100;
    sentimentImage.height = 100;

    if (stock.sentiment.toLowerCase() === 'bullish') {
      sentimentImage.src = 'bull.jpeg'; // Bull icon
      sentimentImage.alt = 'Bullish';
      sentimentItem.appendChild(sentimentImage);
    } else if (stock.sentiment.toLowerCase() === 'bearish') {
      sentimentImage.src = 'bear.jpeg'; // Bear icon
      sentimentImage.alt = 'Bearish';
      sentimentItem.appendChild(sentimentImage);
    }
    row.appendChild(tickerItem);
    row.appendChild(commentItem);
    row.appendChild(sentimentItem);

    
    tableBody.appendChild(row);
  })
}

function turnOnListening() {
  if (annyang) {
      // Let's define a command.
      const commands = {
        'hello': () => { alert('Hello world!'); 
          },
        'change the color to *color':(color) => {
          document.body.style.backgroundColor = color
          },
          'go to *page': (page) => {
              page = page.toLowerCase();

              const pages = {
                  'home':'homepage.html',
                  'dogs': 'dogs.html',
                  'stocks': 'stocks.html'
              };

              const relocate =pages[page];
              if (relocate) {
                  window.location.href = relocate;
              }
          }, 
          'lookup *company': (company) => {
            document.getElementById("stockTicker").value = company.toUpperCase();
            console.log("Lookup:", company);
            populateChart();
            
          }

      };
    
      // Add our commands to annyang
      annyang.addCommands(commands);
    
      // Start listening.
      annyang.start();
}}

function turnOffListening(){
  //Stop Listening
  if (annyang) {
      annyang.abort();
  }
}



window.onload = bullOrBear;