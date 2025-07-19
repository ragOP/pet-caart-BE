const Blog = require('../../models/blogModel');
const { uploadSingleFile } = require('../../utils/upload');

exports.createBlog = async (
  title,
  content,
  image,
  slug,
  category,
  isPublished,
  isFeatured,
  tags,
  isBanner,
  description
) => {
  const payload = {
    title,
    content,
    slug,
    category,
    isPublished,
    isFeatured,
    tags,
    isBanner,
    description,
  };
  console.log(image);
  if (image) {
    const imageUrl = await uploadSingleFile(image, 'blog');
    payload.image = imageUrl;
  }
  console.log(payload);
  const blog = await Blog.create(payload);
  if (!blog) {
    return {
      success: false,
      statusCode: 400,
      message: 'Blog creation failed',
      data: null,
    };
  }
  return {
    success: true,
    statusCode: 201,
    message: 'Blog created successfully',
    data: blog,
  };
};

exports.getAllBlogs = async (page, limit, search, category, isPublished, isFeatured, isBanner) => {
  const query = {};
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  if (category) {
    query.category = category;
  }
  if (isPublished) {
    query.isPublished = isPublished;
  }
  if (isFeatured) {
    query.isFeatured = isFeatured;
  }
  if (isBanner) {
    query.isBanner = isBanner;
  }
  const blogs = await Blog.find(query)
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Blog.countDocuments(query);
  return {
    success: true,
    statusCode: 200,
    message: 'Blogs fetched successfully',
    data: {
      blogs,
      total,
    },
  };
};

exports.getSingleBlog = async id => {
  const blog = await Blog.findById(id);
  if (!blog) {
    return {
      success: false,
      statusCode: 404,
      message: 'Blog not found',
      data: null,
    };
  }
  return {
    success: true,
    statusCode: 200,
    message: 'Blog fetched successfully',
    data: blog,
  };
};

exports.deleteBlog = async id => {
  const blog = await Blog.findById(id);
  if (!blog) {
    return {
      success: false,
      statusCode: 404,
      message: 'Blog not found',
      data: null,
    };
  }
  await Blog.findByIdAndDelete(id);
  return {
    success: true,
    statusCode: 200,
    message: 'Blog deleted successfully',
    data: blog,
  };
};

exports.updateBlog = async (
  id,
  title,
  content,
  image,
  slug,
  category,
  isPublished,
  isFeatured,
  tags,
  isBanner,
  description
) => {
  let payload = {};
  const blog = await Blog.findById(id);
  if (!blog) {
    return {
      success: false,
      statusCode: 404,
      message: 'Blog not found',
      data: null,
    };
  }
  payload = {
    title,
    content,
    slug,
    category,
    isPublished,
    isFeatured,
    tags,
    isBanner,
    description,
  };
  if (image) {
    const imageUrl = await uploadSingleFile(image, 'blog');
    payload.image = imageUrl;
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, payload, { new: true });
  return {
    success: true,
    statusCode: 200,
    message: 'Blog updated successfully',
    data: updatedBlog,
  };
};

exports.youMayLike = async tags => {
  const blogs = await Blog.find({ tags: { $in: tags } }).limit(8);
  return {
    success: true,
    statusCode: 200,
    message: 'Blogs fetched successfully',
    data: blogs,
  };
};

exports.getLatestBlogs = async () => {
  const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).limit(8);
  return {
    success: true,
    statusCode: 200,
    message: 'Blogs fetched successfully',
    data: blogs,
  };
};