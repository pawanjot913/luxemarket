const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

const products = [
  {
    "name": "Drift Athletic Polyester Sweater",
    "description": "The Drift Athletic Polyester Sweater is a top-tier product in our apparel category. Crafted from premium quality polyester and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 53.74,
    "category": "Apparel",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S"
    ],
    "colors": [
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      },
      {
        "name": "Camel Tan",
        "hex": "#C19A6B"
      },
      {
        "name": "Burgundy",
        "hex": "#800020"
      }
    ],
    "rating": 4.1,
    "reviewsCount": 360,
    "details": [
      "Category: Apparel",
      "Main Material: Polyester",
      "Machine wash cold with like colors, tumble dry low",
      "Designed for style, comfort, and durability"
    ],
    "isNew": false,
    "stock": 240,
    "image": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Drift Insulated Linen High-Tops",
    "description": "The Drift Insulated Linen High-Tops is a top-tier product in our footwear category. Crafted from premium quality linen and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 178.05,
    "category": "Footwear",
    "gender": "Women",
    "sizes": [
      "7",
      "8",
      "8.5",
      "9",
      "9.5",
      "10.5"
    ],
    "colors": [
      {
        "name": "Teal",
        "hex": "#008080"
      },
      {
        "name": "Burgundy",
        "hex": "#800020"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 254,
    "details": [
      "Category: Footwear",
      "Main Material: Linen",
      "Designed for style, comfort, and durability",
      "Imported construction with premium finish",
      "Four-way stretch construction moves better in every direction"
    ],
    "isNew": false,
    "stock": 236,
    "image": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Zenith Minimalist Fleece Gloves",
    "description": "The Zenith Minimalist Fleece Gloves is a top-tier product in our accessories category. Crafted from premium quality fleece and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 69.43,
    "category": "Accessories",
    "gender": "Men",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      }
    ],
    "rating": 3.9,
    "reviewsCount": 123,
    "details": [
      "Category: Accessories",
      "Main Material: Fleece",
      "Machine wash cold with like colors, tumble dry low",
      "Features subtle, high-quality hardware accents",
      "Fits true to size"
    ],
    "isNew": false,
    "stock": 360,
    "image": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Summit Premium Knit Trench Coat",
    "description": "The Summit Premium Knit Trench Coat is a top-tier product in our outerwear category. Crafted from premium quality knit and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 215.97,
    "category": "Outerwear",
    "gender": "Men",
    "sizes": [
      "XS",
      "S",
      "M",
      "XXL",
      "3XL"
    ],
    "colors": [
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 41,
    "details": [
      "Category: Outerwear",
      "Main Material: Knit",
      "Imported construction with premium finish",
      "Moisture-wicking fabric helps keep you dry and comfortable",
      "Designed for style, comfort, and durability",
      "Fits true to size"
    ],
    "isNew": false,
    "stock": 385,
    "image": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Terra Rugged Suede Tracksuit",
    "description": "The Terra Rugged Suede Tracksuit is a top-tier product in our activewear category. Crafted from premium quality suede and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 56.51,
    "category": "Activewear",
    "gender": "Men",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      },
      {
        "name": "Olive Green",
        "hex": "#556B2F"
      },
      {
        "name": "Burgundy",
        "hex": "#800020"
      }
    ],
    "rating": 5,
    "reviewsCount": 292,
    "details": [
      "Category: Activewear",
      "Main Material: Suede",
      "Four-way stretch construction moves better in every direction",
      "Features subtle, high-quality hardware accents"
    ],
    "isNew": false,
    "stock": 197,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Solstice Premium Denim Dress",
    "description": "The Solstice Premium Denim Dress is a top-tier product in our apparel category. Crafted from premium quality denim and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 113.57,
    "category": "Apparel",
    "gender": "Women",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 343,
    "details": [
      "Category: Apparel",
      "Main Material: Denim",
      "Designed for style, comfort, and durability",
      "Ethically sourced materials and production",
      "Moisture-wicking fabric helps keep you dry and comfortable"
    ],
    "isNew": false,
    "stock": 479,
    "image": [
      "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Flux Heavyweight Canvas Boots",
    "description": "The Flux Heavyweight Canvas Boots is a top-tier product in our footwear category. Crafted from premium quality canvas and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 181.36,
    "category": "Footwear",
    "gender": "Unisex",
    "sizes": [
      "7",
      "8.5",
      "9.5"
    ],
    "colors": [
      {
        "name": "Burgundy",
        "hex": "#800020"
      },
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 247,
    "details": [
      "Category: Footwear",
      "Main Material: Canvas",
      "Imported construction with premium finish",
      "Machine wash cold with like colors, tumble dry low",
      "Includes internal pockets for organization",
      "Features subtle, high-quality hardware accents"
    ],
    "isNew": true,
    "stock": 277,
    "image": [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Echo Cozy Canvas Socks",
    "description": "The Echo Cozy Canvas Socks is a top-tier product in our accessories category. Crafted from premium quality canvas and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 73.57,
    "category": "Accessories",
    "gender": "Unisex",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      },
      {
        "name": "Burgundy",
        "hex": "#800020"
      }
    ],
    "rating": 3.6,
    "reviewsCount": 318,
    "details": [
      "Category: Accessories",
      "Main Material: Canvas",
      "Imported construction with premium finish",
      "Machine wash cold with like colors, tumble dry low",
      "Comes with a 1-year manufacturer warranty"
    ],
    "isNew": false,
    "stock": 183,
    "image": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Flux Eco-friendly Denim Puffer Coat",
    "description": "The Flux Eco-friendly Denim Puffer Coat is a top-tier product in our outerwear category. Crafted from premium quality denim and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 94.67,
    "category": "Outerwear",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "3XL"
    ],
    "colors": [
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      },
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      },
      {
        "name": "Rose Pink",
        "hex": "#FFC0CB"
      }
    ],
    "rating": 4.1,
    "reviewsCount": 439,
    "details": [
      "Category: Outerwear",
      "Main Material: Denim",
      "Imported construction with premium finish",
      "Includes internal pockets for organization"
    ],
    "isNew": true,
    "stock": 176,
    "image": [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Core Lightweight Cotton Sports Bra",
    "description": "The Core Lightweight Cotton Sports Bra is a top-tier product in our activewear category. Crafted from premium quality cotton and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 71.16,
    "category": "Activewear",
    "gender": "Women",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Heather Grey",
        "hex": "#808080"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 170,
    "details": [
      "Category: Activewear",
      "Main Material: Cotton",
      "Imported construction with premium finish",
      "Four-way stretch construction moves better in every direction"
    ],
    "isNew": false,
    "stock": 260,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Apex Stretch Wool Polo Shirt",
    "description": "The Apex Stretch Wool Polo Shirt is a top-tier product in our apparel category. Crafted from premium quality wool and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 114.07,
    "category": "Apparel",
    "gender": "Men",
    "sizes": [
      "M",
      "L",
      "XXL"
    ],
    "colors": [
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      }
    ],
    "rating": 5,
    "reviewsCount": 101,
    "details": [
      "Category: Apparel",
      "Main Material: Wool",
      "Four-way stretch construction moves better in every direction",
      "Ethically sourced materials and production"
    ],
    "isNew": false,
    "stock": 166,
    "image": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Nova Essential Merino High-Tops",
    "description": "The Nova Essential Merino High-Tops is a top-tier product in our footwear category. Crafted from premium quality merino and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 71.1,
    "category": "Footwear",
    "gender": "Men",
    "sizes": [
      "7",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "12"
    ],
    "colors": [
      {
        "name": "Navy Blue",
        "hex": "#000080"
      },
      {
        "name": "Rose Pink",
        "hex": "#FFC0CB"
      }
    ],
    "rating": 4.7,
    "reviewsCount": 191,
    "details": [
      "Category: Footwear",
      "Main Material: Merino",
      "Reinforced stitching in high-wear areas",
      "Imported construction with premium finish",
      "Moisture-wicking fabric helps keep you dry and comfortable",
      "Fits true to size"
    ],
    "isNew": false,
    "stock": 469,
    "image": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Core Minimalist Wool Backpack",
    "description": "The Core Minimalist Wool Backpack is a top-tier product in our accessories category. Crafted from premium quality wool and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 44.9,
    "category": "Accessories",
    "gender": "Men",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      }
    ],
    "rating": 3.5,
    "reviewsCount": 333,
    "details": [
      "Category: Accessories",
      "Main Material: Wool",
      "Features subtle, high-quality hardware accents",
      "Designed for style, comfort, and durability"
    ],
    "isNew": false,
    "stock": 317,
    "image": [
      "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cf4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Nova Breathable Canvas Trench Coat",
    "description": "The Nova Breathable Canvas Trench Coat is a top-tier product in our outerwear category. Crafted from premium quality canvas and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 259.28,
    "category": "Outerwear",
    "gender": "Men",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Olive Green",
        "hex": "#556B2F"
      }
    ],
    "rating": 3.6,
    "reviewsCount": 292,
    "details": [
      "Category: Outerwear",
      "Main Material: Canvas",
      "Reinforced stitching in high-wear areas",
      "Four-way stretch construction moves better in every direction",
      "Includes internal pockets for organization"
    ],
    "isNew": false,
    "stock": 405,
    "image": [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Echo Breathable Polyester Performance Tee",
    "description": "The Echo Breathable Polyester Performance Tee is a top-tier product in our activewear category. Crafted from premium quality polyester and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 64.64,
    "category": "Activewear",
    "gender": "Men",
    "sizes": [
      "XS",
      "S",
      "L"
    ],
    "colors": [
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      }
    ],
    "rating": 4,
    "reviewsCount": 432,
    "details": [
      "Category: Activewear",
      "Main Material: Polyester",
      "Features subtle, high-quality hardware accents",
      "Reinforced stitching in high-wear areas",
      "Fits true to size"
    ],
    "isNew": true,
    "stock": 151,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Echo Stretch Fleece Shorts",
    "description": "The Echo Stretch Fleece Shorts is a top-tier product in our apparel category. Crafted from premium quality fleece and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 85.55,
    "category": "Apparel",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XXL"
    ],
    "colors": [
      {
        "name": "Burgundy",
        "hex": "#800020"
      },
      {
        "name": "Navy Blue",
        "hex": "#000080"
      },
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      }
    ],
    "rating": 4.7,
    "reviewsCount": 125,
    "details": [
      "Category: Apparel",
      "Main Material: Fleece",
      "Four-way stretch construction moves better in every direction",
      "Includes internal pockets for organization",
      "Ethically sourced materials and production"
    ],
    "isNew": true,
    "stock": 293,
    "image": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Vanguard Premium Nylon Slides",
    "description": "The Vanguard Premium Nylon Slides is a top-tier product in our footwear category. Crafted from premium quality nylon and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 131.93,
    "category": "Footwear",
    "gender": "Unisex",
    "sizes": [
      "8",
      "8.5",
      "9.5",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Heather Grey",
        "hex": "#808080"
      },
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      }
    ],
    "rating": 4.2,
    "reviewsCount": 256,
    "details": [
      "Category: Footwear",
      "Main Material: Nylon",
      "Comes with a 1-year manufacturer warranty",
      "Four-way stretch construction moves better in every direction"
    ],
    "isNew": false,
    "stock": 75,
    "image": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Aero Essential Wool Duffel Bag",
    "description": "The Aero Essential Wool Duffel Bag is a top-tier product in our accessories category. Crafted from premium quality wool and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 41.14,
    "category": "Accessories",
    "gender": "Men",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      }
    ],
    "rating": 5,
    "reviewsCount": 229,
    "details": [
      "Category: Accessories",
      "Main Material: Wool",
      "Includes internal pockets for organization",
      "Moisture-wicking fabric helps keep you dry and comfortable",
      "Fits true to size",
      "Ethically sourced materials and production"
    ],
    "isNew": false,
    "stock": 260,
    "image": [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Echo Modern Knit Anorak",
    "description": "The Echo Modern Knit Anorak is a top-tier product in our outerwear category. Crafted from premium quality knit and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 124.58,
    "category": "Outerwear",
    "gender": "Women",
    "sizes": [
      "XS",
      "S",
      "3XL"
    ],
    "colors": [
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      }
    ],
    "rating": 4.1,
    "reviewsCount": 144,
    "details": [
      "Category: Outerwear",
      "Main Material: Knit",
      "Imported construction with premium finish",
      "Four-way stretch construction moves better in every direction",
      "Fits true to size",
      "Comes with a 1-year manufacturer warranty"
    ],
    "isNew": true,
    "stock": 71,
    "image": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Nova Classic Knit Tank Top",
    "description": "The Nova Classic Knit Tank Top is a top-tier product in our activewear category. Crafted from premium quality knit and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 149.83,
    "category": "Activewear",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S"
    ],
    "colors": [
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      }
    ],
    "rating": 4.5,
    "reviewsCount": 25,
    "details": [
      "Category: Activewear",
      "Main Material: Knit",
      "Comes with a 1-year manufacturer warranty",
      "Ethically sourced materials and production"
    ],
    "isNew": false,
    "stock": 376,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Terra Insulated Linen Joggers",
    "description": "The Terra Insulated Linen Joggers is a top-tier product in our apparel category. Crafted from premium quality linen and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 54.29,
    "category": "Apparel",
    "gender": "Women",
    "sizes": [
      "XS",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Rose Pink",
        "hex": "#FFC0CB"
      },
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 45,
    "details": [
      "Category: Apparel",
      "Main Material: Linen",
      "Moisture-wicking fabric helps keep you dry and comfortable",
      "Imported construction with premium finish"
    ],
    "isNew": false,
    "stock": 390,
    "image": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Apex Urban Wool Sandals",
    "description": "The Apex Urban Wool Sandals is a top-tier product in our footwear category. Crafted from premium quality wool and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 171.93,
    "category": "Footwear",
    "gender": "Men",
    "sizes": [
      "7",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "12"
    ],
    "colors": [
      {
        "name": "Forest Green",
        "hex": "#228B22"
      },
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      }
    ],
    "rating": 4.5,
    "reviewsCount": 431,
    "details": [
      "Category: Footwear",
      "Main Material: Wool",
      "Reinforced stitching in high-wear areas",
      "Ethically sourced materials and production",
      "Includes internal pockets for organization",
      "Comes with a 1-year manufacturer warranty"
    ],
    "isNew": false,
    "stock": 98,
    "image": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Core Athletic Merino Beanie",
    "description": "The Core Athletic Merino Beanie is a top-tier product in our accessories category. Crafted from premium quality merino and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 44.76,
    "category": "Accessories",
    "gender": "Unisex",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      },
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      },
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      }
    ],
    "rating": 4.6,
    "reviewsCount": 234,
    "details": [
      "Category: Accessories",
      "Main Material: Merino",
      "Comes with a 1-year manufacturer warranty",
      "Includes internal pockets for organization",
      "Moisture-wicking fabric helps keep you dry and comfortable"
    ],
    "isNew": false,
    "stock": 310,
    "image": [
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Terra Vintage Satin Anorak",
    "description": "The Terra Vintage Satin Anorak is a top-tier product in our outerwear category. Crafted from premium quality satin and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 303.37,
    "category": "Outerwear",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      }
    ],
    "rating": 3.6,
    "reviewsCount": 266,
    "details": [
      "Category: Outerwear",
      "Main Material: Satin",
      "Reinforced stitching in high-wear areas",
      "Imported construction with premium finish",
      "Machine wash cold with like colors, tumble dry low"
    ],
    "isNew": true,
    "stock": 489,
    "image": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Aero Eco-friendly Canvas Sports Bra",
    "description": "The Aero Eco-friendly Canvas Sports Bra is a top-tier product in our activewear category. Crafted from premium quality canvas and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 82.99,
    "category": "Activewear",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S",
      "L",
      "XXL"
    ],
    "colors": [
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      },
      {
        "name": "Heather Grey",
        "hex": "#808080"
      },
      {
        "name": "Olive Green",
        "hex": "#556B2F"
      },
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      }
    ],
    "rating": 4.2,
    "reviewsCount": 364,
    "details": [
      "Category: Activewear",
      "Main Material: Canvas",
      "Fits true to size",
      "Reinforced stitching in high-wear areas",
      "Designed for style, comfort, and durability"
    ],
    "isNew": false,
    "stock": 250,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Nova Waterproof Fleece Jeans",
    "description": "The Nova Waterproof Fleece Jeans is a top-tier product in our apparel category. Crafted from premium quality fleece and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 90.38,
    "category": "Apparel",
    "gender": "Women",
    "sizes": [
      "XS",
      "S",
      "XXL"
    ],
    "colors": [
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Navy Blue",
        "hex": "#000080"
      },
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      },
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 305,
    "details": [
      "Category: Apparel",
      "Main Material: Fleece",
      "Ethically sourced materials and production",
      "Designed for style, comfort, and durability",
      "Features subtle, high-quality hardware accents",
      "Reinforced stitching in high-wear areas"
    ],
    "isNew": false,
    "stock": 153,
    "image": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Summit Athletic Satin Loafers",
    "description": "The Summit Athletic Satin Loafers is a top-tier product in our footwear category. Crafted from premium quality satin and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 106.52,
    "category": "Footwear",
    "gender": "Women",
    "sizes": [
      "10.5",
      "11"
    ],
    "colors": [
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      }
    ],
    "rating": 4.1,
    "reviewsCount": 369,
    "details": [
      "Category: Footwear",
      "Main Material: Satin",
      "Four-way stretch construction moves better in every direction",
      "Ethically sourced materials and production",
      "Designed for style, comfort, and durability",
      "Machine wash cold with like colors, tumble dry low"
    ],
    "isNew": false,
    "stock": 174,
    "image": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Vanguard Rugged Canvas Duffel Bag",
    "description": "The Vanguard Rugged Canvas Duffel Bag is a top-tier product in our accessories category. Crafted from premium quality canvas and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 21.45,
    "category": "Accessories",
    "gender": "Women",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Olive Green",
        "hex": "#556B2F"
      },
      {
        "name": "Rose Pink",
        "hex": "#FFC0CB"
      },
      {
        "name": "Heather Grey",
        "hex": "#808080"
      },
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      }
    ],
    "rating": 3.6,
    "reviewsCount": 86,
    "details": [
      "Category: Accessories",
      "Main Material: Canvas",
      "Fits true to size",
      "Four-way stretch construction moves better in every direction"
    ],
    "isNew": false,
    "stock": 179,
    "image": [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cf4?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Echo Modern Denim Windbreaker",
    "description": "The Echo Modern Denim Windbreaker is a top-tier product in our outerwear category. Crafted from premium quality denim and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 282.29,
    "category": "Outerwear",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "3XL"
    ],
    "colors": [
      {
        "name": "Navy Blue",
        "hex": "#000080"
      },
      {
        "name": "Heather Grey",
        "hex": "#808080"
      },
      {
        "name": "Forest Green",
        "hex": "#228B22"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 371,
    "details": [
      "Category: Outerwear",
      "Main Material: Denim",
      "Four-way stretch construction moves better in every direction",
      "Reinforced stitching in high-wear areas"
    ],
    "isNew": false,
    "stock": 40,
    "image": [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Vanguard Breathable Wool Sports Bra",
    "description": "The Vanguard Breathable Wool Sports Bra is a top-tier product in our activewear category. Crafted from premium quality wool and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 78.37,
    "category": "Activewear",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Olive Green",
        "hex": "#556B2F"
      },
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      },
      {
        "name": "Rose Pink",
        "hex": "#FFC0CB"
      },
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      }
    ],
    "rating": 3.6,
    "reviewsCount": 385,
    "details": [
      "Category: Activewear",
      "Main Material: Wool",
      "Reinforced stitching in high-wear areas",
      "Features subtle, high-quality hardware accents",
      "Includes internal pockets for organization"
    ],
    "isNew": false,
    "stock": 494,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Flux Modern Canvas Cardigan",
    "description": "The Flux Modern Canvas Cardigan is a top-tier product in our apparel category. Crafted from premium quality canvas and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 108.21,
    "category": "Apparel",
    "gender": "Men",
    "sizes": [
      "XS",
      "S",
      "M",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      },
      {
        "name": "Forest Green",
        "hex": "#228B22"
      },
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      },
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 366,
    "details": [
      "Category: Apparel",
      "Main Material: Canvas",
      "Imported construction with premium finish",
      "Features subtle, high-quality hardware accents"
    ],
    "isNew": false,
    "stock": 456,
    "image": [
      "https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Core Essential Leather High-Tops",
    "description": "The Core Essential Leather High-Tops is a top-tier product in our footwear category. Crafted from premium quality leather and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 168.14,
    "category": "Footwear",
    "gender": "Women",
    "sizes": [
      "7",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "12"
    ],
    "colors": [
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      },
      {
        "name": "Burgundy",
        "hex": "#800020"
      }
    ],
    "rating": 4.6,
    "reviewsCount": 267,
    "details": [
      "Category: Footwear",
      "Main Material: Leather",
      "Machine wash cold with like colors, tumble dry low",
      "Moisture-wicking fabric helps keep you dry and comfortable"
    ],
    "isNew": false,
    "stock": 274,
    "image": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Solstice Breathable Cotton Gloves",
    "description": "The Solstice Breathable Cotton Gloves is a top-tier product in our accessories category. Crafted from premium quality cotton and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 26.55,
    "category": "Accessories",
    "gender": "Unisex",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      },
      {
        "name": "Camel Tan",
        "hex": "#C19A6B"
      },
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      }
    ],
    "rating": 4.4,
    "reviewsCount": 428,
    "details": [
      "Category: Accessories",
      "Main Material: Cotton",
      "Ethically sourced materials and production",
      "Designed for style, comfort, and durability",
      "Features subtle, high-quality hardware accents"
    ],
    "isNew": false,
    "stock": 241,
    "image": [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Apex Classic Nylon Puffer Coat",
    "description": "The Apex Classic Nylon Puffer Coat is a top-tier product in our outerwear category. Crafted from premium quality nylon and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 84.54,
    "category": "Outerwear",
    "gender": "Women",
    "sizes": [
      "M",
      "3XL"
    ],
    "colors": [
      {
        "name": "Forest Green",
        "hex": "#228B22"
      },
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      },
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 257,
    "details": [
      "Category: Outerwear",
      "Main Material: Nylon",
      "Features subtle, high-quality hardware accents",
      "Four-way stretch construction moves better in every direction"
    ],
    "isNew": false,
    "stock": 401,
    "image": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Zenith Retro Linen Hoodie",
    "description": "The Zenith Retro Linen Hoodie is a top-tier product in our activewear category. Crafted from premium quality linen and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 33.77,
    "category": "Activewear",
    "gender": "Unisex",
    "sizes": [
      "XS",
      "S",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      },
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      },
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      },
      {
        "name": "Camel Tan",
        "hex": "#C19A6B"
      }
    ],
    "rating": 3.9,
    "reviewsCount": 153,
    "details": [
      "Category: Activewear",
      "Main Material: Linen",
      "Imported construction with premium finish",
      "Reinforced stitching in high-wear areas"
    ],
    "isNew": false,
    "stock": 366,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Vanguard Cozy Denim Polo Shirt",
    "description": "The Vanguard Cozy Denim Polo Shirt is a top-tier product in our apparel category. Crafted from premium quality denim and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 119.01,
    "category": "Apparel",
    "gender": "Women",
    "sizes": [
      "XS",
      "S",
      "L"
    ],
    "colors": [
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      },
      {
        "name": "Olive Green",
        "hex": "#556B2F"
      },
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      }
    ],
    "rating": 4.7,
    "reviewsCount": 109,
    "details": [
      "Category: Apparel",
      "Main Material: Denim",
      "Imported construction with premium finish",
      "Fits true to size"
    ],
    "isNew": true,
    "stock": 386,
    "image": [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Flux Essential Bamboo Fiber Sneakers",
    "description": "The Flux Essential Bamboo Fiber Sneakers is a top-tier product in our footwear category. Crafted from premium quality bamboo fiber and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 196.84,
    "category": "Footwear",
    "gender": "Unisex",
    "sizes": [
      "7",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "12"
    ],
    "colors": [
      {
        "name": "Heather Grey",
        "hex": "#808080"
      },
      {
        "name": "Teal",
        "hex": "#008080"
      }
    ],
    "rating": 3.5,
    "reviewsCount": 378,
    "details": [
      "Category: Footwear",
      "Main Material: Bamboo Fiber",
      "Ethically sourced materials and production",
      "Imported construction with premium finish",
      "Includes internal pockets for organization"
    ],
    "isNew": false,
    "stock": 414,
    "image": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Summit Essential Cotton Backpack",
    "description": "The Summit Essential Cotton Backpack is a top-tier product in our accessories category. Crafted from premium quality cotton and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 66.96,
    "category": "Accessories",
    "gender": "Women",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Navy Blue",
        "hex": "#000080"
      },
      {
        "name": "Heather Grey",
        "hex": "#808080"
      },
      {
        "name": "Olive Green",
        "hex": "#556B2F"
      },
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      }
    ],
    "rating": 3.9,
    "reviewsCount": 40,
    "details": [
      "Category: Accessories",
      "Main Material: Cotton",
      "Moisture-wicking fabric helps keep you dry and comfortable",
      "Ethically sourced materials and production",
      "Comes with a 1-year manufacturer warranty",
      "Includes internal pockets for organization"
    ],
    "isNew": false,
    "stock": 499,
    "image": [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Core Insulated Merino Anorak",
    "description": "The Core Insulated Merino Anorak is a top-tier product in our outerwear category. Crafted from premium quality merino and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 156.18,
    "category": "Outerwear",
    "gender": "Men",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL",
      "3XL"
    ],
    "colors": [
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      },
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      },
      {
        "name": "Camel Tan",
        "hex": "#C19A6B"
      }
    ],
    "rating": 4,
    "reviewsCount": 128,
    "details": [
      "Category: Outerwear",
      "Main Material: Merino",
      "Ethically sourced materials and production",
      "Designed for style, comfort, and durability",
      "Four-way stretch construction moves better in every direction",
      "Machine wash cold with like colors, tumble dry low"
    ],
    "isNew": false,
    "stock": 277,
    "image": [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Aero Modern Polyester Performance Tee",
    "description": "The Aero Modern Polyester Performance Tee is a top-tier product in our activewear category. Crafted from premium quality polyester and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 69.61,
    "category": "Activewear",
    "gender": "Women",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Burgundy",
        "hex": "#800020"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 211,
    "details": [
      "Category: Activewear",
      "Main Material: Polyester",
      "Comes with a 1-year manufacturer warranty",
      "Machine wash cold with like colors, tumble dry low",
      "Designed for style, comfort, and durability"
    ],
    "isNew": false,
    "stock": 471,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Summit Modern Suede Henley",
    "description": "The Summit Modern Suede Henley is a top-tier product in our apparel category. Crafted from premium quality suede and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 71.76,
    "category": "Apparel",
    "gender": "Men",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Teal",
        "hex": "#008080"
      },
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      },
      {
        "name": "Heather Grey",
        "hex": "#808080"
      }
    ],
    "rating": 4.3,
    "reviewsCount": 87,
    "details": [
      "Category: Apparel",
      "Main Material: Suede",
      "Imported construction with premium finish",
      "Four-way stretch construction moves better in every direction",
      "Comes with a 1-year manufacturer warranty"
    ],
    "isNew": false,
    "stock": 133,
    "image": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Drift Premium Linen Training Shoes",
    "description": "The Drift Premium Linen Training Shoes is a top-tier product in our footwear category. Crafted from premium quality linen and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 84.16,
    "category": "Footwear",
    "gender": "Unisex",
    "sizes": [
      "7",
      "8",
      "9",
      "9.5",
      "10",
      "10.5",
      "12"
    ],
    "colors": [
      {
        "name": "Camel Tan",
        "hex": "#C19A6B"
      },
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      }
    ],
    "rating": 4.2,
    "reviewsCount": 367,
    "details": [
      "Category: Footwear",
      "Main Material: Linen",
      "Ethically sourced materials and production",
      "Designed for style, comfort, and durability",
      "Includes internal pockets for organization",
      "Imported construction with premium finish"
    ],
    "isNew": true,
    "stock": 328,
    "image": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Aero Lightweight Nylon Duffel Bag",
    "description": "The Aero Lightweight Nylon Duffel Bag is a top-tier product in our accessories category. Crafted from premium quality nylon and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 62.81,
    "category": "Accessories",
    "gender": "Women",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Navy Blue",
        "hex": "#000080"
      },
      {
        "name": "Off-White",
        "hex": "#F5F5F0"
      }
    ],
    "rating": 4.4,
    "reviewsCount": 40,
    "details": [
      "Category: Accessories",
      "Main Material: Nylon",
      "Ethically sourced materials and production",
      "Fits true to size"
    ],
    "isNew": false,
    "stock": 234,
    "image": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Core Stretch Polyester Trench Coat",
    "description": "The Core Stretch Polyester Trench Coat is a top-tier product in our outerwear category. Crafted from premium quality polyester and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 339.6,
    "category": "Outerwear",
    "gender": "Women",
    "sizes": [
      "XS",
      "M",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Teal",
        "hex": "#008080"
      },
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      }
    ],
    "rating": 3.8,
    "reviewsCount": 355,
    "details": [
      "Category: Outerwear",
      "Main Material: Polyester",
      "Fits true to size",
      "Imported construction with premium finish",
      "Machine wash cold with like colors, tumble dry low",
      "Comes with a 1-year manufacturer warranty"
    ],
    "isNew": false,
    "stock": 252,
    "image": [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Vanguard Classic Canvas Tracksuit",
    "description": "The Vanguard Classic Canvas Tracksuit is a top-tier product in our activewear category. Crafted from premium quality canvas and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 44.77,
    "category": "Activewear",
    "gender": "Women",
    "sizes": [
      "S",
      "M",
      "XXL"
    ],
    "colors": [
      {
        "name": "Navy Blue",
        "hex": "#000080"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 210,
    "details": [
      "Category: Activewear",
      "Main Material: Canvas",
      "Four-way stretch construction moves better in every direction",
      "Ethically sourced materials and production"
    ],
    "isNew": false,
    "stock": 381,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Vanguard Eco-friendly Merino Henley",
    "description": "The Vanguard Eco-friendly Merino Henley is a top-tier product in our apparel category. Crafted from premium quality merino and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 33.45,
    "category": "Apparel",
    "gender": "Men",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      },
      {
        "name": "Teal",
        "hex": "#008080"
      }
    ],
    "rating": 3.8,
    "reviewsCount": 92,
    "details": [
      "Category: Apparel",
      "Main Material: Merino",
      "Features subtle, high-quality hardware accents",
      "Ethically sourced materials and production",
      "Fits true to size",
      "Comes with a 1-year manufacturer warranty"
    ],
    "isNew": false,
    "stock": 310,
    "image": [
      "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Flux Retro Knit Loafers",
    "description": "The Flux Retro Knit Loafers is a top-tier product in our footwear category. Crafted from premium quality knit and tailored for everyone, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 78.07,
    "category": "Footwear",
    "gender": "Unisex",
    "sizes": [
      "8",
      "8.5",
      "9.5",
      "10",
      "10.5"
    ],
    "colors": [
      {
        "name": "Rose Pink",
        "hex": "#FFC0CB"
      },
      {
        "name": "Burgundy",
        "hex": "#800020"
      },
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      },
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      }
    ],
    "rating": 3.5,
    "reviewsCount": 47,
    "details": [
      "Category: Footwear",
      "Main Material: Knit",
      "Fits true to size",
      "Ethically sourced materials and production",
      "Features subtle, high-quality hardware accents"
    ],
    "isNew": false,
    "stock": 307,
    "image": [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Vanguard Rugged Merino Beanie",
    "description": "The Vanguard Rugged Merino Beanie is a top-tier product in our accessories category. Crafted from premium quality merino and tailored for women, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 56.57,
    "category": "Accessories",
    "gender": "Women",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Plum Purple",
        "hex": "#DDA0DD"
      },
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      },
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      }
    ],
    "rating": 3.7,
    "reviewsCount": 314,
    "details": [
      "Category: Accessories",
      "Main Material: Merino",
      "Includes internal pockets for organization",
      "Four-way stretch construction moves better in every direction",
      "Fits true to size"
    ],
    "isNew": false,
    "stock": 118,
    "image": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Vanguard Rugged Cotton Parka",
    "description": "The Vanguard Rugged Cotton Parka is a top-tier product in our outerwear category. Crafted from premium quality cotton and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 141.14,
    "category": "Outerwear",
    "gender": "Men",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "3XL"
    ],
    "colors": [
      {
        "name": "Olive Green",
        "hex": "#556B2F"
      },
      {
        "name": "Charcoal Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Mustard Yellow",
        "hex": "#E1AD01"
      },
      {
        "name": "Forest Green",
        "hex": "#228B22"
      }
    ],
    "rating": 4.3,
    "reviewsCount": 204,
    "details": [
      "Category: Outerwear",
      "Main Material: Cotton",
      "Imported construction with premium finish",
      "Features subtle, high-quality hardware accents"
    ],
    "isNew": false,
    "stock": 106,
    "image": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    "name": "Echo Cozy Wool Tracksuit",
    "description": "The Echo Cozy Wool Tracksuit is a top-tier product in our activewear category. Crafted from premium quality wool and tailored for men, it offers unparalleled comfort and style. Perfect for daily wear, special occasions, or outdoor activities. Designed with modern aesthetics in mind, this item blends functionality with contemporary fashion.",
    "price": 30.05,
    "category": "Activewear",
    "gender": "Men",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Forest Green",
        "hex": "#228B22"
      },
      {
        "name": "Crimson Red",
        "hex": "#DC143C"
      },
      {
        "name": "Rust Orange",
        "hex": "#B7410E"
      }
    ],
    "rating": 4,
    "reviewsCount": 357,
    "details": [
      "Category: Activewear",
      "Main Material: Wool",
      "Four-way stretch construction moves better in every direction",
      "Imported construction with premium finish",
      "Reinforced stitching in high-wear areas",
      "Comes with a 1-year manufacturer warranty"
    ],
    "isNew": false,
    "stock": 391,
    "image": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  }
]

const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Seeded products');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectAndSeed();
