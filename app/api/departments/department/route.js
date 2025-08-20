import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
	const { searchParams } = new URL(req.url);
	const departmentId = searchParams.get("department_id");
	try {
		const department = await prisma.department.findUnique({
			where: {
				id: departmentId,
			},
			include: {
				members: true,
				admin: true,
			},
		});
		return NextResponse.json({ department }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: "Failed to get department",
			},
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function POST(req, res) {
	const { departmentName, departmentDescription, userId, departmentLogo } =
		await req.json();

	const memberIds = [userId];

	const admins = process.env.ADMINS.split(",");

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				department: true,
			},
		});

		if (!departmentName || !userId) {
			return NextResponse.json(
				{
					message: "Invalid data. Both departmentName and userId are required.",
				},
				{ status: 400 }
			);
		}

		if (!admins.includes(user.email)) {
			return NextResponse.json(
				{ message: "Email is not recognized as an admin." },
				{ status: 403 }
			);
		}

		if (user.department.length > 0) {
			return NextResponse.json(
				{
					message: "You're already a member of a department.",
				},
				{ status: 403 }
			);
		}

		const newDepartment = await prisma.department.create({
			include: {
				members: true,
				admin: true,
			},
			data: {
				name: departmentName,
				description: departmentDescription,
				image: departmentLogo,
				admin: {
					connect: { id: userId },
				},
				members: {
					connect: memberIds.map((id) => ({ id })),
				},
			},
		});

		return NextResponse.json(
			{ message: "Department Created!", newDepartment: newDepartment },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating department:", error.message);
		return NextResponse.json(
			{ error: "Failed to create department." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function PUT(req, res) {
	const { departmentId, newName, newDesc, newImg } = await req.json();
	try {
		const updatedDept = await prisma.department.update({
			where: {
				id: departmentId,
			},
			include: {
				members: true,
				admin: true,
			},
			data: {
				name: newName,
				description: newDesc,
				image: newImg,
			},
		});

		return NextResponse.json({ updatedDept: updatedDept }, { status: 200 });
	} catch (error) {
		console.error("Error updating department:", error.message);
		return NextResponse.json(
			{ error: "Failed to update department." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
