import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	try {
		const department_post = await prisma.departmentPost.findUnique({
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
			{ department_post: department_post },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Failed to get trending post" });
	} finally {
		await prisma.$disconnect();
	}
}
