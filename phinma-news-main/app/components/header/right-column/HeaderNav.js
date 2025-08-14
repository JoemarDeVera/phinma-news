"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function HeaderNav() {
	const [accountMenuVisible, setAccountMenuVisible] = useState(false);
	const accountMenuRef = useRef(null);
	const router = useRouter();
	const { data: session } = useSession();

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

	return (
		<nav className="hidden sm:block">
			<ul className="flex flex-row gap-3 items-center text-neutral-300">
				<li>
					<Link
						href={"/home"}
						className="hover:text-neutral-100 active:text-green-500 bg-green-800 rounded-full block p-1"
					>
						<span className="material-symbols-outlined size-32 align-bottom">
							house
						</span>
					</Link>
				</li>
				<li>
					<Link
						href="/departments"
						className="hover:text-neutral-100 active:text-green-500 bg-green-800 rounded-full block p-1"
					>
						<span className="material-symbols-outlined size-32 align-bottom">
							groups
						</span>
					</Link>
				</li>
				<li
					className="relative"
					ref={accountMenuRef}
				>
					<button
						onClick={() => setAccountMenuVisible((prevState) => !prevState)}
						className="border border-green-700 active:border-green-800 block rounded-full"
					>
						{session?.user ? (
							<Image
								src={session.user.image}
								alt={`Profile of ${session.user.name}`}
								height={40}
								width={40}
								className="rounded-full"
							/>
						) : (
							<Image
								src={"/images/default_user_img.webp"}
								alt="Default image for users"
								height={40}
								width={40}
								className="rounded-full"
							/>
						)}
					</button>
					<div
						className={`${
							accountMenuVisible ? "block" : "hidden"
						} absolute right-0 w-72 bg-neutral-800 border-2 border-neutral-900 p-3 rounded text-neutral-50 mt-4`}
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
									onClick={() => {
										router.push("/profile");
										setAccountMenuVisible(false);
									}}
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
									onClick={() => signOut({ callbackUrl: "/" })}
									className="py-1 block text-neutral-50 active:text-neutral-400"
								>
									<span className="material-symbols-outlined text-rose-500 align-middle size-20 mr-2">
										logout
									</span>
									Logout
								</button>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</nav>
	);
}

export default HeaderNav;
