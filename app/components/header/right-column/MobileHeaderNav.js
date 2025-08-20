"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function MobileHeaderNav() {
	const [headerMenuVisible, setHeaderMenuVisible] = useState(false);
	const [accountMenuVisible, setAccountMenuVisible] = useState(false);
	const headerMenuRef = useRef(null);
	const accountMenuRef = useRef(null);
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!headerMenuRef.current.contains(event.target)) {
				setHeaderMenuVisible(false);
			}
		};
		if (headerMenuVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [headerMenuVisible]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!accountMenuRef.current.contains(event.target)) {
				setAccountMenuVisible(false);
			}
		};
		if (accountMenuVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [accountMenuVisible]);

	const accMenuClickHandle = (url) => {
		router.push(url);
		setAccountMenuVisible(false);
	};

	const navClickHadle = (url) => {
		router.push(url);
		setHeaderMenuVisible(false);
	};

	return (
		<>
			<div className="sm:hidden flex flex-row items-center">
				<div
					className="relative"
					ref={headerMenuRef}
				>
					<button
						onClick={() => setHeaderMenuVisible((prevState) => !prevState)}
					>
						<span className="material-symbols-outlined size-32 text-neutral-300 align-bottom active:text-neutral-100">
							more_vert
						</span>
					</button>
					<nav
						className={`${
							headerMenuVisible ? "block" : "hidden"
						} absolute right-0 mt-4 bg-neutral-800 border-2 border-neutral-900 p-3 rounded`}
					>
						<ul>
							<li>
								<button
									onClick={() => navClickHadle("/home")}
									className="active:text-neutral-50"
								>
									<span className="material-symbols-outlined size-32 align-bottom mb-2 text-neutral-200 active-green-500 ">
										house
									</span>
								</button>
							</li>

							<li>
								<button
									onClick={() => navClickHadle("/departments")}
									className="active:text-neutral-50"
								>
									<span className="material-symbols-outlined size-32 align-bottom text-neutral-200 active-green-500 ">
										groups
									</span>
								</button>
							</li>
						</ul>
					</nav>
				</div>
				<div
					className="relative"
					ref={accountMenuRef}
				>
					<button
						onClick={() => setAccountMenuVisible((prevState) => !prevState)}
						className="border block border-green-700 active:border-green-900 focus-within:border-green-900 rounded-full"
					>
						{session?.user ? (
							<Image
								src={session.user.image}
								alt={`Profile of ${session.user.name}`}
								height={34}
								width={34}
								className="rounded-full"
								style={{ minWidth: "34px" }}
							/>
						) : (
							<Image
								src={"/images/default_user_img.webp"}
								alt="Default image for users"
								height={34}
								width={34}
								className="rounded-full"
								style={{ minWidth: "34px" }}
							/>
						)}
					</button>
					<div
						className={`${
							accountMenuVisible ? "block" : "hidden"
						} absolute right-0 w-60 bg-neutral-800 border-2 border-neutral-900 p-3 rounded text-neutral-50 mt-4 text-sm`}
					>
						<div className="flex flex-row items-center gap-2">
							{session?.user ? (
								<Image
									src={session.user.image}
									alt={`Profile of ${session.user.name}`}
									width={38}
									height={38}
									className="rounded-full"
								/>
							) : (
								<Image
									src={"/images/default_user_img.webp"}
									alt="Default image for user"
									width={38}
									height={38}
									className="rounded-full"
								/>
							)}
							<div>
								<p className="m-0">{session?.user.name}</p>
								<button
									onClick={() => accMenuClickHandle("/profile")}
									className="text-xs m-0 block text-sky-500 active:text-sky-700"
								>
									{" "}
									See your profile
								</button>
							</div>
						</div>
						<hr className="border-neutral-200 my-3" />
						<ul>
							<li>
								<button
									className="py-1 block text-neutral-50 active:text-neutral-400"
									onClick={() => accMenuClickHandle("/feedbacks")}
								>
									<span className="material-symbols-outlined text-sky-500 align-middle size-20 mr-2">
										rate_review
									</span>
									Give Feedback
								</button>
							</li>
							<li>
								<button
									className="py-1 block text-neutral-50 active:text-neutral-400"
									onClick={() => accMenuClickHandle("/settings")}
								>
									<span className="material-symbols-outlined text-gray-500 align-middle size-20 mr-2">
										settings
									</span>
									Settings
								</button>
							</li>

							<li>
								<button
									className="py-1 block text-neutral-50 active:text-neutral-400"
									onClick={() => signOut({ callbackUrl: "/" })}
								>
									<span className="material-symbols-outlined text-rose-500 align-middle size-20 mr-2">
										logout
									</span>
									Logout
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}

export default MobileHeaderNav;
