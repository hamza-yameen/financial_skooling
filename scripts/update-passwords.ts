process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function run() {
  console.log("🔐 Updating default passwords to secure unbreached credentials...");

  const newAdminPassword = "FinSkool@2026!";
  const newStudentPassword = "FinSkool@2026!";

  const hashedAdmin = await bcrypt.hash(newAdminPassword, 10);
  const hashedStudent = await bcrypt.hash(newStudentPassword, 10);

  const updatedAdmin = await prisma.user.updateMany({
    where: { email: "admin@finskool.com" },
    data: { password: hashedAdmin },
  });

  const updatedStudent = await prisma.user.updateMany({
    where: { email: "student@finskool.com" },
    data: { password: hashedStudent },
  });

  console.log(`✅ Success!`);
  console.log(`Updated Admin (${updatedAdmin.count} record): email=admin@finskool.com password=${newAdminPassword}`);
  console.log(`Updated Student (${updatedStudent.count} record): email=student@finskool.com password=${newStudentPassword}`);
  console.log(`\nGoogle Chrome will no longer flag this password as breached.`);

  await prisma.$disconnect();
}

run().catch((err) => {
  console.error("❌ Failed to update passwords:", err);
  process.exit(1);
});

