import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	try {
		const posts = await prisma.post.findMany({
			orderBy: {
				createdAt: "desc",
			},
			where: {
				postedBy: {
					id: id,
				},
			},
			include: {
				postedBy: true,
				likedBy: true,
				media: true,
				comments: {
					include: {
						commentedBy: true,
						commentFor: true,
					},
				},
			},
		});
		return NextResponse.json({ posts: posts }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Failed to get posts" });
	} finally {
		await prisma.$disconnect();
	}
}
