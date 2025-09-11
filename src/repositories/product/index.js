const Product = require('../../models/productModel');
const variantModel = require('../../models/variantModel');
const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');
const brandModel = require('../../models/brandModel');

exports.createProduct = async product => {
   const newProduct = await Product.create(product);
   return newProduct;
};

exports.getSingleProduct = async id => {
   const product = await Product.findById(id)
      .populate({ path: 'categoryId', select: 'name _id slug' })
      .populate({ path: 'subCategoryId', select: 'name _id slug' })
      .populate({ path: 'brandId', select: 'name _id slug' })
      .populate({ path: 'breedId', select: 'name _id slug' })
      .populate({ path: 'hsnCode', select: 'hsn_code description _id' });
   return product;
};

exports.getAllProducts = async (
   filters,
   skip = 0,
   limit = 50,
   categorySlug,
   subCategorySlug,
   brandSlug,
   breedSlug,
   sortFilter
) => {
   if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
         filters.categoryId = category._id;
      }
   }

   if (subCategorySlug) {
      const subCategory = await SubCategory.findOne({ slug: subCategorySlug });
      if (subCategory) {
         filters.subCategoryId = subCategory._id;
      }
   }

   if (brandSlug) {
      const brand = await brandModel.findOne({ slug: brandSlug });
      if (brand) {
         filters.brandId = brand._id;
      }
   }

   if (breedSlug) {
      filters.breedId = { $in: breedSlug };
   }

   const [products, total] = await Promise.all([
      Product.find(filters)
         .sort(sortFilter)
         .skip(skip)
         .limit(limit)
         .populate({ path: 'categoryId', select: 'name _id slug' })
         .populate({ path: 'subCategoryId', select: 'name _id slug' })
         .populate({ path: 'brandId', select: 'name _id slug' })
         .populate({ path: 'breedId', select: 'name _id' })
         .populate({ path: 'hsnCode', select: 'name _id' }),
      Product.countDocuments(filters),
   ]);

   const productIds = products.map(product => product._id);
   const variants = await variantModel.find({ productId: { $in: productIds } });

   const variantMap = variants.reduce((acc, variant) => {
      acc[variant.productId] = acc[variant.productId] || [];
      acc[variant.productId].push(variant);
      return acc;
   }, {});

   const enrichedProducts = products.map(product => {
      const variants = variantMap[product._id] || [];
      return {
         ...product._doc,
         variants,
      };
   });

   return { products: enrichedProducts, total };
};

exports.updateProduct = async (id, productData) => {
   const product = await Product.findByIdAndUpdate(id, productData, { new: true });
   return product;
};
