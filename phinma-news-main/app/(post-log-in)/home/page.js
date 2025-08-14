"use client";

import SiginReminder from "@/app/components/SigninReminder";
import LeftColumn from "../../components/homepage/left-column/LeftColumn";
import OuterRightColumn from "../../components/homepage/outer-right-column/OuterRightColumn";
import RightColumn from "../../components/homepage/right-column/RightColumn";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
	const { data: session } = useSession();

	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		async function getUser() {
			const res = await fetch(
				`/api/users/user?useremail=${session?.user.email}`
			);
			const data = await res.json();

			setCurrentUser(data.user);
		}
		getUser();
	}, [session]);

	const sessionStatus = currentUser !== null;

	return (
		<>
			{sessionStatus && (
				<main className="px-1 flex flex-col xs:flex-row gap-2">
					<LeftColumn />
					<RightColumn
						user_id={currentUser?.id}
						user_img={currentUser?.image}
						user_name={currentUser?.name}
					/>
					<OuterRightColumn />
				</main>
			)}
			{!sessionStatus && <SiginReminder />}
		</>
	);
}
