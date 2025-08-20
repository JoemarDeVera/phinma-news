import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

// GET - Fetch all departments
export async function GET(req, res) {
	try {
		const departments = await prisma.department.findMany({
			include: {
				admin: true,
				_count: {
					select: {
						members: true,
						departmentPosts: true,
					}
				}
			}
		});
		return NextResponse.json({ departments }, { status: 200 });
	} catch (error) {
		console.error("GET departments error:", error);
		return NextResponse.json(
			{ message: "Failed to get departments" }, 
			{ status: 500 }
		);
	}
}

// POST - Create a new department (ADMIN ONLY)
export async function POST(req) {
	try {
		// Check if user is authenticated
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json(
				{ message: "You must be logged in to create a department" }, 
				{ status: 401 }
			);
		}

		// Get the request body
		const body = await req.json();
		const { name, description, image } = body;

		// Validate required fields
		if (!name || !name.trim()) {
			return NextResponse.json(
				{ message: "Department name is required" }, 
				{ status: 400 }
			);
		}

		// Find the user in database
		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		});


		// **ADMIN CHECK: Only admins can create departments**
		if (!session.user.isAdmin) {
  return NextResponse.json(
    { message: "Access denied. Only administrators can create departments." }, 
    { status: 403 }
  );
}

		// Check if department name already exists
		const existingDepartment = await prisma.department.findUnique({
			where: { name: name.trim() }
		});

		if (existingDepartment) {
			return NextResponse.json(
				{ message: "Department with this name already exists" }, 
				{ status: 409 }
			);
		}

		// Create the department
		const newDepartment = await prisma.department.create({
			data: {
				name: name.trim(),
				description: description?.trim() || "",
				image: image || null,
				adminId: user.id,
				members: {
					connect: { id: user.id }
				}
			},
			include: {
				admin: true,
				members: true
			}
		});

		return NextResponse.json(
			{ 
				message: "Department created successfully", 
				department: newDepartment 
			}, 
			{ status: 201 }
		);

	} catch (error) {
		console.error("POST department error:", error);
		
		if (error.code === 'P2002') {
			return NextResponse.json(
				{ message: "Department name must be unique" }, 
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{ message: "Failed to create department" }, 
			{ status: 500 }
		);
	}
}