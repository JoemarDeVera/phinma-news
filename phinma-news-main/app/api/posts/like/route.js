import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, res) {
	const { postId, likedById } = await req.json();
	try {
		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				likedBy: true,
			},
		});

		const alreadyLiked = post.likedBy.some((user) => {
			return user.id === likedById;
		});

		if (alreadyLiked) {
			const updatedPost = await prisma.post.update({
				where: {
					id: postId,
				},
				include: {
					likedBy: true,
				},
				data: {
					likedBy: {
						disconnect: {
							id: likedById,
						},
					},
				},
			});
			return NextResponse.json({ updatedPost: updatedPost }, { status: 200 });
		} else {
			const updatedPost = await prisma.post.update({
				where: {
					id: postId,
				},
				include: {
					likedBy: true,
				},
				data: {
					likedBy: {
						connect: {
							id: likedById,
						},
					},
				},
			});
			return NextResponse.json({ updatedPost: updatedPost }, { status: 200 });
		}
	} catch (error) {
		console.error("Error updating post:", error);
		return NextResponse.json(
			{ error: "Failed to update post." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
