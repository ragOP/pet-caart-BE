const {
   getMonthlyStats,
   getCustomerStats,
   getGrowthRate,
   getTopCategories,
   getTopSubCategories,
   getTopProducts,
   getTotalSales,
} = require('../../services/stats');
const ApiResponse = require('../../utils/apiResponse');

exports.handleGetMonthlyStats = async (req, res) => {
   const result = await getMonthlyStats();
   if (!result) {
      return res
         .status(200)
         .json(new ApiResponse(500, null, 'Failed to fetch monthly stats', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Monthly stats fetched successfully', true));
};

exports.handleGetCustomerStats = async (req, res) => {
   const result = await getCustomerStats();
   if (!result) {
      return res
         .status(200)
         .json(new ApiResponse(500, null, 'Failed to fetch customer stats', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Customer stats fetched successfully', true));
};

exports.handleGetGrowthRate = async (req, res) => {
   const result = await getGrowthRate();
   if (!result) {
      return res
         .status(200)
         .json(new ApiResponse(500, null, 'Failed to fetch growth rate stats', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result, 'Growth rate stats fetched successfully', true));
};

exports.handleGetTopCategories = async (req, res) => {
   const result = await getTopCategories();
   if (!result) {
      return res
         .status(200)
         .json(new ApiResponse(500, null, 'Failed to fetch top categories stats', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Top categories stats fetched successfully', true));
};

exports.handleGetTopSubCategories = async (req, res) => {
   const result = await getTopSubCategories();
   if (!result) {
      return res
         .status(200)
         .json(new ApiResponse(500, null, 'Failed to fetch top subcategories stats', false));
   }
   return res
      .status(200)
      .json(
         new ApiResponse(200, result.data, 'Top subcategories stats fetched successfully', true)
      );
};

exports.handleGetTopProducts = async (req, res) => {
   const result = await getTopProducts();
   if (!result) {
      return res
         .status(200)
         .json(new ApiResponse(500, null, 'Failed to fetch top products stats', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Top products stats fetched successfully', true));
};

exports.handleGetTotalSales = async (req, res) => {
   const result = await getTotalSales();
   if (!result) {
      return res
         .status(200)
         .json(new ApiResponse(500, null, 'Failed to fetch total sales stats', false));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, result.data, 'Total sales stats fetched successfully', true));
};
