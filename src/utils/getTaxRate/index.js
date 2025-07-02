exports.getTaxForItem = (unitPrice, hsn, state, quantity) => {
  const baseAmount = unitPrice * quantity;

  if (!hsn) {
    return { cgst: 0, sgst: 0, igst: 0, totalTax: 0 };
  }

  if (state === 'Gujarat') {
    const cgst = (baseAmount * hsn.cgst_rate) / 100;
    const sgst = (baseAmount * hsn.sgst_rate) / 100;
    const totalTax = parseFloat((cgst + sgst).toFixed(2));
    return { cgst, sgst, igst: null, totalTax };
  }

  if (state) {
    const igst = (baseAmount * hsn.igst_rate) / 100;
    const totalTax = parseFloat(igst.toFixed(2));
    return { cgst: null, sgst: null, igst, totalTax };
  }

  return { cgst: 0, sgst: 0, igst: 0, totalTax: 0 };
};
