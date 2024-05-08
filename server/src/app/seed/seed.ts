import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../shared/prisma";

const seedSuperAdmin = async () => {
  const isExistsSuperAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.SUPER_ADMIN,
    },
  });
  if (!isExistsSuperAdmin) {
    const plainPassword = "superadmin";
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    const superAdmin = await prisma.user.create({
      data: {
        email: "super@admin.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "01700000000",
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        needPasswordChange: true,
        status: true,
      },
    });
    console.log({ superAdmin });
  }
  prisma.$disconnect();
};

seedSuperAdmin();
