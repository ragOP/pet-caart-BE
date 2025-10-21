const orderModel = require('../../models/orderModel');
const userModel = require('../../models/userModel');

exports.getMonthlyStats = async () => {
   const today = new Date();
   const monthStart = new Date(today);
   monthStart.setDate(today.getDate() - 29);
   const orders = await orderModel.aggregate([
      {
         $match: {
            createdAt: {
               $gte: monthStart,
               $lte: today,
            },
         },
      },
      {
         $addFields: {
            weekOfMonth: {
               $ceil: {
                  $divide: [{ $dayOfMonth: '$createdAt' }, 7],
               },
            },
         },
      },
      {
         $group: {
            _id: '$weekOfMonth',
            totalSales: { $sum: '$totalAmount' },
         },
      },
      {
         $sort: { _id: 1 },
      },
      {
         $project: {
            _id: 0,
            week: { $concat: ['W', { $toString: '$_id' }] },
            totalSales: { $round: ['$totalSales', 2] },
         },
      },
   ]);

   const result = [];
   for (let i = 1; i <= 4; i++) {
      const existing = orders.find(o => o.week === `W${i}`);
      result.push({
         week: `W${i}`,
         totalSales: existing ? existing.totalSales : 0,
      });
   }

   return {
      success: true,
      data: result,
      message: 'Monthly stats fetched successfully',
      statusCode: 200,
   };
};

exports.getCustomerStats = async () => {
   const today = new Date();
   const monthStart = new Date(today);
   monthStart.setDate(today.getDate() - 29);
   const customers = await userModel.aggregate([
      {
         $match: {
            createdAt: {
               $gte: monthStart,
               $lte: today,
            },
         },
      },
      {
         $addFields: {
            weekOfMonth: {
               $ceil: {
                  $divide: [{ $dayOfMonth: '$createdAt' }, 7],
               },
            },
         },
      },
      {
         $group: {
            _id: '$weekOfMonth',
            totalCustomers: { $sum: 1 },
         },
      },
      {
         $sort: { _id: 1 },
      },
      {
         $project: {
            _id: 0,
            week: { $concat: ['W', { $toString: '$_id' }] },
            totalCustomers: { $round: ['$totalCustomers', 2] },
         },
      },
   ]);

   const result = [];
   for (let i = 1; i <= 4; i++) {
      const existing = customers.find(c => c.week === `W${i}`);
      result.push({
         week: `W${i}`,
         totalCustomers: existing ? existing.totalCustomers : 0,
      });
   }
   return {
      success: true,
      data: result,
      message: 'Customer stats fetched successfully',
      statusCode: 200,
   };
};

exports.getGrowthRate = async (months = 12) => {
   // Yet to be implemented
};

exports.getTopCategories = async () => {
   const topCategories = await orderModel.aggregate([
      { $unwind: '$items' },
      {
         $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'items.product',
         },
      },
      { $unwind: '$items.product' },
      {
         $group: {
            _id: '$items.product.categoryId',
            totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
         },
      },
      {
         $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category',
         },
      },
      { $unwind: '$category' },
      {
         $project: {
            _id: 0,
            categoryId: '$_id',
            categoryName: '$category.name',
            totalSales: 1,
         },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
   ]);

   return {
      success: true,
      data: topCategories,
      message: 'Top categories fetched successfully',
      statusCode: 200,
   };
};

exports.getTopSubCategories = async () => {
   const topSubCategories = await orderModel.aggregate([
      { $unwind: '$items' },
      {
         $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'items.product',
         },
      },
      { $unwind: '$items.product' },
      {
         $group: {
            _id: '$items.product.subCategoryId',
            totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
         },
      },
      {
         $lookup: {
            from: 'subcategories',
            localField: '_id',
            foreignField: '_id',
            as: 'subCategory',
         },
      },
      { $unwind: '$subCategory' },
      {
         $project: {
            _id: 0,
            subCategoryId: '$_id',
            subCategoryName: '$subCategory.name',
            totalSales: 1,
         },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
   ]);

   return {
      success: true,
      data: topSubCategories,
      message: 'Top subcategories fetched successfully',
      statusCode: 200,
   };
};

exports.getTopProducts = async () => {
   const topProducts = await orderModel.aggregate([
      { $unwind: '$items' },
      {
         $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'items.product',
         },
      },
      { $unwind: '$items.product' },
      {
         $group: {
            _id: '$items.productId',
            totalStockSold: { $sum: '$items.quantity' },
         },
      },
      {
         $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
         },
      },
      { $unwind: '$product' },
      {
         $project: {
            _id: 0,
            productId: '$_id',
            productName: '$product.title',
            totalStockSold: 1,
         },
      },
      { $sort: { totalStockSold: -1 } },
      { $limit: 5 },
   ]);

   return {
      success: true,
      data: topProducts,
      message: 'Top products fetched successfully',
      statusCode: 200,
   };
};

exports.getTotalSales = async () => {
   const today = new Date();
   const startMonth = new Date(today.getFullYear(), today.getMonth() - 11, 1);

   const orders = await orderModel.aggregate([
      {
         $match: {
            createdAt: { $gte: startMonth, $lte: today },
         },
      },
      {
         $addFields: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
         },
      },
      {
         $group: {
            _id: { year: '$year', month: '$month' },
            totalSales: { $sum: '$totalAmount' },
         },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
         $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            totalSales: { $round: ['$totalSales', 2] },
         },
      },
   ]);

   const result = [];
   for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
      const existing = orders.find(o => o.year === d.getFullYear() && o.month === d.getMonth() + 1);
      result.push({
         year: d.getFullYear(),
         month: `M${i + 1}`,
         totalSales: existing ? existing.totalSales : 0,
      });
   }

   return {
      success: true,
      data: result,
      message: 'Yearly stats fetched successfully',
      statusCode: 200,
   };
};
