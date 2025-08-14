"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import TrendingNews from "../TrendingNews";
import JoinedDepartment from "../JoinedDepartment";
import Trademark from "../../Trademark";

function MobileleftColumn({ department }) {
	const sidebarRef = useRef(null);

	// lock scroll when modal is open
	const [isMdodalOpen, setIsModalOpen] = useState(false);
	useEffect(() => {
		if (isMdodalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isMdodalOpen]);

	return (
		<div className="relative mt-2 xs:mt-4 md:hidden px-1 py-1 rounded ">
			<button
				onClick={() => {
					setIsModalOpen(true);
					sidebarRef.current.showModal();
				}}
				className="bg-gray-200 p-1 rounded"
			>
				<span className="material-symbols-outlined block mx-auto size-32 align-middle text-gray-500">
					more_vert
				</span>
			</button>
			<dialog
				ref={sidebarRef}
				className={` absolute mt-10 bg-gray-100 p-2 left-0 top-0 bottom-0`}
			>
				<button
					onClick={() => {
						setIsModalOpen(false);
						sidebarRef.current.close();
					}}
					className="bg-gray-200 p-1 rounded active:text-rose-500"
				>
					<span className="material-symbols-outlined block mx-auto size-32 align-middle text-gray-500">
						close
					</span>
				</button>
				<JoinedDepartment department={department} />
				<TrendingNews />
				<footer className="bg-gray-200 p-2 rounded mt-4 mb-2">
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
			</dialog>
		</div>
	);
}

export default MobileleftColumn;
