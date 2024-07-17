const prisma = require("../lib/prisma");
const generateSlug = require("../lib/slug");
const multer = require("multer");

const findAll = async (params, isAdmin = false) => {
  const { page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;
  const where = isAdmin ? {} : { status: "active" };

  const totalItems = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    skip,
    take: limit,
    where,
  });

  if (!products || products === null) {
    throw { name: "notFound", message: "Failed to get data products" };
  }

  return {
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    products,
  };
};

const findOne = async (slug, isAdmin = false) => {
  const where = isAdmin ? { slug } : { slug, status: "active" };
  const product = await prisma.product.findUnique({ where });

  if (!product) {
    throw { name: "notFound", message: "Product not found" };
  }

  return product;
};

const findByCategory = async (categoryId) => {
  const products = await prisma.product.findMany({
    where: {
      category_id: parseInt(categoryId),
      status: "active",
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!products) {
    throw {
      name: "notFound",
      message: "Failed to get data products by category",
    };
  }

  return products;
};

const create = async (data, file, err) => {
  if (err instanceof multer.MulterError || err) {
    throw new Error(err.message);
  }

  const slug = generateSlug(data.name);
  const newProduct = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      weight: parseInt(data.weight),
      sku: data.sku,
      status: data.status,
      category_id: parseInt(data.category_id),
      slug: slug,
      photo: file ? `../assets/products${file.filename}` : null,
    },
  });

  if (!newProduct) {
    throw { name: "failedToCreate", message: "Failed create product" };
  }

  if (file) {
    newProduct.photoUrl = `http://localhost:8080/assets/products/${file.filename}`;
  }

  return newProduct;
};

const update = async (slug, data, file, err) => {
  if (err instanceof multer.MulterError || err) {
    throw new Error(err.message);
  }

  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (!existingProduct) {
    throw { name: "notFound", message: "Product not found" };
  }

  const updatedProduct = await prisma.product.update({
    where: { slug },
    data: {
      name: data.name || existingProduct.name,
      description: data.description || existingProduct.description,
      price: data.price !== undefined ? data.price : existingProduct.price,
      weight:
        data.weight !== undefined
          ? parseInt(data.weight)
          : existingProduct.weight,
      sku: data.sku || existingProduct.sku,
      status: data.status || existingProduct.status,
      category_id:
        data.category_id !== undefined
          ? parseInt(data.category_id)
          : existingProduct.category_id,
      photo: file ? `../assets/products${file.filename}` : existingProduct.photo,
    },
  });

  if (!updatedProduct) {
    throw { name: "failedToUpdate", message: "Failed update product" };
  }

  if (file) {
    updatedProduct.photoUrl = `http://localhost:8080/assets/products/${file.filename}`;
  }

  return updatedProduct;
};

const softDelete = async (slug) => {
  if (!slug) {
    throw { name: "invalidInput", message: "Slug required" };
  }

  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (!existingProduct) {
    throw { name: "notFound", message: "Product not found" };
  }

  const updatedProduct = await prisma.product.update({
    where: { slug },
    data: {
      status: "inactive", // Mengubah status menjadi inactive
    },
  });

  if (!updatedProduct) {
    throw { name: "failedToDelete", message: "Failed delete product" };
  }
};


const returnSoftDelete = async (slug) => {
  if (!slug) {
    throw { name: "invalidInput", message: "Slug required" };
  }

  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (!existingProduct) {
    throw { name: "notFound", message: "Product not found" };
  }

  const updatedProduct = await prisma.product.update({
    where: { slug },
    data: {
      status: "active", // Mengubah status menjadi inactive
    },
  });

  if (!updatedProduct) {
    throw { name: "failedToUpdate", message: "Failed update product" };
  }

};

module.exports = {
  findOne,
  findAll,
  findByCategory,
  create,
  update,
  softDelete,
  returnSoftDelete,
};
