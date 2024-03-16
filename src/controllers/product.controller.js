"use strict";

const { Created, OK } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new Created({
      message: "Create new product success!",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  updateProduct = async (req, res, next) => {
    new Created({
      message: "Update Product success!",
      metadata: await ProductFactory.updateProduct(
        req.body.product_type, 
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        },
        
      ),
    }).send(res);
  };
  /**
   * @desc get All Drafts for shop
   *
   * @param {ObjectId} product_shop
   * @param {Number} limit
   * @param {Number} skip
   *
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: "Get all drafts for shop success!",
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
        limit: req.body.limit,
        skip: req.body.skip,
      }),
    }).send(res);
  };

  /**
   * @desc get All Published for shop
   *
   * @param {ObjectId} product_shop
   * @param {Number} limit
   * @param {Number} skip
   *
   * @return {JSON}
   */
  getAllPublishedForShop = async (req, res, next) => {
    new OK({
      message: "Get all drafts for shop success!",
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
        limit: req.body.limit,
        skip: req.body.skip,
      }),
    }).send(res);
  };

  /**
   * @desc search products
   *
   * @param {String} keySearch
   *
   * @return {JSON}
   */
  getListSearchProduct = async (req, res, next) => {
    new OK({
      message: "Search Product Success!",
      metadata: await ProductFactory.searchProducts({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };

  /**
   * @desc search products
   *
   * @param {String} keySearch
   *
   * @return {JSON}
   */
  getListProduct = async (req, res, next) => {
    new OK({
      message: "get list Products Success!",
      metadata: await ProductFactory.findAllProducts(req.params),
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    new OK({
      message: "get  Product Success!",
      metadata: await ProductFactory.findOneProduct({
        product_id: req.params.product_id
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new Created({
      message: "Publish success!",
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new Created({
      message: "UnPublish success!",
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };
}
module.exports = new ProductController();
