"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import AnyPost from "../../AnyPost";

function RightColumn({ user_img, user_name, user_id }) {
	const [postContent, setPostContent] = useState("");
	const [postList, setPostList] = useState([]);
	const [departmentPostList, setDepartmentPostList] = useState([]);
	const [postMedia, setPostMedia] = useState([]);
	const [selectedImagesName, setSelectedImagesName] = useState([]);

	const fileinputRef = useRef(null);
	const contentinputRef = useRef(null);

	// all posts are fetched
	useEffect(() => {
		async function getAllPosts() {
			const posts_res = await fetch(`/api/posts`);
			if (posts_res.ok) {
				const data = await posts_res.json();
				setPostList([...postList, ...data.posts]);
			}
			const department_posts_res = await fetch(`/api/department-posts`);
			if (department_posts_res.ok) {
				const data = await department_posts_res.json();
				setDepartmentPostList([...departmentPostList, ...data.departmentPosts]);
			}
		}
		getAllPosts();
	}, []);

	// create post from homepage
	const createPostHandle = () => {
		async function createPost() {
			const res = await fetch(`/api/posts/post`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					content: postContent,
					postedBy: user_id,
					media: postMedia,
				}),
			});
			if (res.ok) {
				const data = await res.json();
				setPostList([...postList, data.newPost]);
				setSelectedImagesName([]);
				setPostContent("");
				setPostMedia([]);
				// console.log(data.newPost);
			}
		}
		createPost();
	};

	return (
		<>
			<div className="flex-grow max-w-3xl">
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
						{user_img ? (
							<Image
								src={user_img}
								alt={`Profile of ${user_name}`}
								height={28}
								width={28}
								className="rounded-full"
							/>
						) : (
							<Image
								src={"/images/default_user_img.webp"}
								alt="Default image for user"
								height={28}
								width={28}
								className="rounded-full"
							/>
						)}
						<textarea
							ref={contentinputRef}
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
								ref={fileinputRef}
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
								multiple
								hidden
								type="file"
								accept="image/png, image/webp, image/jpeg, image/jpg"
							/>
						</label>

						<button
							type="submit"
							className="p-1 bg-green-500 active:bg-green-600 text-neutral-50"
						>
							Create Post
						</button>
					</div>
				</form>
				<hr className="border-gray-400 my-4"></hr>
				{/* display all post here */}
				<section className="my-2">
					<p
						className={`text-center font-bold my-2 ${
							postList.length < 1 && departmentPostList.length < 1
								? "block"
								: "hidden"
						}`}
					>
						No post to display!
					</p>

					{[...postList, ...departmentPostList]
						.sort((post1, post2) => {
							const a = new Date(post1.createdAt);
							const b = new Date(post2.createdAt);
							return b - a;
						})
						.map((post) => {
							const {
								content,
								postedBy,
								postedWith,
								createdAt,
								id,
								likedBy,
								comments,
								media,
							} = post;
							return (
								<AnyPost
									key={id}
									content={content}
									postedBy={postedBy}
									postedWith={postedWith}
									likedBy={likedBy}
									currentUserId={user_id}
									createdAt={createdAt}
									postId={id}
									comments={comments}
									setPosts={setPostList}
									setDepartmentPosts={setDepartmentPostList}
									media={media}
								/>
							);
						})}
				</section>
			</div>
		</>
	);
}

export default RightColumn;
