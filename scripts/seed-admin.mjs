/**
 * Creates or updates the admin user in MongoDB using ADMIN_EMAIL and ADMIN_PASSWORD from `.env.local`.
 *
 * Usage: npm run seed:admin
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim()?.toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim();

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "[seed-admin] Missing required variables. Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local"
  );
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { collection: "users" }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

try {
  await mongoose.connect(MONGODB_URI);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const user = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { email: ADMIN_EMAIL, password: hashedPassword, role: "admin" },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  console.log(`[seed-admin] Admin user ready: ${user.email}`);
} catch (error) {
  console.error("[seed-admin] Failed:", error.message);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}
