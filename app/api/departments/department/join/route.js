import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, res) {
	const { departmentId, userId } = await req.json();
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				department: true,
			},
		});

		// prevent user from joining multiple departments
		if (user.department.length > 0) {
			return NextResponse.json(
				{
					message: "You're already a member of a department.",
				},
				{ status: 403 }
			);
		}

		const dept = await prisma.department.findUnique({
			where: {
				id: departmentId,
			},
			include: {
				members: true,
			},
		});

		let newMembers = [dept.members];

		const isIncluded = dept.members.some((member) => {
			return member.id === userId;
		});

		if (!isIncluded) {
			newMembers = [...dept.members, user];
		}

		const updatedMembers = await prisma.department.update({
			where: {
				id: departmentId,
			},
			include: {
				members: true,
			},
			data: {
				members: {
					connect: newMembers.map((user) => ({
						id: user.id,
					})),
				},
			},
		});

		return NextResponse.json(
			{ updatedMembers: updatedMembers },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Failed to update members!" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
