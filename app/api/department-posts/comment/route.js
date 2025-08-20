import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, res) {
	const { postId, comment, commentedById } = await req.json();
	try {
		const departmentPost = await prisma.departmentPost.findUnique({
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

		const newComment = await prisma.departmentPostComment.create({
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

		const updatedComments = [...departmentPost.comments, newComment];

		const updatedPost = await prisma.departmentPost.update({
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
