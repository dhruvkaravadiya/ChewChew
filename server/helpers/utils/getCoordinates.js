const axios = require('axios');
const { IP_INFO_URL } = require('../../config/appConfig');

async function getCoordinates() {
  try {
    const response = await axios.get(IP_INFO_URL);
    const { loc } = response.data;
    const [latitude, longitude] = loc.split(',');
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  } catch (error) {
    console.error('Error fetching IP information:', error);
    return null;
  }
}

module.exports = { getCoordinates };
