const asyncHandler = require("express-async-handler");

const Image = require("../models/Image");

const getImages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  if(page < 1){
     res.status(400);
     throw new Error("Page must be at least 1");
  } 
  const limit = parseInt(req.query.limit) || 10;
  if(limit < 1){
    res.status(400);
    throw new Error("Limit must be at least 1");
  } 
  const skipIndex = (page - 1) * limit;
  const sortField = req.query.sort || 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;
  const selectFields = req.query.select ? req.query.select.split(',') : [];

  const userFilter = req.query.user ? { user: req.query.user } : { user : req.user._id};

  // Create a filter object with all query parameters, set regex to allow partial matching
  let filter = Object.entries(req.query).reduce((acc, [key, value]) => {
    if (['page', 'limit', 'sort', 'order', 'select', 'search'].includes(key)) {
      return acc;
    }
    return { ...acc, [key]: { $regex: new RegExp(value, 'i') } };
  }, userFilter);

  // If a search string is provided, construct a query to search across all string fields
  if(req.query.search) {
    filter = {
      $or: [
        { name: { $regex: new RegExp(req.query.search, 'i') } },
        { description: { $regex: new RegExp(req.query.search, 'i') } },
        { url: { $regex: new RegExp(req.query.search, 'i') } }, // include url in search across all fields
        // Add any other fields you want to search on
      ],
      ...filter
    };
  }

  const [totalDocuments, images] = await Promise.all([
    Image.countDocuments(filter),
    Image.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skipIndex)
      .limit(limit)
      .select(selectFields)
  ]);

  const totalPages = Math.ceil(totalDocuments / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;

  if (page > totalPages) {
     res.status(404);
     throw new Error('Page does not exist');
  }

  res.status(200).json({
    totalItems: totalDocuments,
    currentPage: page,
    pageSize: images.length,
    totalPages: totalPages,
    hasNextPage: hasNextPage,
    nextPage: nextPage,
    hasPrevPage: hasPrevPage,
    prevPage: prevPage,
    items: images
  });
});


const createImage = asyncHandler(async (req, res) => {
  const { name, description,  url } = req.body;
  if (!name || !url) {
    res.status(400);
    throw new Error("Please add all the required fields");
  }
  const image = new Image({
    name,
    url,
    description,
    user: req.user._id,
  });
  await image.save();
  res.status(201).json({ success: true, _id: image._id });
});

const uploadImage = asyncHandler(async (req, res) => {
  const { name, description,  url } = req.body;
  if (!name || !url) {
    res.status(400);
    throw new Error("Please add all the required fields");
  }
  const image = new Image({
    name,
    url,
    description,
    user: req.user._id,
  });
  await image.save();
  res.status(201).json({ success: true, _id: image._id });
});

module.exports = {
  getImages,
  createImage,
  uploadImage
};
