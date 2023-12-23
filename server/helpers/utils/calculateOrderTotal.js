function calculateOrderTotal(items) {
      let orderTotal = 0;
      items.forEach((item) => {
            orderTotal += item.count * item.foodPrice;
      });
      return orderTotal;
}

module.exports = { calculateOrderTotal }