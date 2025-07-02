exports.getTaxForItem = (unitPrice, hsn, state_code, quantity) => {
  const baseAmount = unitPrice * quantity;

  if (!hsn) {
    return { cgst: 0, sgst: 0, igst: 0, totalTax: 0, cess: 0 };
  }

  if (state_code === process.env.HOME_STATE) {
    const cgst = (baseAmount * hsn.cgst_rate) / 100;
    const sgst = (baseAmount * hsn.sgst_rate) / 100;
    let cess = 0;
    if (hsn.cess) {
      cess = (baseAmount * hsn.cess) / 100;
    }
    const totalTax = parseFloat((cgst + sgst + cess).toFixed(2));
    return {
      cgst: parseFloat(cgst.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      igst: null,
      totalTax: parseFloat(totalTax.toFixed(2)),
      cess: parseFloat(cess.toFixed(2)),
    };
  }

  if (state_code) {
    const igst = (baseAmount * hsn.igst_rate) / 100;
    let cess = 0;
    if (hsn.cess) {
      cess = (baseAmount * hsn.cess) / 100;
    }
    const totalTax = parseFloat((igst + cess).toFixed(2));
    return {
      cgst: null,
      sgst: null,
      igst: parseFloat(igst.toFixed(2)),
      totalTax: parseFloat(totalTax.toFixed(2)),
      cess: parseFloat(cess.toFixed(2)),
    };
  }

  return { cgst: 0, sgst: 0, igst: 0, totalTax: 0 };
};
