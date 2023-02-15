const CustomError = require("../error/customError");
const ProductService = require("../services/product");
const { StatusCodes } = require("http-status-codes");
const { success } = require("../helpers/responseApi");

const getProducts = async (req, res) => {
  const query = req.query;
  const products = await ProductService.getProducts({ ...query });

  res.status(StatusCodes.OK).json(success(StatusCodes.OK, { products }));
};

const getProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await ProductService.getProduct(productId);
  if (!product) {
    throw new CustomError("Not found", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(success(StatusCodes.OK, { product }));
};

const createProduct = async (req, res) => {
  const currentUser = req.user;
  if (!currentUser || !currentUser.hasPermission("edit-product")) {
    throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  const { name, description, additionalInfo, tags, quantity, price } = req.body;
  const product = await ProductService.createProduct({
    name,
    description,
    additionalInfo,
    tags,
    quantity,
    price,
  });

  if (!product) {
    throw new CustomError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  res
    .status(StatusCodes.CREATED)
    .json(success(StatusCodes.CREATED, { product }));
};

const updateProduct = async (req, res) => {
  const currentUser = req.user;
  if (!currentUser || !currentUser.hasPermission("edit-product")) {
    throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }
  const { productId } = req.params;
  const { productData } = req.body;

  const product = await ProductService.updateProduct(productId, {
    ...productData,
  });

  if (!product) {
    throw new CustomError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  res.status(StatusCodes.OK).send();
};

const deleteProduct = async (req, res) => {
  const currentUser = req.user;
  if (!currentUser || !currentUser.hasPermission("edit-product")) {
    throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }
  const { productId } = req.params;

  const product = await ProductService.deleteProduct(productId);
  if (!product) {
    throw new CustomError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  res.status(StatusCodes.OK).send();
};

const getReviews = async (req, res) => {
  const { productId } = req.params;
  const reviews = await ProductService.getReviews(productId);

  res.status(StatusCodes.OK).json(success(StatusCodes.OK, { reviews }));
};

const addReview = async (req, res) => {
  const currentUser = req.user;
  const { productId } = req.params;
  const review = await ProductService.getReview(productId, currentUser.id);
  if (review) {
    throw new CustomError("Review already exists", StatusCodes.CONFLICT);
  }
  const { rating, summary } = req.body;
  const product = await ProductService.addReview(productId, currentUser.id, {
    rating,
    summary,
  });
  if (!product) {
    throw new CustomError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  res
    .status(StatusCodes.CREATED)
    .json(success(StatusCodes.CREATED, { product }));
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getReviews,
  addReview,
};
