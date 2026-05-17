import fs from "fs";
import path from "path";

// Load env
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

async function main() {
  const connectDB = (await import("../lib/db")).default;
  const { Review } = await import("../models/Review");
  
  await connectDB();
  
  // Set isApproved = true for review
  const updated = await Review.findByIdAndUpdate(
    "6a09a4fcf4ed14ca87eba52c", 
    { isApproved: true }, 
    { new: true }
  );
  
  console.log("=== UPDATED REVIEW ===");
  console.log(JSON.stringify(updated, null, 2));
  process.exit(0);
}

main().catch(console.error);
