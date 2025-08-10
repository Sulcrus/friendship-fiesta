import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    homeClub: v.string(),
    designation: v.string(),
    phoneNumber: v.string(),
    paymentMethod: v.string(),
    paymentScreenshot: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Generate unique pass ID
    const passId = `FF${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    
    // Generate QR code data for the pass
    const qrCode = JSON.stringify({
      passId,
      name: args.name,
      event: "Kathmandu Friendship Fiesta",
      timestamp: Date.now()
    });

    const registrationId = await ctx.db.insert("registrations", {
      ...args,
      passId,
      qrCode,
      createdAt: Date.now(),
      status: "pending",
    });

    return { registrationId, passId };
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("registrations").order("desc").collect();
  },
});

export const listWithUrls = query({
  handler: async (ctx) => {
    const regs = await ctx.db.query("registrations").order("desc").collect();
    const withUrls = await Promise.all(
      regs.map(async (r) => ({
        ...r,
        screenshotUrl: r.paymentScreenshot
          ? await ctx.storage.getUrl(r.paymentScreenshot)
          : undefined,
      }))
    );
    return withUrls;
  },
});

export const getByPassId = query({
  args: { passId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("registrations")
      .withIndex("by_passId", (q) => q.eq("passId", args.passId))
      .first();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("registrations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});

export const generatePaymentQR = mutation({
  args: {
    registrationId: v.id("registrations"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.registrationId);
    if (!registration) throw new Error("Registration not found");

    const qrData = JSON.stringify({
      type: "payment",
      registrationId: args.registrationId,
      amount: args.amount,
      name: registration.name,
      passId: registration.passId,
    });

    const qrId = await ctx.db.insert("paymentQRCodes", {
      registrationId: args.registrationId,
      qrCodeData: qrData,
      amount: args.amount,
      createdAt: Date.now(),
    });

    return { qrId, qrData };
  },
});
