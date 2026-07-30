// test-db.ts
import { prisma } from "@repo/database";

console.log("Starting query...");
const user = await prisma.user.findFirst();
console.log("Result:", user);
process.exit(0);