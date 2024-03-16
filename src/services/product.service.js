"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { createNoti } = require("../models/repositories/notification.repo");
const {
  findAllProducts,
  findOneProduct,
  searchProductsByUser,
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const NotificationService = require("./notification.service");

// * Factory Pattern ****************************************************************

// Todo: Define class to create product
class ProductFactory {
  /*
        type: 'Clothing',
        payload
  */

  //  key - class
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Types ${type}`);
    }

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Types ${type}`);
    }

    return new productClass(payload).updateProduct(product_id);
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: true,
    };
    return await findAllDraftsForShop({
      query,
      skip,
      limit,
    });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isPublished: true,
    };
    return await findAllPublishForShop({
      query,
      skip,
      limit,
    });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({
      product_shop,
      product_id,
    });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({
      product_shop,
      product_id,
    });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({
      keySearch: keySearch,
    });
  }

  static async findAllProducts({
    limit = 50,
    page = 1,
    filter = { isPublished: true },
    sort = "ctime",
  }) {
    return await findAllProducts({
      limit,
      page,
      filter,
      sort,
      select: ["product_name", "product_thumb", "product_price"],
    });
  }
  static async findOneProduct({ product_id }) {
    return await findOneProduct({
      product_id: product_id,
      unSelect: ["_v"],
    });
  }
}

// Todo: Define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_type = product_type;
    this.product_quantity = product_quantity;
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await product.create({
      ...this,
      _id: product_id,
    });

    if (newProduct) {
      await insertInventory({
        inventory_productId: newProduct._id,
        inventory_shopId: this.product_shop,
        inventory_stock: this.product_quantity,
      });

      await NotificationService.pushNotiToSystem({
        type: "SHOP-001",
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      });
    }

    return newProduct;
  }

  async updateProduct(product_id, payload) {
    return await updateProductById({ product_id, payload, model: product });
  }
}
// Todo: Define sub-class for diffrent product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      throw new BadRequestError("Create new clothing failed");
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product failed");
    }

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attributes) {
      // Update child
      await updateProductById({
        product_id,
        payload: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// Todo: Define sub-class for diffrent product types Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Create new Electronic failed");
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product failed");
    }

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attributes) {
      // Update child
      await updateProductById({
        product_id,
        payload: updateNestedObjectParser(objectParams.product_attributes),
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// Todo: Define sub-class for diffrent product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("Create new Electronic failed");
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product failed");
    }

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attributes) {
      // Update child
      await updateProductById({
        product_id,
        payload: updateNestedObjectParser(objectParams.product_attributes),
        model: furniture,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// register product type
ProductFactory.registerProductType("Electronic", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
