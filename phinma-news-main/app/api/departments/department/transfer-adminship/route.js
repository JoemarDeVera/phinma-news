import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, res) {
	const { newAdminId, departmentId } = await req.json();
	try {
		const updatedDepartment = await prisma.department.update({
			where: {
				id: departmentId,
			},
			include: {
				admin: true,
				members: true,
			},
			data: {
				admin: {
					connect: { id: newAdminId },
				},
			},
		});
		return NextResponse.json(
			{ updatedDepartment: updatedDepartment },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error transfering adminship:", error);
		return NextResponse.json(
			{ error: "Failed to transfer adminship." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
