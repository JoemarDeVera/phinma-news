import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, res) {
	const { postId, comment, commentedById } = await req.json();
	console.log(postId, "POST ID HERE");
	console.log(commentedById, "USER ID HERE");
	try {
		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				comments: {
					include: {
						commentedBy: true,
						commentFor: true,
					},
				},
			},
		});

		const newComment = await prisma.postComment.create({
			include: {
				commentFor: true,
				commentedBy: true,
			},
			data: {
				comment: comment,
				commentFor: {
					connect: {
						id: postId,
					},
				},
				commentedBy: {
					connect: {
						id: commentedById,
					},
				},
			},
		});

		const updatedComments = [...post.comments, newComment];

		const updatedPost = await prisma.post.update({
			where: {
				id: postId,
			},
			include: {
				comments: {
					include: {
						commentedBy: true,
						commentFor: true,
					},
				},
			},
			data: {
				comments: {
					set: updatedComments,
				},
			},
		});
		return NextResponse.json({ updatedPost: updatedPost }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Failed to post comment" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
