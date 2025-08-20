import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	try {
		const departmentPosts = await prisma.departmentPost.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				comments: {
					include: {
						commentedBy: true,
						commentFor: true,
					},
				},
				postedWith: true,
				likedBy: true,
				media: true,
			},
		});
		return NextResponse.json(
			{ departmentPosts: departmentPosts },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Failed to get department posts" });
	} finally {
		await prisma.$disconnect();
	}
}
