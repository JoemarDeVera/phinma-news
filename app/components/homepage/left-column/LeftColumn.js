"use client";

import Image from "next/image";
import Link from "next/link";
import TrendingNews from "../TrendingNews";
import JoinedDepartment from "../JoinedDepartment";
import MobileleftColumn from "./MobileLeftColumn";
import { useSession } from "next-auth/react";
import Trademark from "../../Trademark";
import { useState, useEffect } from "react";

function LeftColumn() {
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

	return (
		<>
			<div className="hidden md:block w-2/5 lg:w-1/3 max-w-sm rounded bg-gray-100 mt-4 p-2 min-h-screen">
				<div className="flex flex-row items-center gap-2">
					<Link href={"/profile"}>
						{currentUser?.image ? (
							<Image
								className="rounded-full"
								style={{
									minWidth: "38px",
									aspectRatio: "1 / 1",
									objectFit: "cover",
									objectPosition: "50% 50%",
								}}
								src={currentUser.image}
								alt={`Profile of ${currentUser.name}`}
								height={75}
								width={75}
							/>
						) : (
							<Image
								className="rounded-full"
								style={{
									minWidth: "38px",
									aspectRatio: "1 / 1",
									objectFit: "cover",
									objectPosition: "50% 50%",
								}}
								src={"/images/default_user_img.webp"}
								alt="Default image for user"
								height={75}
								width={75}
							/>
						)}
					</Link>

					<Link href={"/profile"}>
						<h1 className="text-lg font-bold leading-5 hover:underline active:text-gray-600">
							{currentUser?.name}
						</h1>
						<p className="font-semibold"></p>
					</Link>
				</div>
				<hr className="my-4 border-gray-400" />
				{/* replace props with fetched data */}
				{currentUser !== null && (
					<JoinedDepartment department={currentUser?.department} />
				)}
				<div className="xl:hidden">
					<TrendingNews />
				</div>
				<footer className="bg-gray-200 p-2 rounded my-4">
					<nav className="flex flex-row flex-wrap gap-3 text-sm justify-center my-1 text-neutral-600">
						<Link
							href={"/about"}
							className="hover:underline hover:text-neutral-800 active:text-neutral-950"
						>
							About
						</Link>
						<Link
							href={"/privacy-policy"}
							className="hover:underline hover:text-neutral-800 active:text-neutral-950"
						>
							Privacy Policy
						</Link>
						<Link
							href={"/home"}
							className="hover:underline hover:text-neutral-800 active:text-neutral-950"
						>
							Get App
						</Link>
					</nav>
					<Trademark />
				</footer>
			</div>
			<MobileleftColumn department={currentUser?.department} />
		</>
	);
}

export default LeftColumn;
