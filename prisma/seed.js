const axios = require("axios");
const prisma = require("../lib/prisma.js");
const bcrypt = require("../lib/bcrypt.js");
const generateSlug = require("../lib/slug.js");

async function main() {
  const apiKey = process.env.RAJAONGKIR_SECRET_KEY;
  const apiUrl = "https://api.rajaongkir.com/starter";

  // Fetch and seed provinces
  let provinces = await axios.get(`${apiUrl}/province`, {
    headers: { key: apiKey },
  });

  provinces = provinces.data.rajaongkir.results.map((province) => {
    return { id: +province.province_id, name: province.province };
  });

  await prisma.province.createMany({ data: provinces });
  console.log("Province seeding success");

  // Fetch and seed cities
  let cities = await axios.get(`${apiUrl}/city`, {
    headers: { key: apiKey },
  });

  cities = cities.data.rajaongkir.results.map((city) => {
    return {
      id: +city.city_id,
      name: city.city_name,
      province_id: +city.province_id,
    };
  });

  await prisma.city.createMany({ data: cities });
  console.log("City seeding success");

  // Seed categories
  const categories = [
    { name: "Fashion" },
    { name: "Food" },
    { name: "Healthy" },
    { name: "Toys" },
    { name: "Feeding" },
    { name: "Equipment" },
  ];

  await prisma.category.createMany({ data: categories });
  console.log("Category seeding success");

  // Seed products
  const products = [
    {
      name: "Product 1",
      description: "Description for product 1",
      price: 10000,
      photo: "https://example.com/product1.jpg",
      weight: 100,
      sku: "SKU1",
      category_id: 1,
      slug: generateSlug("Product 1"),
    },
    {
      name: "Product 2",
      description: "Description for product 2",
      price: 20000,
      photo: "https://example.com/product2.jpg",
      weight: 200,
      sku: "SKU2",
      category_id: 2,
      slug: generateSlug("Product 2"),
    },
    {
      name: "Product 3",
      description: "Description for product 3",
      price: 30000,
      photo: "https://example.com/product3.jpg",
      weight: 300,
      sku: "SKU3",
      category_id: 3,
      slug: generateSlug("Product 3"),
    },
    {
      name: "Product 4",
      description: "Description for product 4",
      price: 40000,
      photo: "https://example.com/product4.jpg",
      weight: 400,
      sku: "SKU4",
      category_id: 4,
      slug: generateSlug("Product 4"),
    },
    {
      name: "Product 5",
      description: "Description for product 5",
      price: 50000,
      photo: "https://example.com/product5.jpg",
      weight: 500,
      sku: "SKU5",
      category_id: 5,
      slug: generateSlug("Product 5"),
    },
    {
      name: "Product 6",
      description: "Description for product 6",
      price: 60000,
      photo: "https://example.com/product6.jpg",
      weight: 600,
      sku: "SKU6",
      category_id: 6,
      slug: generateSlug("Product 6"),
    },
    {
      name: "Product 7",
      description: "Description for product 7",
      price: 70000,
      photo: "https://example.com/product7.jpg",
      weight: 700,
      sku: "SKU7",
      category_id: 1,
      slug: generateSlug("Product 7"),
    },
    {
      name: "Product 8",
      description: "Description for product 8",
      price: 80000,
      photo: "https://example.com/product8.jpg",
      weight: 800,
      sku: "SKU8",
      category_id: 2,
      slug: generateSlug("Product 8"),
    },
    {
      name: "Product 9",
      description: "Description for product 9",
      price: 90000,
      photo: "https://example.com/product9.jpg",
      weight: 900,
      sku: "SKU9",
      category_id: 3,
      slug: generateSlug("Product 9"),
    },
    {
      name: "Product 10",
      description: "Description for product 10",
      price: 100000,
      photo: "https://example.com/product10.jpg",
      weight: 1000,
      sku: "SKU10",
      category_id: 4,
      slug: generateSlug("Product 10"),
    },
    {
      name: "Product 11",
      description: "Description for product 11",
      price: 110000,
      photo: "https://example.com/product11.jpg",
      weight: 1100,
      sku: "SKU11",
      category_id: 5,
      slug: generateSlug("Product 11"),
    },
    {
      name: "Product 12",
      description: "Description for product 12",
      price: 120000,
      photo: "https://example.com/product12.jpg",
      weight: 1200,
      sku: "SKU12",
      category_id: 6,
      slug: generateSlug("Product 12"),
    },
    {
      name: "Product 13",
      description: "Description for product 13",
      price: 130000,
      photo: "https://example.com/product13.jpg",
      weight: 1300,
      sku: "SKU13",
      category_id: 1,
      slug: generateSlug("Product 13"),
    },
    {
      name: "Product 14",
      description: "Description for product 14",
      price: 140000,
      photo: "https://example.com/product14.jpg",
      weight: 1400,
      sku: "SKU14",
      category_id: 2,
      slug: generateSlug("Product 14"),
    },
    {
      name: "Product 15",
      description: "Description for product 15",
      price: 150000,
      photo: "https://example.com/product15.jpg",
      weight: 1500,
      sku: "SKU15",
      category_id: 3,
      slug: generateSlug("Product 15"),
    },
  ];

  await prisma.product.createMany({ data: products });
  console.log("Product seeding success");

  // Seed users

  const hashedPasswordUser1 = await bcrypt.hashPassword("userpass");

  const user = await prisma.user.create({
    data: {
      email: "mahen@gmail.com",
      username: "Mahen",
      password: hashedPasswordUser1,
      role: "user",
      phone_number: "+628123456789",
      address: "Jl. Contoh No. 1",
      province_id: 1,
      city_id: 1,
      zip_code: 12345,
      photo: "https://example.com/user1.jpg",
    },
  });

  const hashedPasswordAdmin = await bcrypt.hashPassword("adminpass");

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      username: "AdminUser",
      password: hashedPasswordAdmin,
      role: "admin",
      phone_number: "+628987654321",
      address: "Jl. Admin No. 1",
      province_id: 2,
      city_id: 3,
      zip_code: 54321,
      photo: "https://example.com/admin.jpg",
    },
  });

  console.log("User seeding success");

  // Seed warehouses
  const warehouses = [
    {
      name: "Warehouse 1",
      city_id: 1,
      province_id: 1,
      address: "Jln. Rakamin No.1",
      zip_code: 54321,
    },
    {
      name: "Warehouse 2",
      city_id: 2,
      province_id: 2,
      address: "Jln. Rakamin No.2",
      zip_code: 54321,
    },
    {
      name: "Warehouse 3",
      city_id: 3,
      province_id: 3,
      address: "Jln. Rakamin No.3",
      zip_code: 54321,
    },
    {
      name: "Warehouse 4",
      city_id: 4,
      province_id: 4,
      address: "Jln. Rakamin No.4",
      zip_code: 54321,
    },
    {
      name: "Warehouse 5",
      city_id: 5,
      province_id: 5,
      address: "Jln. Rakamin No.5",
      zip_code: 54321,
    },
    {
      name: "Warehouse 6",
      city_id: 6,
      province_id: 6,
      address: "Jln. Rakamin No.6",
      zip_code: 54321,
    },
    {
      name: "Warehouse 7",
      city_id: 7,
      province_id: 7,
      address: "Jln. Rakamin No.7",
      zip_code: 54321,
    },
    {
      name: "Warehouse 8",
      city_id: 8,
      province_id: 8,
      address: "Jln. Rakamin No.8",
      zip_code: 54321,
    },
    {
      name: "Warehouse 9",
      city_id: 9,
      province_id: 9,
      address: "Jln. Rakamin No.9",
      zip_code: 54321,
    },
    {
      name: "Warehouse 10",
      city_id: 10,
      province_id: 10,
      address: "Jln. Rakamin No.10",
      zip_code: 54321,
    },
  ];

  await prisma.warehouse.createMany({ data: warehouses });
  console.log("Warehouse seeding success");

  // Seed Product_Warehouse
  const productWarehouseData = [
    { product_id: 1, warehouse_id: 1, stock: 50 },
    { product_id: 2, warehouse_id: 2, stock: 60 },
    { product_id: 3, warehouse_id: 3, stock: 70 },
    { product_id: 4, warehouse_id: 4, stock: 80 },
    { product_id: 5, warehouse_id: 5, stock: 90 },
    { product_id: 6, warehouse_id: 6, stock: 100 },
  ];

  await prisma.product_Warehouse.createMany({ data: productWarehouseData });
  console.log("Product_Warehouse seeding success");

  // Seed carts
  const carts = [
    {
      user_id: 1,
      warehouse_id: 1,
      shipping_cost: 10000,
      total_price: 50000,
      net_price: 40000,
      shipping_method: "Standard",
      courier: "JNE",
    },
    {
      user_id: 1,
      warehouse_id: 2,
      shipping_cost: 15000,
      total_price: 60000,
      net_price: 45000,
      shipping_method: "Standard",
      courier: "JNE",
    },
    {
      user_id: 1,
      warehouse_id: 3,
      shipping_cost: 20000,
      total_price: 70000,
      net_price: 50000,
      shipping_method: "Standard",
      courier: "JNE",
    },
  ];

  await prisma.cart.createMany({ data: carts });
  console.log("Cart seeding success");

  // Seed cart items
  const cartItems = [
    {
      cart_id: 1,
      product_id: 1,
      quantity: 2,
      price: 10000,
    },
    {
      cart_id: 2,
      product_id: 2,
      quantity: 3,
      price: 20000,
    },
    {
      cart_id: 3,
      product_id: 3,
      quantity: 4,
      price: 30000,
    },
    {
      cart_id: 1,
      product_id: 4,
      quantity: 1,
      price: 40000,
    },
    {
      cart_id: 2,
      product_id: 5,
      quantity: 2,
      price: 50000,
    },
  ];

  await prisma.cart_items.createMany({ data: cartItems });
  console.log("Cart items seeding success");

  // Seed orders
  const orders = [
    {
      user_id: 1,
      warehouse_id: 1,
      shipping_cost: 10000,
      payment_method: "Credit Card",
      total_price: 50000,
      net_price: 40000,
      shipping_method: "Standard",
      courier: "JNE",
      status: "pending",
    },
    {
      user_id: 1,
      warehouse_id: 2,
      shipping_cost: 15000,
      payment_method: "Credit Card",
      total_price: 60000,
      net_price: 45000,
      shipping_method: "Standard",
      courier: "JNE",
      status: "pending",
    },
  ];

  await prisma.orders.createMany({ data: orders });
  console.log("Order seeding success");

  // Seed order products
  const orderProducts = [
    {
      order_id: 1,
      product_id: 1,
      quantity: 2,
      price: 10000,
    },
    {
      order_id: 2,
      product_id: 2,
      quantity: 3,
      price: 20000,
    },
  ];

  await prisma.order_products.createMany({ data: orderProducts });
  console.log("Order products seeding success");

  process.exit();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
