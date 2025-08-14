"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import SiginReminder from "@/app/components/SigninReminder";
import Trademark from "@/app/components/Trademark";

function SettingsPage() {
	const { data: session } = useSession();
	const [isMdodalOpen, setIsModalOpen] = useState(false);

	const confirmationModalRef = useRef(null);

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
	const deleteAccHandle = () => {
		async function deleteAcc() {
			const res = await fetch(
				`/api/users/user?useremail=${session?.user.email}`,
				{
					method: "DELETE",
				}
			);
			if (res.ok) {
				const data = await res.json();
				window.alert(data.message);
				signOut({ callbackUrl: "/" });
			}
		}
		deleteAcc();
	};

	return (
		<>
			<main>
				<p className="font-bold bg-gray-300 mb-4 text-center w-full sm:w-3/4 xl:w-1/2 rounded p-4 my-4 mx-auto">
					Account Settings
				</p>
				<div className="w-full sm:w-3/4 xl:w-1/2 bg-gray-200 rounded p-4 my-4 mx-auto">
					<p>This action can not be undone.</p>
					<p>
						You can always create a new account by signing in with an
						appropriate email.
					</p>
				</div>
				<button
					onClick={() => {
						setIsModalOpen(true);
						confirmationModalRef.current.showModal();
					}}
					className="mb-8 font-semibold block mx-auto bg-gray-100 rounded p-2 hover:bg-rose-400 active:bg-rose-500 hover:text-neutral-200 active:text-neutral-200"
				>
					Delete Account
				</button>
				<dialog
					ref={confirmationModalRef}
					className="border border-gray-600 rounded p-4"
				>
					<p className="text-lg text-center font-bold">Are you sure?</p>
					<div className="flex flex-row gap-2 mt-4 justify-center items-center">
						<button
							className="rounded bg-gray-100 p-2 hover:bg-rose-400 active:bg-rose-500 active:text-neutral-200 hover:text-neutral-200"
							onClick={() => {
								setIsModalOpen(false);
								confirmationModalRef.current.close();
							}}
						>
							Cancel
						</button>
						<button
							onClick={deleteAccHandle}
							className="rounded bg-green-500 active:bg-green-600 text-neutral-200 p-2 "
						>
							Confirm
						</button>
					</div>
				</dialog>
				<Trademark />
			</main>
		</>
	);
}

export default SettingsPage;
