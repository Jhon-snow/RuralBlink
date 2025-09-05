import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get products by category
  app.get("/api/categories/:categoryId/products", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get user by phone (for login/registration)
  app.get("/api/users/phone/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Get user orders
  app.get("/api/users/:userId/orders", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Send SMS notification (basic implementation)
      try {
        await sendOrderConfirmationSMS(order);
      } catch (smsError) {
        console.error("Failed to send SMS:", smsError);
        // Continue with order creation even if SMS fails
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get single order
  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Update order status
  app.patch("/api/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const updateData = req.body;
      const order = await storage.updateOrder(orderId, updateData);
      
      // Send SMS notification for status updates
      try {
        await sendOrderStatusUpdateSMS(order);
      } catch (smsError) {
        console.error("Failed to send SMS:", smsError);
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Search products
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.json([]);
      }
      
      const products = await storage.getProducts();
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(q.toLowerCase()) ||
        product.description?.toLowerCase().includes(q.toLowerCase())
      );
      
      res.json(filteredProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Basic SMS notification functions (would integrate with Twilio or similar service)
async function sendOrderConfirmationSMS(order: any) {
  // Implementation would use Twilio or similar SMS service
  console.log(`SMS: Order #${order.id} confirmed. Total: ₹${order.total / 100}. Delivery in 30-45 mins.`);
}

async function sendOrderStatusUpdateSMS(order: any) {
  const statusMessages = {
    confirmed: "Your order has been confirmed and is being prepared.",
    preparing: "Your order is being prepared.",
    out_for_delivery: "Your order is out for delivery. Delivery person will contact you shortly.",
    delivered: "Your order has been delivered. Thank you for choosing RuralCart!",
  };
  
  const message = statusMessages[order.status as keyof typeof statusMessages];
  if (message) {
    console.log(`SMS: Order #${order.id} - ${message}`);
  }
}
