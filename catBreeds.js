const fs = require('fs');
const axios = require('axios');

const apiUrl = 'https://catfact.ninja/breeds';

async function getData() {
  try {
    // Step 1: Log the response to a text file
    const response = await axios.get(apiUrl);
    fs.writeFileSync('catBreedsData.txt', JSON.stringify(response.data, null, 2));

    // Step 2: Console log the number of pages
    const totalPages = response.data.last_page;
    console.log(`Number of pages: ${totalPages}`);

    // Step 3: Get data from ALL the pages
    const allBreeds = await getAllBreeds(totalPages);

    // Step 4: Group cat breeds by country
    const breedsByCountry = groupBreedsByCountry(allBreeds);

    console.log('Cat breeds grouped by country:', JSON.stringify(breedsByCountry, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getAllBreeds(totalPages) {
  const allBreeds = [];

  for (let page = 1; page <= totalPages; page++) {
    const response = await axios.get(`${apiUrl}?page=${page}`);
    allBreeds.push(...response.data.data);
  }

  return allBreeds;
}

function groupBreedsByCountry(breeds) {
  const breedsByCountry = {};

  breeds.forEach(breed => {
    const country = breed.country;

    if (!breedsByCountry[country]) {
      breedsByCountry[country] = [];
    }

    breedsByCountry[country].push({
      breed: breed.breed,
      origin: breed.origin,
      coat: breed.coat,
      pattern: breed.pattern,
    });
  });

  return breedsByCountry;
}

// Run the program
getData();
