const { IP_INFO_URL } = require("../../config/appConfig");

async function getCordinates() {
      try {
            const response = await fetch(IP_INFO_URL);
            const data = await response.json();
            const [latitude, longitude] = data.loc.split(',');
            return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
      } catch (error) {
            console.error('Error fetching IP information:', error);
            return null;
      }
}

module.exports = { getCordinates };