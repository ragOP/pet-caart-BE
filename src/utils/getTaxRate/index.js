exports.getTaxForItem = (item, state) => {
  const price = item.price;
  const hsn = item.productId.hsnCode;

  if (!hsn) {
    return { cgst: 0, sgst: 0, igst: 0, total_price: price * item.quantity };
  }

  if (state === 'Gujarat') {
    const cgst = (price * hsn.cgst_rate) / 100;
    const sgst = (price * hsn.sgst_rate) / 100;
    const total_price = parseFloat((price + cgst + sgst).toFixed(2));
    return { cgst, sgst, igst: null, total_price };
  } else if (state) {
    const igst = (price * hsn.igst_rate) / 100;
    const total_price = parseFloat((price + igst).toFixed(2));
    return { cgst: null, sgst: null, igst, total_price };
  }
  return { cgst: 0, sgst: 0, igst: 0, total_price: price * item.quantity };
};
