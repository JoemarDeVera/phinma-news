import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	try {
		const post = await prisma.post.findUnique({
			orderBy: {
				createdAt: "desc",
			},
			where: {
				id: id,
			},
			include: {
				postedBy: true,
				media: true,
				likedBy: true,
				comments: {
					include: {
						commentedBy: true,
						commentFor: true,
					},
				},
			},
		});
		return NextResponse.json({ post: post }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Failed to get post" });
	} finally {
		await prisma.$disconnect();
	}
}

export async function POST(req, res) {
	const { content, postedBy, media } = await req.json();
	try {
		const newPost = await prisma.post.create({
			include: {
				postedBy: true,
				media: true,
			},
			data: {
				content: content,
				media: {
					createMany: {
						data: media.map((m) => {
							return {
								mediaUrl: m,
							};
						}),
					},
				},
				postedBy: {
					connect: { id: postedBy },
				},
			},
		});
		return NextResponse.json({ newPost: newPost }, { status: 200 });
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json(
			{ error: "Failed to create post." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function PUT(req, res) {
	const { postId, newContent, newMedia } = await req.json();
	try {
		await prisma.post.update({
			where: {
				id: postId,
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
			data: {
				content: newContent,
				// media: newMedia,
			},
		});

		return NextResponse.json({ message: "Updated post!" }, { status: 200 });
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

export async function DELETE(req, res) {
	const { searchParams } = new URL(req.url);
	const postId = searchParams.get("postId");
	try {
		await prisma.post.delete({
			where: {
				id: postId,
			},
		});

		return NextResponse.json(
			{ message: "Successfully deleted!" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting post:", error);
		return NextResponse.json(
			{ error: "Failed to delete post." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
