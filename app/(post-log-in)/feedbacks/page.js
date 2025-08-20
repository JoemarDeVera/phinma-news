"use client";

import SiginReminder from "@/app/components/SigninReminder";
import Trademark from "@/app/components/Trademark";
import { useSession } from "next-auth/react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

function FeedbackPage() {
	const { data: session } = useSession();
	// since feedbacks are mostly meant for the devs
	// this page has no backend, intentional

	const [isMdodalOpen, setIsModalOpen] = useState(false);
	const modalRef = useRef(null);

	// lock scroll when modal is open
	useEffect(() => {
		if (isMdodalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isMdodalOpen]);

	if (!session) {
		return <SiginReminder />;
	}
	return (
		<>
			<main>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						modalRef.current.showModal();
						setIsModalOpen(true);
					}}
					className="w-full sm:w-3/4 xl:w-1/2 flex flex-col gap-2 items-end mx-auto"
				>
					<textarea
						required
						placeholder="Write your feedback"
						className="resize-none h-40 bg-gray-200 rounded p-4 mt-12 mb-2  block w-full"
					/>
					<button
						type="submit"
						className="p-2 bg-gray-200 rounded hover:bg-green-500 hover:text-neutral-200 active:text-neutral-200 active:bg-green-600"
					>
						Submit
					</button>
				</form>
				<dialog
					ref={modalRef}
					className=" p-4 rounded border border-gray-600 w-full sm:w-3/4 xl:w-1/2"
				>
					<div className="flex flex-col items-center justify-center gap-2">
						<p className="font-semibold text-center">
							We have received your feedback. Thank you for you taking your time
							to write to us.
						</p>
						<button
							onClick={() => {
								modalRef.current.close();
								setIsModalOpen(false);
							}}
							className="p-2 bg-gray-200 rounded hover:bg-green-500 hover:text-neutral-200 active:text-neutral-200 active:bg-green-600"
						>
							Close
						</button>
					</div>
				</dialog>
				<div className="p-2 bg-gray-300 my-8 w-full sm:w-3/4 xl:w-1/2 mx-auto rounded">
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
				</div>
			</main>
		</>
	);
}

export default FeedbackPage;
