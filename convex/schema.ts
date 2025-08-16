import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  registrations: defineTable({
    name: v.string(),
    homeClub: v.string(),
    designation: v.string(),
    phoneNumber: v.string(),
    paymentMethod: v.string(), // "cash" or "qr"
    paymentScreenshot: v.optional(v.id("_storage")),
    passId: v.string(),
    qrCode: v.string(),
    createdAt: v.number(),
    status: v.string(), // "pending", "verified", "rejected"
  }).index("by_passId", ["passId"]),
  
  paymentQRCodes: defineTable({
    registrationId: v.id("registrations"),
    qrCodeData: v.string(),
    amount: v.number(),
    createdAt: v.number(),
  }).index("by_registrationId", ["registrationId"]),

  // Global settings table to control registration status
  settings: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
