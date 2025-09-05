import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  address: json("address").$type<{
    label: string;
    full: string;
    phone: string;
  }>(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in paisa
  originalPrice: integer("original_price"), // in paisa
  unit: text("unit").notNull().default("piece"),
  imageUrl: text("image_url"),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  inStock: boolean("in_stock").default(true),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  items: json("items").$type<Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>>().notNull(),
  subtotal: integer("subtotal").notNull(), // in paisa
  deliveryFee: integer("delivery_fee").default(0),
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, out_for_delivery, delivered, cancelled
  paymentMethod: text("payment_method").notNull().default("cod"), // cod, upi
  deliveryAddress: json("delivery_address").$type<{
    label: string;
    full: string;
    phone: string;
  }>().notNull(),
  specialInstructions: text("special_instructions"),
  deliveryTime: text("delivery_time").default("asap"), // asap or scheduled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
