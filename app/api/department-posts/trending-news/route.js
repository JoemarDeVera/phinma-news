import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	try {
		const trending_posts = await prisma.departmentPost.findMany({
			take: 5,
			orderBy: {
				likedBy: {
					_count: "desc",
				},
			},
		});
		return NextResponse.json(
			{ trending_posts: trending_posts },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Failed to get trending post" });
	} finally {
		await prisma.$disconnect();
	}
}
