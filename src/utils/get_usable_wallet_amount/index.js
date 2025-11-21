exports.getUsableWalletAmount = (cartSubtotal, walletAmount) => {
   const maxUsableAmount = cartSubtotal * 0.15; // 15% of cart subtotal
   return Math.min(walletAmount, maxUsableAmount);
};
