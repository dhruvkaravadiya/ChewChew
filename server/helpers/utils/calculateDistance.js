function calculateDistance(lat1, lon1, lat2, lon2) {
      // Radius of the Earth in kilometers
      const R = 6371;
      // Convert latitude and longitude from degrees to radians
      const lat1Rad = toRadians(lat1);
      const lon1Rad = toRadians(lon1);
      const lat2Rad = toRadians(lat2);
      const lon2Rad = toRadians(lon2);
      // Differences in coordinates
      const dLat = lat2Rad - lat1Rad;      const dLon = lon2Rad - lon1Rad;
      // Haversine formula
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      // Distance in kilometers  
      const distance = R * c;
      return distance;
}

function toRadians(degrees) {
      return degrees * (Math.PI / 180);
}
module.exports = { calculateDistance }