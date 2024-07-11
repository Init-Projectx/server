const axios = require("axios");
const prisma = require("../lib/prisma.js");
const bcrypt = require("../lib/bcrypt.js");
const generateSlug = require("../lib/slug.js");

async function main() {   

   // Menghapus semua data dari tabel Province
   await prisma.province.deleteMany();

   // Menghapus semua data dari tabel City
   await prisma.city.deleteMany();
 
   // Menghapus semua data dari tabel Product
   await prisma.product.deleteMany();
 
   // Menghapus semua data dari tabel User
   await prisma.user.deleteMany();

  const apiKey = process.env.RAJAONGKIR_SECRET_KEY;
  console.log("SECRET Key:", apiKey);

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

  const createdCategories = await prisma.category.createMany({
    data: categories,
  });
  console.log("Category seeding success");

  // Seed products with random category_id and slug
  const products = Array.from({ length: 15 }).map((_, index) => ({
    name: `Product ${index + 1}`,
    description: `Description for product ${index + 1}`,
    price: (index + 1) * 10000,
    photo: `https://example.com/product${index + 1}.jpg`,
    weight: (index + 1) * 100,
    sku: `SKU${index + 1}`,
    category_id: 3, // Replace with a random category_id
    slug: generateSlug(`Product ${index + 1}`),
  }));

  await prisma.product.createMany({ data: products });
  console.log("Product seeding success");

  // Seed users

  const hashedPasswordUser = await bcrypt.hashPassword("password123");

  const user = await prisma.user.create({
    data: {
      email: "mahen@gmail.com",
      username: "Mahen",
      password: hashedPasswordUser,
      role: "user",
      phone_number: "+628123456789",
      address: "Jl. Contoh No. 1",
      province_id: 1,
      city_id: 1,
      zip_code: 12345,
      photo: "https://example.com/user1.jpg",
    },
  });

  const hashedPasswordAdmin = await bcrypt.hashPassword("adminpassword123");

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
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 2",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 3",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 4",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 5",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 6",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 7",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 8",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 9",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    },
    {
      name: "Warehouse 10",
      city_id: 1,
      province_id: 21,
      address: "Jln. Rakamin No.1",
      zip_code: 54321
    }
  ];
  
  // Save warehouses to database
  await prisma.warehouse.createMany({
    data: warehouses
  });
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
  const users = await prisma.user.findMany();

  const carts = Array.from({ length: 3 }).map((_, index) => ({
    user_id: 1,
    warehouse_id: 1,
    shipping_cost: (index + 1) * 5000,
    total_price: (index + 1) * 20000,
    net_price: (index + 1) * 15000,
    shipping_method: "Standard",
    courier: "JNE",
  }));

  await prisma.cart.createMany({ data: carts });
  console.log("Cart seeding success");

  // Seed cart items
  const cartItems = Array.from({ length: 5 }).map((_, index) => ({
    cart_id: 1,
    product_id: 1,
    quantity: index + 1,
    price: products[index % products.length].price,
  }));

  await prisma.cart_items.createMany({ data: cartItems });
  console.log("Cart items seeding success");

  // Seed orders
  const orders = Array.from({ length: 10 }).map((_, index) => ({
    user_id: 1,
    warehouse_id: 1,
    shipping_cost: (index + 1) * 5000,
    payment_method: "Credit Card",
    total_price: (index + 1) * 20000,
    net_price: (index + 1) * 15000,
    shipping_method: "Standard",
    courier: "JNE",
    status: "pending",
  }));

  await prisma.orders.createMany({ data: orders });
  console.log("Order seeding success");

  // Seed order products
  const orderProducts = Array.from({ length: 10 }).map((_, index) => ({
    order_id: 1,
    product_id: 1,
    quantity: index + 1,
    price: products[index % products.length].price,
  }));

  await prisma.order_products.createMany({ data: orderProducts });
  console.log("Order products seeding success");

  process.exit();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
