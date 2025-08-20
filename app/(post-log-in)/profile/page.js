"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SiginReminder from "@/app/components/SigninReminder";
import { useState, useEffect, useRef } from "react";
import AnyPost from "@/app/components/AnyPost";

function Profile() {
	const { data: session } = useSession();

	const [currentUser, setCurrentUser] = useState(null);
	const [isMdodalOpen, setIsModalOpen] = useState(false);
	const [userPosts, setUserPosts] = useState([]);

	const editProfileDialogRef = useRef(null);
	const editProfileFormRef = useRef(null);
	const bioInputRef = useRef(null);
	const courseInputRef = useRef(null);

	const sessionStatus = session !== null;
	const userStatus = currentUser !== null;

	// get current user
	useEffect(() => {
		async function getUser() {
			const res = await fetch(
				`/api/users/user?useremail=${session?.user.email}`
			);
			if (res.ok) {
				const data = await res.json();
				setCurrentUser(data?.user);
				setUserPosts(data?.userPosts);
			}
		}
		getUser();
	}, [session]);

	const updateDataHandle = async (e) => {
		e.preventDefault();
		const requestBody = {
			bio: bioInputRef.current.value,
			course: courseInputRef.current.value,
			id: currentUser?.id,
		};

		try {
			const res = await fetch(`/api/users/user`, {
				method: "PUT",
				headers: { "Content-type": "application/json" },
				body: JSON.stringify(requestBody),
			});
			if (res.ok) {
				const data = await res.json();

				setCurrentUser(data.user);
				setUserPosts(data.posts);
			} else {
				throw new Error("Failed to update profile");
			}
		} catch (error) {
			console.error(error);
		}
		e.target.reset();
		editProfileDialogRef.current.close();
		setIsModalOpen(false);
	};

	// lock scroll when modal is open
	useEffect(() => {
		if (isMdodalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isMdodalOpen]);

	return (
		<>
			{sessionStatus && (
				<main>
					<div className="w-full sm:w-3/4 xl:w-1/2 mx-auto p-4 bg-white">
						<section className="flex flex-col sm:flex-row items-center gap-4 justify-center bg-gray-200 p-2 rounded my-4">
							{session?.user ? (
								<Image
									src={session.user.image}
									alt={`Profile of ${session.user.name}`}
									width={65}
									height={65}
									className="rounded-full"
									style={{
										aspectRatio: "1 / 1",
										objectPosition: "50% 50%",
										objectFit: "cover",
									}}
								/>
							) : (
								<Image
									src={"/images/default_user_img.webp"}
									alt="default user image"
									width={65}
									height={65}
									className="rounded-full"
									style={{
										aspectRatio: "1 / 1",
										objectPosition: "50% 50%",
										objectFit: "cover",
									}}
								/>
							)}
							<div className=" text-center sm:text-left">
								<h1 className="text-lg font-bold">{session?.user.name}</h1>
							</div>
						</section>

						<section className="bg-gray-200 my-4 rounded">
							<div className=" bg-gray-300 flex flex-row items-center justify-between gap-2 rounded-t p-4">
								<h2 className="text-lg font-bold ">About</h2>
								<button
									className={`${userStatus ? "block" : "hidden"}`}
									onClick={() => {
										editProfileDialogRef.current.showModal();
										bioInputRef.current.value = currentUser.biography;
										courseInputRef.current.value = currentUser.course;
										setIsModalOpen(true);
									}}
								>
									<span className="material-symbols-outlined align-middle size-24 text-gray-600 hover:text-gray-800 active:text-green-700">
										edit
									</span>
								</button>
								<dialog
									ref={editProfileDialogRef}
									className="rounded border-2 border-gray-400 w-4/5 sm:w-3/5 sm:lg:w-1/2"
								>
									<form
										ref={editProfileFormRef}
										onSubmit={updateDataHandle}
										className="bg-gray-100 p-4 flex flex-col items-center justify-center gap-2 "
									>
										<textarea
											name="biography"
											ref={bioInputRef}
											className="bg-gray-100 border border-gray-400 rounded resize-none w-full h-40 p-2 text-sm"
											type="text"
											placeholder="Your biography"
										/>
										<input
											name="course"
											ref={courseInputRef}
											className="bg-gray-100 border border-gray-400 rounded w-full p-2 my-2"
											type="text"
											max={100}
											placeholder="Your course"
										/>
										<fieldset className="text-sm flex flex-row justify-center items-center gap-2">
											<button
												type="button"
												onClick={() => {
													editProfileDialogRef.current.close();
													setIsModalOpen(false);
												}}
												className="p-2 bg-gray-300 rounded active:bg-rose-400 active:text-neutral-200"
											>
												Cancel
											</button>
											<button
												className="p-2 bg-gray-300 rounded active:bg-green-500 active:neutral-text-200"
												type="submit"
											>
												Update
											</button>
										</fieldset>
									</form>
								</dialog>
							</div>

							<div className="my-4 px-4">
								<h3 className="font-semibold ">Biography</h3>
								<p className="my-2 p-4 bg-gray-300 rounded ">
									{currentUser?.biography}
								</p>
							</div>
							<div className="my-4 px-4">
								<h3 className="font-semibold ">Course</h3>
								<p className="p-4 bg-gray-300 rounded ">
									{currentUser?.course}
								</p>
							</div>
							<div className="my-4 px-4">
								<h3 className="font-semibold ">Department</h3>
								<ul className="py-4">
									{currentUser?.department.map((dept) => {
										return (
											<li key={dept.id}>
												<Link
													className="flex flex-row gap-2 items-center my-2 hover:underline active:text-green-700"
													href={`/departments/department?id=${dept.id}`}
												>
													{dept?.image ? (
														<Image
															src={dept.image}
															alt={`Logo of ${dept.name}`}
															height={80}
															width={80}
															className="block rounded-full"
															style={{
																maxWidth: "30px",
																minWidth: "24px",
																aspectRatio: "1 / 1",
																objectPosition: "50% 50%",
																objectFit: "cover",
															}}
														/>
													) : (
														<Image
															src={"/images/upang.webp"}
															alt={`Default logo for department`}
															height={80}
															width={80}
															className="block rounded-full"
															style={{
																maxWidth: "30px",
																minWidth: "24px",
																aspectRatio: "1 / 1",
																objectPosition: "50% 50%",
																objectFit: "cover",
															}}
														/>
													)}
													{dept.name}
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						</section>
						{/* content of post container will be replaced with post that matches the profiles id */}
						{userPosts.length < 1 && (
							<p className="text-center font-bold my-2">No post to display!</p>
						)}
						{userPosts && (
							<div className="bg-gray-200 my-4">
								{userPosts.map((post) => {
									const {
										content,
										id,
										postedBy,
										createdAt,
										likedBy,
										comments,
										media,
									} = post;
									return (
										<AnyPost
											key={id}
											content={content}
											postId={id}
											postedBy={postedBy}
											createdAt={createdAt}
											currentUserId={currentUser.id}
											likedBy={likedBy}
											comments={comments}
											setPosts={setUserPosts}
											media={media}
										/>
									);
								})}
							</div>
						)}
					</div>
				</main>
			)}
			{!session && <SiginReminder />}
		</>
	);
}

export default Profile;
