import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	const { searchParams } = new URL(req.url);
	const useremail = searchParams.get("useremail");

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: useremail,
			},
			include: {
				department: true,
			},
		});
		let userPosts = [];
		if (user) {
			const posts = await prisma.post.findMany({
				orderBy: {
					createdAt: "desc",
				},
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

// Update profile page (bio and course)
export async function PUT(req, res) {
	const { bio, course, id } = await req.json();
	try {
		const updatedUser = await prisma.user.update({
			where: {
				id: id,
			},
			include: {
				department: true,
			},
			data: {
				biography: bio,
				course: course,
			},
		});
		const posts = await prisma.post.findMany({
			where: {
				postedById: id,
			},
			include: {
				likedBy: true,
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
				user: updatedUser,
				posts: posts,
			},

			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Failed to updated profile" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function DELETE(req, res) {
	const { searchParams } = new URL(req.url);
	const useremail = searchParams.get("useremail");
	try {
		await prisma.user.delete({
			where: {
				email: useremail,
			},
		});
		return NextResponse.json(
			{
				message: "Account deleted, you'll be redirected to the sign in page.",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Failed to delete profile" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
