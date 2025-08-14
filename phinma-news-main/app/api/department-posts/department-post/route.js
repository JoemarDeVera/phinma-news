import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	try {
		const departmentPost = await prisma.departmentPost.findUnique({
			where: {
				id: id,
			},
			include: {
				postedWith: true,
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
		return NextResponse.json(
			{
				departmentPost: departmentPost,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Failed to get post" });
	} finally {
		await prisma.$disconnect();
	}
}

export async function POST(req, res) {
	const { content, departmentId, media } = await req.json();

	try {
		const newPost = await prisma.departmentPost.create({
			include: {
				postedWith: true,
				comments: true,
				media: true,
				likedBy: true,
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
				postedWith: {
					connect: { id: departmentId },
				},
			},
		});
		return NextResponse.json({ newPost: newPost }, { status: 200 });
	} catch (error) {
		console.error("Error creating department post:", error);
		return NextResponse.json(
			{ error: "Failed to create department post." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function PUT(req, res) {
	const { postId, newContent, newMedia } = await req.json();
	try {
		await prisma.departmentPost.update({
			where: {
				id: postId,
			},
			include: {
				postedWith: true,
				likedBy: true,
				comments: {
					include: {
						commentedBy: true,
						commentFor: true,
					},
				},
			},
			data: {
				content: newContent,
				// media: {
				// 	set: newMedia.map((m) => ({ id: m.id })),
				// },
			},
		});

		return NextResponse.json({ message: "Updated post!" }, { status: 200 });
	} catch (error) {
		console.error("Error updating department post:", error);
		return NextResponse.json(
			{ error: "Failed to update department post." },
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
		await prisma.departmentPost.delete({
			where: {
				id: postId,
			},
		});

		return NextResponse.json(
			{ message: "Successfully deleted!" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting department post:", error);
		return NextResponse.json(
			{ error: "Failed to delete department post." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
