"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AnyPost from "./AnyPost";

function Department({
	department_id,
	department_desc,
	department_name,
	department_posts,
	members,
	admin,
	image,
	setCurrentDepartment,
	setCurrentDepartmentPosts,
}) {
	const router = useRouter();
	const { data: session } = useSession();
	const [currentUser, setCurrentUser] = useState(null);
	const [currentDeptMembers, setCurrentDeptMembers] = useState(members);
	const [currentAdmin, setCurrentAdmin] = useState(admin);
	const [isMdodalOpen, setIsModalOpen] = useState(false);
	const [action, setAction] = useState("");
	const [isMember, setIsMember] = useState(false);
	const [transferTo, setTransferTo] = useState("");
	const [selected, setSelected] = useState("");
	const [postContent, setPostContent] = useState("");
	const [memberToRemove, setMemberToRemove] = useState("");
	const [postMedia, setPostMedia] = useState([]);
	const [selectedImagesName, setSelectedImagesName] = useState([]);

	const [newName, setNewName] = useState("");
	const [newDesc, setNewDesc] = useState("");
	const [newImg, setNewImg] = useState("");
	const [selectedFileName, setSelectedFileName] = useState("");

	const actionConfirmationRef = useRef(null);
	const membersDropdownRef = useRef(null);
	const removeMemberRef = useRef(null);
	const editFormRef = useRef(null);
	const newDeptNameRef = useRef(null);
	const newDeptDescRef = useRef(null);
	const newDeptImgRef = useRef(null);

	useEffect(() => {
		async function getUser() {
			const res = await fetch(
				`/api/users/user?useremail=${session?.user.email}`
			);
			const data = await res.json();
			setCurrentUser(data?.user);
		}
		getUser();
	}, [session]);

	useEffect(() => {
		setIsMember(() =>
			currentDeptMembers.some((member) => {
				return member.id === currentUser?.id;
			})
		);
	}, [currentDeptMembers, currentUser]);

	// compare currentUser.id to admin.id to determine the role of the page's visitor
	// if comparison === true, show elements that are only available to admins

	const isAdmin = currentAdmin.id === currentUser?.id;
	const adminHref = isAdmin
		? "/profile"
		: `/profile/visit?id=${currentAdmin.id}`;

	// check if department id and user id is present
	// disable join/leave button if false
	const isIdReady =
		department_id !== ("" || null || undefined) &&
		currentUser?.id !== ("" || null || undefined);

	useEffect(() => {
		if (isMdodalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isMdodalOpen]);

	const confirmActionHandle = async () => {
		async function updateDepartmentMembers() {
			const res = await fetch(`/api/departments/department/${action}`, {
				method: "PUT",
				headers: { "Content-type": "application/json" },
				body: JSON.stringify({
					departmentId: department_id,
					userId: currentUser.id,
				}),
			});
			if (!res.ok) {
				const data = await res.json();
				window.alert(data?.message);
			} else if (res.ok && action === "join") {
				const data = await res.json();
				setCurrentDeptMembers(data?.updatedMembers.members);
			} else if (res.ok && action === "leave") {
				router.push("/departments");
			}
		}
		updateDepartmentMembers();
		actionConfirmationRef.current.close();
		setIsModalOpen(false);
	};

	const confirmTransferHandle = () => {
		async function updateAdmin() {
			const res = await fetch(
				`/api/departments/department/transfer-adminship`,
				{
					method: "PUT",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify({
						newAdminId: transferTo,
						departmentId: department_id,
					}),
				}
			);
			if (res.ok) {
				const data = await res.json();
				setCurrentAdmin(data.updatedDepartment.admin);
				setCurrentDeptMembers(data.updatedDepartment.members);
			}
		}
		updateAdmin();
		setTransferTo("");
		setSelected("");
		membersDropdownRef.current.close();
	};

	const createPostHandle = () => {
		async function createPost() {
			const res = await fetch(`/api/department-posts/department-post`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					content: postContent,
					departmentId: department_id,
					media: postMedia,
				}),
			});
			if (res.ok) {
				const dept_posts_res = await fetch(
					`/api/department-posts/posted-with?id=${department_id}`
				);
				if (dept_posts_res.ok) {
					const data = await dept_posts_res.json();
					setCurrentDepartmentPosts(data.departmentPosts);
					setSelectedImagesName("");
					setPostContent("");
					setPostMedia([]);
				}
			}
		}
		createPost();
	};

	const removeMemberHandle = async () => {
		const res = await fetch(`/api/departments/department/kick`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				departmentId: department_id,
				userId: memberToRemove,
			}),
		});
		if (res.ok) {
			const data = await res.json();
			setCurrentDeptMembers(data.updatedDept.members);
			setMemberToRemove("");
			removeMemberRef.current.close();
			window.alert("Successfully removed member!");
		}
	};

	const editDeptPageHandle = async () => {
		const res = await fetch(`/api/departments/department`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				departmentId: department_id,
				newName: newName,
				newDesc: newDesc,
				newImg: newImg,
			}),
		});
		if (res.ok) {
			const data = await res.json();
			setCurrentDepartment(data.updatedDept);
			setIsModalOpen(false);
			setNewDesc("");
			setNewName("");
			setNewImg("");
			setSelectedFileName("");
			setSelectedImagesName([]);
			editFormRef.current.close();
			window.alert("Successfully updated page!");
		}
	};

	if (currentUser && currentDeptMembers) {
		return (
			<>
				<main>
					<div className="w-full sm:w-3/4 xl:w-1/2 mx-auto p-4 bg-white">
						<section className="flex flex-col items-center gap-4 justify-center bg-gray-200 p-2 rounded my-4 relative">
							{image ? (
								<Image
									src={image}
									alt={`logo of ${department_name}`}
									width={100}
									height={100}
									className="rounded-full"
									style={{
										minWidth: "44px",
										aspectRatio: "1 / 1",
										objectPosition: "50% 50%",
										objectFit: "cover",
									}}
								/>
							) : (
								<Image
									src={"/images/upang.webp"}
									alt={"deafult logo for department"}
									width={100}
									height={100}
									className="rounded-full block"
									style={{
										minWidth: "44px",
										aspectRatio: "1 / 1",
										objectPosition: "50% 50%",
										objectFit: "cover",
									}}
								/>
							)}
							<div className=" text-center sm:text-left">
								<h1 className="text-lg font-bold">{department_name}</h1>
							</div>
							<button
								onClick={() => {
									setIsModalOpen(true);
									editFormRef.current.showModal();
									newDeptNameRef.current.value = department_name;
									newDeptDescRef.current.value = department_desc;
									setNewImg(image);
									setNewName(department_name);
									setNewDesc(department_desc);
								}}
								title="Edit page"
								className={`${
									isAdmin ? "block" : "hidden"
								} absolute top-2 right-2`}
							>
								<span className="material-symbols-outlined align-middle size-20 text-gray-600 hover:text-gray-800 active:text-green-700">
									edit
								</span>
							</button>
						</section>
						<dialog
							className="bg-gray-100 p-2 rounded border-2 border-gray-800 w-4/5 sm:w-3/4 lg:w-1/2"
							ref={editFormRef}
						>
							<label
								htmlFor="newname_123sfgasdad"
								className="font-semibold  block cursor-pointer"
							>
								New name
							</label>
							<input
								id="newname_123sfgasdad"
								ref={newDeptNameRef}
								onChange={(e) => {
									setNewName(e.target.value);
								}}
								className="text-sm p-2 w-full my-2 rounded bg-gray-200"
								type="text"
								maxLength={100}
								required
							/>
							<label
								htmlFor="newdesc_123123dfgdgwer"
								className="font-semibold mb-2 block cursor-pointer"
							>
								New description
							</label>
							<textarea
								id="newdesc_123123dfgdgwer"
								ref={newDeptDescRef}
								onChange={(e) => {
									setNewDesc(e.target.value);
								}}
								className="text-sm p-2 w-full h-40 resize-none rounded bg-gray-200"
								type="text"
								maxLength={420}
							/>
							<label
								htmlFor="newlogo_lasd1mlkdkzsf"
								className="font-semibold  block cursor-pointer"
							>
								Add new logo
							</label>
							<p>{selectedFileName}</p>
							<input
								ref={newDeptImgRef}
								id="newlogo_lasd1mlkdkzsf"
								accept="image/png, image/webp, image/jpeg, image/jpg"
								type="file"
								hidden
								onChange={(e) => {
									setSelectedFileName(e.target.files[0].name);

									const file = e.target.files[0];
									const reader = new FileReader();
									reader.onloadend = function () {
										const b64 = reader.result;

										setNewImg(b64);
									};
									reader.readAsDataURL(file);
								}}
							/>
							<div className="flex flex-row gap-2 items-center justify-center m-2">
								<button
									onClick={() => {
										editFormRef.current.close();
										setIsModalOpen(false);
										setNewName("");
										setNewDesc("");
										setNewImg("");
										setSelectedFileName("");
										newDeptImgRef.current.value = null;
									}}
									className="bg-neutral-300 hover:bg-rose-400 active:bg-rose-500 hover:text-neutral-200 active:text-neutral-200 text-sm p-2 rounded "
								>
									Cancel
								</button>
								<button
									onClick={editDeptPageHandle}
									className="bg-green-500 active:bg-green-600 text-sm p-2 rounded text-neutral-200"
								>
									Submit
								</button>
							</div>
						</dialog>
						<div
							className={`flex flex-row ${
								isAdmin ? "justify-between" : "justify-end"
							}  gap-2 py-2  ml-auto`}
						>
							<button
								onClick={() => {
									membersDropdownRef.current.showModal();
								}}
								className={`${
									isAdmin ? "block" : "hidden"
								} bg-gray-200 p-2 rounded text-xs hover:bg-green-500 hover:text-neutral-200  active:text-neutral-400 active:bg-green-600`}
							>
								Transfer Adminship
							</button>
							{isMember ? (
								<button
									onClick={() => {
										if (currentDeptMembers.length > 1 && isAdmin) {
											window.alert("Transfer adminship before leaving.");
										} else {
											actionConfirmationRef.current.showModal();
											setIsModalOpen(true);
											setAction("leave");
										}
									}}
									disabled={!isIdReady}
									className="bg-gray-200 p-2 rounded text-xs hover:bg-rose-500 hover:text-neutral-200  active:text-neutral-400 active:bg-rose-600"
								>
									Leave Department
								</button>
							) : (
								<button
									disabled={!isIdReady}
									onClick={() => {
										actionConfirmationRef.current.showModal();
										setIsModalOpen(true);
										setAction("join");
									}}
									className="bg-gray-200 p-2 rounded text-xs hover:bg-green-500 hover:text-neutral-200  active:text-neutral-400 active:bg-green-600"
								>
									Join Department
								</button>
							)}
						</div>
						<dialog
							ref={membersDropdownRef}
							className="bg-gray-200 p-2 rounded border border-gray-800"
						>
							<p className="text-center m-2 text-lg font-semibold">
								Transfer Adminship
							</p>
							<ul>
								{currentDeptMembers
									.filter((member) => {
										return member.id !== admin.id;
									})
									.map((member) => {
										return (
											<li
												key={member.id}
												className={`${
													selected === member.id
														? "bg-green-500"
														: "bg-gray-300"
												}  rounded my-4 w-full`}
											>
												<button
													onClick={() => {
														setTransferTo(member.id);
														setSelected(member.id);
													}}
													className={` flex flex-col gap-1 p-2`}
												>
													<p className="text-sm">{member.name} </p>
													<p className="text-gray-600 text-xs">
														{member.email}
													</p>
												</button>
											</li>
										);
									})}
							</ul>
							<div className="flex flex-row gap-2 justify-center items-center">
								<button
									onClick={() => {
										setTransferTo("");
										setSelected("");
										membersDropdownRef.current.close();
									}}
									className="bg-neutral-300 active:bg-rose-400 text-sm p-2 rounded"
								>
									Cancel
								</button>
								<button
									onClick={confirmTransferHandle}
									className="bg-green-500 active:bg-green-600 text-sm p-2 rounded text-neutral-200"
								>
									Transfer
								</button>
							</div>
						</dialog>
						<dialog
							className="bg-gray-200 p-2 rounded border border-gray-800"
							ref={actionConfirmationRef}
						>
							<p className="text-center m-2 text-lg font-semibold">
								Confirm action?
							</p>
							<div className="flex flex-row gap-2 items-center justify-center m-2">
								<button
									onClick={() => {
										actionConfirmationRef.current.close();
										setIsModalOpen(false);
										setAction("");
									}}
									className="bg-neutral-300 hover:bg-rose-400 active:bg-rose-500 hover:text-neutral-200 active:text-neutral-200 text-sm p-2 rounded "
								>
									Cancel
								</button>
								<button
									onClick={confirmActionHandle}
									className="bg-green-500 active:bg-green-600 text-sm p-2 rounded text-neutral-200"
								>
									Confirm
								</button>
							</div>
						</dialog>

						{isAdmin && (
							<form
								onSubmit={(e) => {
									e.preventDefault();

									if (postContent !== "" || postMedia.length !== 0) {
										createPostHandle();
									} else {
										return;
									}
									e.target.reset();
								}}
								className="w-full my-0 xs:my-4 border border-gray-400 rounded"
							>
								<div className="flex flex-row gap-2 items-center p-2">
									{image ? (
										<Image
											src={image}
											alt={`Logo of ${department_name}`}
											height={100}
											width={100}
											className="rounded-full"
											style={{
												maxWidth: "32px",
												minWidth: "28px",
												aspectRatio: "1 / 1",
												objectPosition: "50% 50%",
												objectFit: "cover",
											}}
										/>
									) : (
										<Image
											src={"/images/upang.webp"}
											alt="Default logo for department"
											height={100}
											width={100}
											className="rounded-full"
											s
											style={{
												maxWidth: "32px",
												minWidth: "28px",
												aspectRatio: "1 / 1",
												objectPosition: "50% 50%",
												objectFit: "cover",
											}}
										/>
									)}
									<textarea
										onChange={(e) => {
											setPostContent(e.target.value);
										}}
										className="bg-gray-100 rounded px-2 py-1 text-sm flex-grow resize-none h-20 outline-none"
										placeholder="Write a post"
									/>
								</div>
								{selectedImagesName.length !== 0 && (
									<p className="text-sm mb-3 mt-1 text-end mr-2">
										Selected Files:{" "}
										<span
											className={`${
												selectedImagesName.length !== 0 && "p-1"
											} bg-green-300`}
										>
											{selectedImagesName.join(", ")}
										</span>
									</p>
								)}
								<div className="grid grid-cols-2 border-t border-gray-400 text-xs">
									<label
										title="Photo"
										className="p-1 border-r text-center cursor-pointer border-gray-400"
									>
										<span className="p-1 material-symbols-outlined align-middle size-20 mr-1 text-emerald-500">
											image
										</span>
										<span className="hidden xs:inline">Photo</span>
										<input
											onChange={(e) => {
												const fileArr = [...e.target.files];
												const fileNames = fileArr.map((file) => file.name);
												setSelectedImagesName(fileNames);
												const dataUrls = fileArr.map((file) => {
													return new Promise((resolve, reject) => {
														const reader = new FileReader();
														reader.onload = () => resolve(reader.result);
														reader.onerror = reject;
														reader.readAsDataURL(file);
													});
												});

												Promise.all(dataUrls)
													.then((dataUrlsArray) => {
														setPostMedia(dataUrlsArray);
													})
													.catch((error) => {
														console.error(
															"An error occurred while reading files:",
															error
														);
													});
											}}
											hidden
											type="file"
											accept="image/png, image/webp, image/jpeg, image/jpg"
										/>
									</label>

									<button
										type="submit"
										className="p-1 bg-green-600 text-neutral-50"
									>
										Create Post
									</button>
								</div>
							</form>
						)}
						<section className="bg-gray-200 my-4 rounded p-2">
							<h2 className="text-lg font-bold">Description</h2>
							<p className={`${department_desc ? "my-2" : "my-0"}`}>
								{department_desc}
							</p>
						</section>
						<section className="bg-gray-200 my-4 rounded p-2">
							<h2 className="text-lg font-bold">Admin</h2>

							<Link
								href={adminHref}
								className="flex flex-row gap-2 items-center my-2"
							>
								{currentAdmin?.image ? (
									<Image
										height={80}
										width={80}
										style={{ maxWidth: "30px", minWidth: "24px" }}
										className="rounded-full block"
										src={currentAdmin.image}
										alt={`Profile picture of ${currentAdmin?.name}`}
									/>
								) : (
									<Image
										height={80}
										width={80}
										style={{ maxWidth: "30px", minWidth: "24px" }}
										className="rounded-full block"
										src={"/images/public_user_img.webp"}
										alt="Default image of users"
									/>
								)}

								<p>{currentAdmin.name} </p>
							</Link>
						</section>

						<section className="bg-gray-200 my-4 rounded p-2">
							<h2 className="text-lg font-bold">Members</h2>

							<ul
								className={`${
									currentDeptMembers.filter((member) => {
										return member.id !== currentAdmin.id;
									}).length > 0
										? "my-2"
										: "my-0"
								}`}
							>
								{currentDeptMembers
									.filter((member) => {
										return member.id !== currentAdmin.id;
									})
									.map((member) => {
										return (
											<li
												key={member.id}
												className="flex flex-row gap-2 items-center justify-between"
											>
												<Link
													href="/home"
													className="flex flex-row gap-2 items-center my-2"
												>
													{member?.image ? (
														<Image
															height={80}
															width={80}
															style={{ maxWidth: "30px", minWidth: "24px" }}
															className="rounded-full block"
															src={member.image}
															alt={`Profile picture of ${member?.name}`}
														/>
													) : (
														<Image
															height={80}
															width={80}
															style={{ maxWidth: "30px", minWidth: "24px" }}
															className="rounded-full block"
															src={"/images/public_user_img.webp"}
															alt="Default image of users"
														/>
													)}

													<p>{member.name} </p>
												</Link>
												{isAdmin && (
													<button
														onClick={() => {
															setMemberToRemove(member.id);
															removeMemberRef.current.showModal();
															setIsModalOpen(true);
														}}
														className="block"
													>
														<span className="material-symbols-outlined size-24 align-middle text-neutral-600 hover:text-neutral-800 active:text-green-700">
															person_remove
														</span>
													</button>
												)}
											</li>
										);
									})}
							</ul>
							<dialog
								className="bg-gray-200 p-2 rounded border border-gray-800"
								ref={removeMemberRef}
							>
								<p className="text-center m-2 text-lg font-semibold">
									Remove member?
								</p>
								<div className="flex flex-row gap-2 items-center justify-center m-2">
									<button
										onClick={() => {
											removeMemberRef.current.close();
											setIsModalOpen(false);
											setMemberToRemove("");
											setIsModalOpen(false);
										}}
										className="bg-neutral-300 hover:bg-rose-400 active:bg-rose-500 hover:text-neutral-200 active:text-neutral-200 text-sm p-2 rounded "
									>
										Cancel
									</button>
									<button
										onClick={() => {
											removeMemberHandle();
										}}
										className="bg-green-500 active:bg-green-600 text-sm p-2 rounded text-neutral-200"
									>
										Confirm
									</button>
								</div>
							</dialog>
						</section>
						<p
							className={`text-center font-bold my-2 ${
								department_posts.length < 1 ? "block" : "hidden"
							}`}
						>
							No post to display!
						</p>
						{/* content of post container will be replaced with post that matches the profiles id */}
						<div className="bg-gray-200 my-4">
							{department_posts.map((post) => {
								const {
									id,
									content,
									comments,
									postedWith,
									likedBy,
									createdAt,
									media,
								} = post;
								return (
									<AnyPost
										key={id}
										content={content}
										postedWith={postedWith}
										likedBy={likedBy}
										currentUserId={currentUser?.id}
										createdAt={createdAt}
										postId={id}
										comments={comments}
										setDepartmentPosts={setCurrentDepartmentPosts}
										adminId={currentAdmin.id}
										media={media}
									/>
								);
							})}
						</div>
					</div>
				</main>
			</>
		);
	}
}

export default Department;
