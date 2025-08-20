"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function LeftColumn({ allNames }) {
	const router = useRouter();
	const { data: session } = useSession();
	const [mobileSearchbarVisible, setMobileSearchbarVisible] = useState(false);
	const [searchbarInput, setSearchbarInput] = useState("");
	const [searchResultVisible, setSearchResultVisible] = useState(false);
	const [mobileSearchbarInput, setMobileSearchbarInput] = useState("");
	const [mobileSearchResultVisible, setMobileSearchResultVisible] =
		useState(false);
	const [allSearchResults, setAllSearchResults] = useState(allNames);
	const [currentUser, setCurrentUser] = useState(null);

	const fieldsetRef = useRef(null);
	const searchbarRef = useRef(null);
	const mobileSearchbarRef = useRef(null);

	useEffect(() => {
		async function getUser() {
			const res = await fetch(
				`/api/users/user?useremail=${session?.user.email}`
			);
			if (res.ok) {
				const data = await res.json();
				setCurrentUser(data?.user);
			}
		}
		getUser();
	}, [session]);

	useEffect(() => {
		const filteredResults = allNames.filter((item) => {
			return item?.name.toLowerCase().includes(searchbarInput);
		});
		setAllSearchResults(filteredResults);
	}, [searchbarInput]);

	useEffect(() => {
		const filteredResults = allNames.filter((item) => {
			return item?.name.toLowerCase().includes(mobileSearchbarInput);
		});
		setAllSearchResults(filteredResults);
	}, [mobileSearchbarInput]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!fieldsetRef.current.contains(event.target)) {
				setMobileSearchbarVisible(false);
				mobileSearchbarRef.current.value = "";
			}
		};
		if (mobileSearchbarVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [mobileSearchbarVisible]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!fieldsetRef.current.contains(event.target)) {
				setSearchResultVisible(false);
				searchbarRef.current.value = "";
			}
		};
		if (searchResultVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [searchResultVisible]);

	return (
		<div className="flex flex-row items-center gap-2 xs:gap-3">
			<Link href={"/home"}>
				<Image
					src={"/logo/pn_logo_medium.webp"}
					alt="Phinma News Logo"
					width={50}
					height={40}
					style={{ minWidth: "50px" }}
				/>
			</Link>
			<fieldset
				ref={fieldsetRef}
				className="bg-neutral-50 flex flex-row items-center rounded-full border static xs:relative"
			>
				<label
					onClick={() => {
						setMobileSearchbarVisible((prevState) => !prevState);
					}}
					className="cursor-pointer text-neutral-700 rounded-full active:text-neutral-800"
					htmlFor="searchbar"
				>
					<span className="material-symbols-outlined size-24 wght-300 align-bottom py-2 px-2">
						search
					</span>
				</label>
				{/* search bar */}
				<input
					autoComplete="off"
					ref={searchbarRef}
					onChange={(e) => {
						setSearchbarInput(e.target.value.toLowerCase());
						if (e.target.value !== "") {
							setSearchResultVisible(true);
						} else {
							setSearchResultVisible(false);
						}
					}}
					className="py-2 pr-4 outline-none rounded-r-full hidden xs:block xs:w-32 sm:w-48 text-sm bg-neutral-50"
					placeholder="Search"
					id="searchbar"
					type="search"
				/>
				<div
					className={`${searchResultVisible ? "xs:block" : "xs:hidden"} hidden`}
				>
					<div
						className={`absolute ${
							searchbarInput.length === 0 ? "hidden" : "flex"
						} bg-transparent text-white top-12 left-0 right-0 rounded overflow-hidden flex-col items-start`}
					>
						{allSearchResults.map((item) => {
							const isUser = item?.email;
							const routePath = !isUser
								? `/departments/department?id=${item.id}`
								: isUser && currentUser.id === item.id
								? "/profile"
								: `/profile/visit?id=${item.id}`;
							return (
								<button
									className="p-2 bg-gray-900 text-neutral-200 flex flex-row gap-1 items-center justify-start w-full text-start hover:bg-gray-950 active:text-green-500 text-xs sm:text-sm"
									key={item.id}
									onClick={() => {
										setSearchbarInput("");
										searchbarRef.current.value = "";
										setSearchResultVisible(false);
										router.push(routePath);
									}}
								>
									{item?.image && (
										<Image
											src={item?.image}
											alt={`picture of ${item.name}`}
											width={50}
											height={50}
											className="rounded-full block"
											style={{
												maxWidth: "20px",
												minWidth: "18px",
												aspectRatio: "1 / 1",
												objectPosition: "50% 50%",
												objectFit: "cover",
											}}
										/>
									)}
									<span>{item.name}</span>
								</button>
							);
						})}
					</div>
				</div>
				{/* mobile search bar */}
				<div
					className={`${
						mobileSearchbarVisible ? "block" : "hidden"
					} xs:hidden absolute left-0 right-0 top-14 bg-neutral-800 p-4`}
				>
					<input
						autoComplete="off"
						onChange={(e) => {
							setMobileSearchbarInput(e.target.value.toLowerCase());
							if (e.target.value !== "") {
								setMobileSearchResultVisible(true);
							} else {
								setMobileSearchResultVisible(false);
							}
						}}
						ref={mobileSearchbarRef}
						placeholder="search"
						type="search"
						className={` bg-neutral-50 text-sm w-full text-neutral-600 rounded-full py-2 px-4 outline-none`}
					/>
					<div
						className={`${
							mobileSearchResultVisible ? "flex" : "hidden"
						} bg-transparent text-white rounded overflow-hidden items-start mt-4 flex-col`}
					>
						{allSearchResults.map((item) => {
							const isUser = item?.email;
							const routePath = !isUser
								? `/departments/department?id=${item.id}`
								: isUser && currentUser.id === item.id
								? "/profile"
								: `/profile/visit?id=${item.id}`;
							return (
								<button
									className="p-2 bg-gray-900 text-neutral-200  flex flex-row gap-1 items-center justify-start w-full text-start  hover:bg-gray-950 active:text-green-500"
									onClick={() => {
										setMobileSearchResultVisible(false);
										setMobileSearchbarVisible(false);
										setMobileSearchbarInput("");
										mobileSearchbarRef.current.value = "";
										router.push(routePath);
									}}
									key={item.id}
								>
									{item?.image && (
										<Image
											src={item?.image}
											alt={`picture of ${item.name}`}
											width={50}
											height={50}
											className="rounded-full block"
											style={{
												maxWidth: "20px",
												minWidth: "18px",
												aspectRatio: "1 / 1",
												objectPosition: "50% 50%",
												objectFit: "cover",
											}}
										/>
									)}
									<span>{item.name}</span>
								</button>
							);
						})}
					</div>
				</div>
			</fieldset>
		</div>
	);
}

export default LeftColumn;
