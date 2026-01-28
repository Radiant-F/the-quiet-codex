import { db } from "./index";
import { users } from "./schema";

async function seed(): Promise<void> {
  console.log("🌱 Starting database seed...");

  // Add your seed data here
  // Example:
  await db.insert(users).values({
    username: "admin",
    passwordHash: await Bun.password.hash("admin123"),
  });

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
