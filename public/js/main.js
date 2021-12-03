
const server = "http://localhost:3010";
fetchstores();
async function fetchstores() {
    try{
        const url = server + '/store';
        const options = {
            method: 'GET',
            headers: {
                'Accept' : 'application/json'
            }
        }
        const response = await fetch(url, options);
        const stores = await response.json();
        const gross = grossProfit(stores);
        drawChart(gross);
        console.log(gross);
    }catch(error){
        console.log("Error over here " + error);
    }

}

function grossProfit(stores){
    var counter = 0;
    var grossProfit = 0;
    var cogs = 0;
    var gross =[];

    while(counter < Object.keys(stores).length){
        var revenue = parseFloat((stores)[counter].revenue)
        var endingInventory = parseFloat((stores)[counter].inventory)
        var purchases = parseFloat((stores)[counter].purchases)
        if(counter == 0 ){
            cogs = purchases - endingInventory;
        }
        else{
            var beginningInventory = parseFloat((stores)[counter-1].inventory);
            cogs = beginningInventory + purchases - endingInventory;
        }

        grossProfit = revenue - cogs;
        gross.push(grossProfit);
        counter++
    }
    
    return gross;
}

function simpleMovingAverage(profit, window = 5) {
    if (!profit || profit.length < window) {
      return [];
    }
  
    let index = window - 1;
    const length = profit.length + 1;
  
    const simpleMovingAverages = [];
  
    while (++index < length) {
      const windowSlice = profit.slice(index - window, index);
      const sum = windowSlice.reduce((prev, curr) => prev + curr, 0);
      simpleMovingAverages.push(sum / window);
    }
  
    return simpleMovingAverages;
}

async function drawChart(gross){
    var months = ['Jan','Feb','March','April','May','June','July','August','Sep','Oct','Nov','Dec', 'Jan','Feb','March','April','May','June','July','August','Sep','Oct','Nov','Dec']
    var myChart = document.getElementById('myChart').getContext('2d');

    var smaChart = new Chart(myChart, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Gross Profit', // Name the series
                data: gross, // Specify the data values array
                fill: false,
                borderColor: '#2196f3', // Add custom color border (Line)
                backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
            },
                    {
                label: 'Five Month SMA', // Name the series
                data: simpleMovingAverage(gross), // Specify the data values array
                fill: false,
                borderColor: '#4CAF50', // Add custom color border (Line)
                backgroundColor: '#4CAF50', // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
            }]
        },
        options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        }
    });
  }




