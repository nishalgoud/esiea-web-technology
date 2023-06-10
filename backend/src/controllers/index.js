// Import all the functions from individual files
const { getUsers, registerUser, loginUser } = require('./user');
const { getImages , createImage, uploadImage} = require('./image')


// Export all the functions
module.exports = {
  getUsers,
  registerUser,
  loginUser,
  getImages,
  createImage,
  uploadImage
};