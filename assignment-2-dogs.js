const dogIDMapping = {}


async function loadDogs() {
    const response = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const dogImages= await response.json();
    console.log("Dog images", dogImages);

    const randomDogImages = document.getElementById('randomDogImages');
    await dogImages.message.forEach (dogImage => {
        const image = document.createElement('img');
        console.log("dog Image", dogImage)
        image.src = dogImage;
        randomDogImages.appendChild(image)

    })
    simpleslider.getSlider();
}
async function loadDogBreeds() {
    const response = await fetch('https://dogapi.dog/api/v2/breeds');
    const dogs = await response.json();
    const dogBreeds = dogs.data;
    console.log("dog breeds",dogBreeds);

    const breedButtons = document.getElementById('breedButtons')
    dogBreeds.forEach(breed => {
        const button = document.createElement('button')
        button.textContent = breed.attributes.name;
        dogIDMapping[breed.attributes.name] = breed.id
        console.log("button", button.textContent);
        button.setAttribute("class", "button-1");
        button.onclick = () => breedInfo(breed.id);
        breedButtons.appendChild(button)
    })
}

async function breedInfo(breedid) {
    const response = await fetch(`https://dogapi.dog/api/v2/breeds/${breedid}`)
    const breedInfo = await response.json()
    dogBreedName = breedInfo.data.attributes.name
    dogBreedDescription = breedInfo.data.attributes.description
    dogBreedMax = breedInfo.data.attributes.life.max
    dogBreedMin = breedInfo.data.attributes.life.min
    document.getElementById('breedInfo').style.display = 'block';
    document.getElementById('breedName').innerHTML = ` Name: ${dogBreedName}`;
    document.getElementById('breedDescription').innerHTML = `<strong> Description: ${dogBreedDescription} </strong>`;
    document.getElementById('breedMinAge').innerHTML = `<strong> Min Age: ${dogBreedMin} </strong>`;
    document.getElementById('breedMaxAge').innerHTML = `<strong> Max Age: ${dogBreedMax} </strong>`;

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
            'load *breed': (breed) => {
                document.getElementsByClassName("button-1").value = breed;
                console.log("load:", breed);
                breedInfo(dogIDMapping[breed]);

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

window.onload = loadDogs; 
loadDogBreeds();
