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
        console.log("button", button.textContent);
        button.setAttribute("class", "button-1");
        breedButtons.appendChild(button)
    })
}

window.onload = loadDogs; 
loadDogBreeds();
