import Product from "./models/ProductModel.js";

const seedData = [
  {
    name: "Sepatu Lari Keren",
    image: "fb6ec18c5e69bf35c596dd02404e1250.jpg",
    url: "http://localhost:5000/images/fb6ec18c5e69bf35c596dd02404e1250.jpg",
  },
  {
    name: "Kemeja Flannel Merah",
    image: "b9c7924e0b047535492d3df24e123456.jpg",
    url: "http://localhost:5000/images/b9c7924e0b047535492d3df24e123456.jpg",
  },
  {
    name: "Tas Ransel Outdoor",
    image: "a1b2c3d4e5f678901234567890abcdef.jpg",
    url: "http://localhost:5000/images/a1b2c3d4e5f678901234567890abcdef.jpg",
  },
];

(async () => {
  try {
    await Product.sync(); // Ensure table exists
    await Product.bulkCreate(seedData);
    console.log("Data dummy berhasil ditambahkan!");
    process.exit(0);
  } catch (error) {
    console.error("Gagal menambahkan data dummy:", error);
    process.exit(1);
  }
})();
