async function getQuote() {
    const quoteData = await fetch('https://zenquotes.io/api/random');
    console.log('Retrieved Quote', quoteData);
    const data = await quoteData.json();
    const quote = data[0].q;
    const author = data[0].a;

    document.getElementById("quoteLoaded").innerHTML = `"${quote}" — <br> ${author}`;
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
window.onload = getQuote();