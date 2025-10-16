const PlaceOrderModel = require("../models/placeorder.model");
const FoodModel = require("../models/food.model");
const FoodPartnerModel = require("../models/foodpartner.model");

// Place an order
async function placeOrder(req, res) {
  try {
    // Require user to be authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await FoodModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const partner = await FoodPartnerModel.findById(product.foodpartner);
    if (!partner) {
      return res.status(404).json({ message: "Food partner not found" });
    }

    const qty = quantity && quantity > 0 ? quantity : 1;

    const orderItem = {
      product: product._id,
      quantity: qty,
      price: product.price,
      name: product.name,
    };

    const totalAmount = product.price * qty;

    const order = await PlaceOrderModel.create({
      user: req.user._id,
      partner: partner._id,
      items: [orderItem],
      totalAmount,
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (err) {
    console.error("Place order error:", err);
    return res.status(500).json({ message: err.message || "Failed to place order" });
  }
}

// Fetch partner’s orders
async function getPartnerOrder(req, res) {
  try {
    if (!req.foodPartner) {
      return res.status(401).json({ message: "Unauthorized: Partner login required" });
    }

    const orders = await PlaceOrderModel.find({ partner: req.foodPartner._id })
      .populate("user", "fullName email")
      .populate({
        path: "items.product",
        select: "name price",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: `Orders for partner ${req.foodPartner.name}`,
      orders,
    });

  } catch (err) {
    console.error("Fetch partner orders error:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch orders" });
  }
}

module.exports = { placeOrder, getPartnerOrder };
