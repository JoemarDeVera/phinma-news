"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

function AnyPost({
	content,
	postId,
	postedBy,
	postedWith,
	createdAt,
	currentUserId,
	likedBy,
	comments,
	setPosts,
	setDepartmentPosts,
	adminId,
	media,
}) {
	const pathname = usePathname();
	const [commentText, setCommentText] = useState("");
	const [commentBoxVisible, setCommentBoxVisible] = useState(false);
	const [postComments, setPostComments] = useState(comments);
	const [postLikes, setPostLikes] = useState(likedBy);
	const [isMdodalOpen, setIsModalOpen] = useState(false);
	const [newContent, setNewContent] = useState("");
	const [newMedia, setNewMedia] = useState([]);
	const [selectedImagesName, setSelectedImagesName] = useState([]);

	const commentBoxAnyPostRef = useRef(null);
	const deleteConfirmationAnyPostRef = useRef();

	const newContentARef = useRef(null);
	const newMediARef = useRef(null);
	const editContentARef = useRef(null);

	const isRegularPost = !postedWith;

	// this will conditionally render the delete post button
	const isPoster =
		(postedBy && postedBy?.id === currentUserId) || adminId === currentUserId;

	// dynamic href for links
	const posterHref = postedWith
		? `/departments/department?id=${postedWith?.id}`
		: postedBy && postedBy?.id === currentUserId
		? `/profile`
		: `/profile/visit?id=${postedBy?.id}`;

	const createCommentHandle = () => {
		async function createComment() {
			const res = await fetch(`/api/posts/comment`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					postId: postId,
					comment: commentText,
					commentedById: currentUserId,
				}),
			});
			if (res.ok) {
				const data = await res.json();
				setPostComments(data.updatedPost.comments);
			}
		}
		async function createDepartmentComment() {
			const res = await fetch(`/api/department-posts/comment`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					postId: postId,
					comment: commentText,
					commentedById: currentUserId,
				}),
			});
			if (res.ok) {
				const data = await res.json();
				setPostComments(data.updatedPost.comments);
			}
		}

		if (isRegularPost) {
			createComment();
		} else {
			createDepartmentComment();
		}
	};

	const likePostHandle = () => {
		async function likeDepartmentPost() {
			try {
				const res = await fetch(`/api/department-posts/like`, {
					method: "PUT",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ postId: postId, likedById: currentUserId }),
				});
				if (res.ok) {
					const data = await res.json();
					setPostLikes(data.updatedPost.likedBy);
				}
			} catch (error) {
				console.error(error);
			}
		}
		async function likePost() {
			try {
				const res = await fetch(`/api/posts/like`, {
					method: "PUT",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ postId: postId, likedById: currentUserId }),
				});
				if (res.ok) {
					const data = await res.json();
					setPostLikes(data.updatedPost.likedBy);
				}
			} catch (error) {
				console.error(error);
			}
		}

		if (isRegularPost) {
			likePost();
		} else {
			likeDepartmentPost();
		}
	};

	const deleteAnyPostHandle = () => {
		const refetchPosts = pathname.includes("/profile")
			? `/api/posts/posted-by?id=${currentUserId}`
			: "/api/posts";
		const refetchDepartmentPosts = pathname.includes("/departments/deparment")
			? `/api/department-posts/posted-with?id=${postedWith.id}`
			: "/api/department-posts";

		async function deletePost() {
			const res = await fetch(`/api/posts/post?postId=${postId}`, {
				method: "DELETE",
			});
			if (res.ok) {
				const posts_res = await fetch(refetchPosts);
				if (posts_res.ok) {
					const data = await posts_res.json();
					setPosts(data.posts);
					window.alert("Post deleted");
				}
			}
		}
		async function deleteDepartmentPost() {
			const res = await fetch(
				`/api/department-posts/department-post?postId=${postId}`,
				{ method: "DELETE" }
			);
			if (res.ok) {
				const dept_posts_res = await fetch(refetchDepartmentPosts);
				if (dept_posts_res.ok) {
					const data = await dept_posts_res.json();
					setDepartmentPosts(data.departmentPosts);
					window.alert("Post deleted");
				}
			}
		}
		if (isRegularPost) {
			deletePost();
		} else {
			deleteDepartmentPost();
		}
	};

	const canEdit = pathname === "/departments/department";

	const updateAnyPostHandle = () => {
		const isUser = pathname === "/profile";
		async function updatePost() {
			const res = await fetch(`/api/posts/post`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					postId: postId,
					newContent: newContent,
					newMedia: newMedia,
				}),
			});
			if (res.ok) {
				const posts_res = await fetch(
					`/api/posts/posted-by?id=${currentUserId}`
				);
				if (posts_res.ok) {
					const data = await posts_res.json();
					setPosts(data.posts);
					window.alert("Successfully updated post!");
					setNewContent("");
					setNewMedia([]);
					setSelectedImagesName([]);
				}
			}
		}
		async function updateDepartmentPost() {
			const res = await fetch(`/api/department-posts/department-post`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					postId: postId,
					newContent: newContent,
					newMedia: newMedia,
				}),
			});
			if (res.ok) {
				const dept_posts_res = await fetch(
					`/api/department-posts/posted-with?id=${postedWith.id}`
				);
				if (dept_posts_res.ok) {
					const data = await dept_posts_res.json();
					setDepartmentPosts(data.departmentPosts);
					window.alert("Successfully updated post!");
					setNewContent("");
					setNewMedia([]);
					setSelectedImagesName([]);
				}
			}
		}
		if (isUser) {
			updatePost();
		} else {
			updateDepartmentPost();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!commentBoxAnyPostRef.current.contains(event.target)) {
				setCommentBoxVisible(false);
			}
		};
		if (commentBoxVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [commentBoxVisible]);

	const alreadyLiked = postLikes?.some((user) => {
		return user.id === currentUserId;
	});

	useEffect(() => {
		if (isMdodalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isMdodalOpen]);

	return (
		<>
			<div className="bg-white border border-gray-200 p-2 my-2 relative">
				<div className="absolute top-2 right-2 flex flex-row items-center justify-center">
					<button
						onClick={() => {
							setIsModalOpen(true);
							newContentARef.current.value = content;
							editContentARef.current.showModal();
						}}
						className={`${
							(canEdit && currentUserId === adminId) || pathname === "/profile"
								? "block"
								: "hidden"
						} text-gray-600 hover:text-gray-800 active:text-green-700`}
					>
						<span className="material-symbols-outlined size-20">edit</span>
					</button>
					<button
						onClick={() => {
							setIsModalOpen(true);
							deleteConfirmationAnyPostRef.current.showModal();
						}}
						className={`${
							isPoster ? "block" : "hidden"
						}  text-gray-600 hover:text-gray-800 active:text-green-700`}
					>
						<span className="material-symbols-outlined size-20">
							delete_forever
						</span>
					</button>
				</div>
				<dialog
					ref={editContentARef}
					className="border border-gray-600 rounded p-4 w-4/5 sm:w-3/5 sm:lg:w-1/2"
				>
					<label
						htmlFor={postId + 123}
						className="font-semibold"
					>
						New content
					</label>
					<textarea
						id={postId + 123}
						ref={newContentARef}
						onChange={(e) => {
							setNewContent(e.target.value);
						}}
						className="h-40 resize-none p-2 outline-none border w-full rounded"
					/>
					{/* <label
						htmlFor={postId}
						className="font-semibold cursor-pointer"
					>
						New images
					</label>
					<p>
						Selected Files:{" "}
						<span
							className={`${
								selectedImagesName.length !== 0 && "p-1"
							} bg-green-300`}
						>
							{selectedImagesName.join(", ")}
						</span>
					</p>
					<input
						id={postId}
						ref={newMediARef}
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
									setNewMedia(dataUrlsArray);
									console.log(dataUrlsArray);
								})
								.catch((error) => {
									console.error(
										"An error occurred while reading files:",
										error
									);
								});
						}}
						multiple
						hidden
						type="file"
						accept="image/png, image/webp, image/jpeg, image/jpg"
					/> */}
					<div className="flex flex-row gap-2 mt-4 justify-center items-center">
						<button
							className="rounded bg-gray-100 p-2 hover:bg-rose-400 active:bg-rose-500 active:text-neutral-200 hover:text-neutral-200"
							onClick={() => {
								setIsModalOpen(false);
								setNewContent("");
								newContentARef.current.value = "";
								setSelectedImagesName([]);
								editContentARef.current.close();
							}}
						>
							Cancel
						</button>
						<button
							className="rounded bg-green-500 active:bg-green-600 text-neutral-200 p-2 "
							onClick={() => {
								updateAnyPostHandle();
								setIsModalOpen(false);
								editContentARef.current.close();
							}}
						>
							Confirm
						</button>
					</div>
				</dialog>
				<dialog
					ref={deleteConfirmationAnyPostRef}
					className="border border-gray-600 rounded p-4"
				>
					<p className=" text-lg text-center font-bold">Delete post?</p>
					<div className="flex flex-row gap-2 mt-4 justify-center items-center">
						<button
							className="rounded bg-gray-100 p-2 hover:bg-rose-400 active:bg-rose-500 active:text-neutral-200 hover:text-neutral-200"
							onClick={() => {
								setIsModalOpen(false);
								deleteConfirmationAnyPostRef.current.close();
							}}
						>
							Cancel
						</button>
						<button
							className="rounded bg-green-500 active:bg-green-600 text-neutral-200 p-2 "
							onClick={() => {
								deleteAnyPostHandle();
								setIsModalOpen(false);
								deleteConfirmationAnyPostRef.current.close();
							}}
						>
							Confirm
						</button>
					</div>
				</dialog>
				<div className="flex flex-row gap-2 items-center mt-2 mb-4 ">
					<Link href={posterHref}>
						{postedBy?.image ? (
							<Image
								src={postedBy?.image}
								alt={`Picture of ${postedBy?.name}`}
								className="rounded-full"
								style={{
									minWidth: "32px",
									aspectRatio: "1 / 1",
									objectPosition: "50% 50%",
									objectFit: "cover",
								}}
								width={44}
								height={44}
							/>
						) : postedWith?.image ? (
							<Image
								// temporary image
								src={postedWith.image}
								alt={`Logo of ${postedWith?.name}`}
								className="rounded-full"
								style={{
									minWidth: "32px",
									aspectRatio: "1 / 1",
									objectPosition: "50% 50%",
									objectFit: "cover",
								}}
								width={44}
								height={44}
							/>
						) : (
							<Image
								src={"/images/upang.webp"}
								alt={`Default image for poster`}
								className="rounded-full"
								style={{
									minWidth: "32px",
									aspectRatio: "1 / 1",
									objectPosition: "50% 50%",
									objectFit: "cover",
								}}
								width={44}
								height={44}
							/>
						)}
					</Link>
					<div>
						<Link
							href={posterHref}
							className="font-semibold hover:underline active:text-green-700"
						>
							{postedBy?.name || postedWith?.name}
						</Link>
						<p className="text-xs">
							{createdAt.slice(0, 10)} at {createdAt.slice(11, 16)} UTC
						</p>
					</div>
				</div>
				<p className="text-sm">{content}</p>
				<div
					className={`my-2 flex flex-col gap-1  ${
						media?.length > 0 && "p-0.5 border"
					} bg-gray-200`}
				>
					{media &&
						media?.map((m) => {
							return (
								<Image
									key={m.id}
									src={m.mediaUrl}
									alt={""}
									width={500}
									height={500}
									className="max-w-full w-full h-auto block"
								/>
							);
						})}
				</div>
				<div className="text-xs flex flex-row gap-2 justify-between items-center my-1 text-neutral-500">
					<p>{postLikes?.length || "0"} Likes</p>
					<p>{postComments?.length || "0"} Comments</p>
				</div>
				<div ref={commentBoxAnyPostRef}>
					<div className="grid grid-cols-2 mt-2 bg-gray-200 text-xs xs:text-sm sm:text-base">
						<button
							onClick={likePostHandle}
							className="p-1 hover:bg-gray-300 active:text-green-700"
						>
							<span
								className={`material-symbols-outlined align-middle size-20 mr-2 ${
									alreadyLiked ? "text-sky-500" : "text-neutral-500"
								} `}
							>
								thumb_up
							</span>
							Like
						</button>

						<button
							onClick={() => {
								setCommentText("");
								setCommentBoxVisible((prevState) => !prevState);
							}}
							className="p-1 hover:bg-gray-300 active:text-green-700"
						>
							<span className="material-symbols-outlined align-middle size-20 mr-2 text-sky-500">
								comment
							</span>
							Comment
						</button>
					</div>
					{/* open element to display comments */}
					<div className={`${commentBoxVisible ? "block" : "hidden"}`}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								if (commentText === "") {
									return;
								} else {
									createCommentHandle();
								}
								e.target.reset();
								setCommentText("");
							}}
						>
							<textarea
								placeholder="Write a comment"
								onChange={(e) => setCommentText(e.target.value)}
								className="outline-none w-full resize-none my-2 bg-gray-100 rounded p-1 h-20"
							/>
							<div className="flex justify-end">
								<button
									type="submit"
									className="bg-green-500 active:bg-green-600 rounded py-1 px-2 mb-2 text-neutral-200 text-sm"
								>
									Comment
								</button>
							</div>
						</form>
						<ul>
							{postComments?.map((p_comment) => {
								const { id, commentedBy, comment } = p_comment;
								const isCommenter = commentedBy?.id === currentUserId;
								const commenterHref = isCommenter
									? "/profile"
									: `/profile/visit?id=${commentedBy?.id}`;
								return (
									<li
										key={id}
										className="p-2 bg-gray-100 rounded relative"
									>
										<button
											title="Delete comment"
											onClick={() => {
												setIsModalOpen(true);
												deleteConfirmationAnyPostRef.current.showModal();
											}}
											className={`${
												isCommenter ? "block" : "hidden"
											} absolute top-2 right-2 text-gray-600 hover:text-gray-800 active:text-green-700`}
										>
											<span className="material-symbols-outlined size-20">
												delete_forever
											</span>
										</button>
										<Link
											className="flex flex-row gap-2 items-center"
											href={commenterHref}
										>
											{commentedBy?.image ? (
												<Image
													width={24}
													height={24}
													className="rounded-full block"
													style={{ minWidth: "24px" }}
													src={commentedBy.image}
													alt={`Profile picture of ${commentedBy.name}`}
												/>
											) : (
												<Image
													width={24}
													height={24}
													className="rounded-full block"
													style={{ minWidth: "24px" }}
													src={"/images/default_user_img.webp"}
													alt="default picture for users"
												/>
											)}

											<p className="font-semibold">{commentedBy?.name}</p>
										</Link>
										<p className="my-1 p-1 rounded">{comment}</p>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}

export default AnyPost;
