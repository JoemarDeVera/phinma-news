"use client";

import LeftColumn from "./left-column/LeftColumn";
import RightColumn from "./right-column/RightColumn";
import { useState, useEffect } from "react";

function Header() {
	const [allUsers, setAllusers] = useState([]);
	const [allDept, setAllDept] = useState([]);

	useEffect(() => {
		async function getAll() {
			const usersRes = await fetch(`/api/users`);
			if (usersRes.ok) {
				const data = await usersRes.json();
				setAllusers(data.users);
			}
			const deptRes = await fetch(`/api/departments`);
			if (deptRes.ok) {
				const data = await deptRes.json();
				setAllDept(data.departments);
			}
		}
		getAll();
	}, []);

	return (
		<header className="z-50 sticky top-0 py-2 px-3 sm:px-8 bg-green-600 flex flex-row gap-3 justify-between items-center">
			<LeftColumn allNames={[...allDept, ...allUsers]} />
			<RightColumn />
		</header>
	);
}

export default Header;
