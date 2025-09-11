const axios = require('axios');
const { getShiprocketToken } = require('../../config/shipRocket');

const PICKUP_PINCODE = '400001';

exports.getEstimatedPrice = async (pincode, weight) => {
   try {
      const token = await getShiprocketToken();

      const response = await axios.get(
         'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
         {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
            params: {
               pickup_postcode: PICKUP_PINCODE,
               delivery_postcode: pincode,
               weight: weight || 0.5,
               cod: 0,
               declared_value: 500,
               mode: 'Surface',
            },
         }
      );

      return {
         statusCode: 200,
         message: 'Estimated price fetched successfully',
         data: response.data,
         success: true,
      };
   } catch (error) {
      console.error('Shiprocket API Error:', error.response?.data || error.message);

      return {
         statusCode: error.response?.status || 500,
         message: 'Shiprocket API Error',
         data: error.response?.data || null,
         success: false,
      };
   }
};

exports.createOrder = async payload => {
   try {
      const token = await getShiprocketToken();
      const response = await axios.post(
         'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
         payload,
         {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         }
      );
      return {
         statusCode: 200,
         message: 'Order created successfully',
         data: response.data,
         success: true,
      };
   } catch (error) {
      console.error('Shiprocket API Error:', error.response?.data || error.message);
      return {
         statusCode: error.response?.status || 500,
         message: 'Shiprocket API Error',
         data: error.response?.data || null,
         success: false,
      };
   }
};

exports.generateShiprocketPickup = async shipmentId => {
   try {
      const token = await getShiprocketToken();
      const response = await axios.post(
         'https://apiv2.shiprocket.in/v1/external/courier/generate/pickup/adhoc',
         { shipment_id: [shipmentId] },
         {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         }
      );

      return {
         statusCode: 200,
         message: 'Pickup generated successfully',
         data: response.data,
         success: true,
      };
   } catch (err) {
      console.error('Pickup Generation Error:', err.response?.data || err.message);
      return {
         statusCode: err.response?.status || 500,
         message: 'Shiprocket API Error',
         data: err.response?.data || null,
         success: false,
      };
   }
};

exports.trackDelivery = async awbId => {
   try {
      const token = await getShiprocketToken();
      const response = await axios.get(
         `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbId}`,
         {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         }
      );
      return {
         statusCode: 200,
         message: 'Delivery tracked successfully',
         data: response.data,
         success: true,
      };
   } catch (error) {
      console.error('Shiprocket API Error:', error.response?.data || error.message);
      return {
         statusCode: error.response?.status || 500,
         message: 'Shiprocket API Error',
         data: error.response?.data || null,
         success: false,
      };
   }
};
