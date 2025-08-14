"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Department from "@/app/components/Department";
import { useSession } from "next-auth/react";
import SiginReminder from "@/app/components/SigninReminder";

function DepartmentPage() {
	const { data: session } = useSession();
	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	const [currentDepartment, setCurrentDepartment] = useState(null);
	const [currentDepartmentPosts, setCurrentDepartmentPosts] = useState([]);

	useEffect(() => {
		async function getDepartment() {
			try {
				const res = await fetch(
					`/api/departments/department?department_id=${id}`
				);
				if (res.ok) {
					const data = await res.json();
					setCurrentDepartment(data.department);
					const dept_posts_res = await fetch(
						`/api/department-posts/posted-with?id=${id}`
					);
					if (dept_posts_res) {
						const data = await dept_posts_res.json();
						setCurrentDepartmentPosts(data.departmentPosts);
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
		getDepartment();
	}, []);

	if (!session) {
		return <SiginReminder />;
	}

	if (currentDepartment && currentDepartmentPosts) {
		return (
			<>
				<Department
					department_id={currentDepartment.id}
					department_desc={currentDepartment.description}
					department_name={currentDepartment.name}
					department_posts={currentDepartmentPosts}
					admin={currentDepartment.admin}
					members={currentDepartment.members}
					image={currentDepartment.image}
					setCurrentDepartment={setCurrentDepartment}
					setCurrentDepartmentPosts={setCurrentDepartmentPosts}
				/>
			</>
		);
	}
}

export default DepartmentPage;
