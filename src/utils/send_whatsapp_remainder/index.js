const { default: axios } = require('axios');

exports.sendWhatsAppMessage = async phoneNumber => {
   const response = await axios.post(
      'https://backend.aisensy.com/campaign/t1/api/v2',
      {
         apiKey: process.env.WHATSAPP_API_KEY,
         campaignName: 'ragfarish',
         destination: `91${phoneNumber}`,
         userName: 'PETCAART',
         templateParams: [],
         source: 'new-landing-page form',
         media: {},
         buttons: [],
         carouselCards: [],
         location: {},
         attributes: {},
         paramsFallbackValue: {},
      },
      {
         headers: {
            'Content-Type': 'application/json',
         },
      }
   );
   console.log('WhatsApp API Response:', response.data);
   return {
      success: response.data.success,
   };
};
