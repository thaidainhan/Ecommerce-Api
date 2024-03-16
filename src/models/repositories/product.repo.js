"use strict";

const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require("../../utils");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../product.model");

const { Types } = require("mongoose");

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const data = product
    .find(
      {
        isDraft: false,
        isPublished: true,
        $text: {
          $search: regexSearch,
        },
      },
      {
        score: {
          $meta: "textScore",
        },
      }
    )
    .sort({
      score: {
        $meta: "textScore",
      },
    })
    .lean();

  return data;
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const findAllProducts = async ({ filter, limit, sort, page, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const data = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return data;
};
const findOneProduct = async ({ product_id, unSelect }) => {
  const data = await product
    .findById(product_id)
    .select(unGetSelectData(unSelect));

  return data;
};

const updateProductById = async ({
  product_id,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, payload, {
    new: isNew,
  });
};

const getProductById = async (productId) => {
  return await product.findOne({
    _id: convertToObjectIdMongodb(productId)
  }).lean()
};

const checkProductByServer = async (products) => {
  return await Promise.all(products.map( async(product) => {
    const foundProduct = await getProductById(product.productId)
    console.log({foundProduct});
    if(foundProduct){
      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
}




module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findOneProduct,
  updateProductById,
  getProductById,
  checkProductByServer
};
