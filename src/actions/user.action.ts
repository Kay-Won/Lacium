"use server"

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    const {userId} = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const exisitingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (exisitingUser) {
      const isBadName = exisitingUser.name?.includes("${");

      if (isBadName) {
        const updatedUser = await prisma.user.update({
          where: { clerkId: userId },
          data: {
            name: `${user.firstName || ""} ${user.lastName || ""}`,
          },
        });

        console.log("Repaired bad user name:", updatedUser.name);
        return updatedUser;
      }

      return exisitingUser;
    }

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      }
    })

    return dbUser;

  } catch (error) {
    console.log("Error syncing user:", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}