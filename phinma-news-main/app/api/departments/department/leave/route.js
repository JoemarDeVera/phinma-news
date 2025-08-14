import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, res) {
	const { departmentId, userId } = await req.json();
	try {
		const dept = await prisma.department.findUnique({
			where: {
				id: departmentId,
			},
			include: {
				members: true,
			},
		});

		const isLastMember = dept.members.length === 1;

		const isIncluded = dept.members.some((member) => {
			return member.id === userId;
		});

		if (isLastMember && isIncluded) {
			await prisma.department.delete({
				where: {
					id: departmentId,
				},
			});
			return NextResponse.json(
				{ message: "Department deleted!" },
				{ status: 200 }
			);
		} else if (!isLastMember && isIncluded) {
			await prisma.department.update({
				where: {
					id: departmentId,
				},
				include: {
					members: true,
				},
				data: {
					members: {
						disconnect: { id: userId },
					},
				},
			});
			return NextResponse.json(
				{ message: "Successfully Left" },
				{ status: 200 }
			);
		}
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
