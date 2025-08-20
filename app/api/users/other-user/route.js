import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
			include: {
				department: true,
			},
		});
		let userPosts = [];
		if (user) {
			const posts = await prisma.post.findMany({
				where: {
					postedById: user.id,
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
			if (posts) {
				userPosts = [...posts];
			}
		}
		return NextResponse.json(
			{ user: user, userPosts: userPosts },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Failed to get user" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
