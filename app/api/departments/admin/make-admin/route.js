// app/api/admin/make-admin/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";


const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export async function POST(req) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{ message: "Email is required" }, 
				{ status: 400 }
			);
		}

		const user = await prisma.user.update({
			where: { email: email },
			data: { isAdmin: true }
		});

		return NextResponse.json(
			{ 
				message: `User ${user.email} is now an admin`,
				user: user 
			}, 
			{ status: 200 }
		);

	} catch (error) {
		console.error("Make admin error:", error);
		
		if (error.code === 'P2025') {
			return NextResponse.json(
				{ message: "User not found" }, 
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Failed to make user admin" }, 
			{ status: 500 }
		);
	}



function RefreshSessionButton() {
  const { update } = useSession();

  return (
    <button
      onClick={() => update()}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Refresh Session
    </button>
  );
}

}