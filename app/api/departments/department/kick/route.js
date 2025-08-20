import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, res) {
	const { departmentId, userId } = await req.json();
	try {
		const updatedDept = await prisma.department.update({
			where: {
				id: departmentId,
			},
			include: {
				members: true,
			},
			data: {
				members: {
					disconnect: {
						id: userId,
					},
				},
			},
		});
		return NextResponse.json({ updatedDept: updatedDept }, { status: 200 });
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
