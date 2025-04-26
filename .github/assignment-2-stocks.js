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

