"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

function TrendingNews() {
	const { data: session } = useSession();
	const [trendingNews, setTrendingNews] = useState([]);
	const [isMdodalOpen, setIsModalOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [selectedPost, setSelectedPost] = useState(null);
	const [commentBoxVisible, setCommentBoxVisible] = useState(false);
	const [postComments, setPostComments] = useState([]);
	const [postLikes, setPostLikes] = useState([]);

	const commentBoxRef = useRef(null);
	const selectedPostRef = useRef(null);

	useEffect(() => {
		if (isMdodalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isMdodalOpen]);

	useEffect(() => {
		async function getTrendingNews() {
			const res = await fetch(`/api/department-posts/trending-news`);
			if (res.ok) {
				const data = await res.json();
				setTrendingNews(data.trending_posts);
			}
		}
		getTrendingNews();
	}, []);

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

	const getTrendingPostHandle = async (postId) => {
		const res = await fetch(
			`/api/department-posts/trending-news/trending-post?id=${postId}`
		);
		if (res.ok) {
			const data = await res.json();
			const { department_post } = data;
			setSelectedPost(department_post);
			setPostLikes(department_post.likedBy);
			setPostComments(department_post.comments);
		}
	};

	return (
		<>
			<h2 className="font-bold rounded py-1 px-2 bg-gray-300 my-2">
				<span className="material-symbols-outlined size-24 align-bottom mr-2 text-green-500">
					trending_up
				</span>
				Trending News
			</h2>
			<ul>
				{trendingNews.map((news) => {
					return (
						<li key={news.id}>
							<button
								onClick={() => {
									setIsModalOpen(true);
									getTrendingPostHandle(news.id);
									selectedPostRef.current.showModal();
								}}
								className="my-2 hover:bg-gray-200 py-1 px-2 active:text-green-700 rounded w-full block text-start"
							>
								<p className="font-semibold">
									{news.content.substring(0, 30)}{" "}
									{news.content.length > 30 && "..."}
								</p>
								<p className="text-xs text-neutral-700">
									{news.createdAt.slice(0, 10)} at{" "}
									{news.createdAt.slice(11, 16)} UTC
								</p>{" "}
							</button>
						</li>
					);
				})}
			</ul>
			<dialog
				ref={selectedPostRef}
				className="w-4/5 sm:w-3/4 lg:w-1/2 bg-white border my-auto mt-4 border-gray-600 p-2 relative rounded "
			>
				<div className="flex flex-row gap-2 items-center mt-2 mb-4 ">
					<Link
						href={`/departments/department?id=${selectedPost?.postedWith.id}`}
					>
						{selectedPost?.postedWith?.image ? (
							<Image
								// temporary image
								src={selectedPost?.postedWith.image}
								alt={`Logo of ${selectedPost?.postedWith?.name}`}
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
					<Link
						href={`/departments/department?id=${selectedPost?.postedWith.id}`}
					>
						<div>
							<p className="font-semibold hover:underline active:text-green-700 inline-block">
								{selectedPost?.postedWith?.name}{" "}
							</p>
							<span className="ml-1 text-xs p-0.5 rounded bg-green-500 text-neutral-200">
								Read Only Mode
							</span>

							<p className="text-xs">
								{selectedPost?.createdAt.slice(0, 10)} at{" "}
								{selectedPost?.createdAt.slice(11, 16)} UTC
							</p>
						</div>
					</Link>
				</div>

				<p className="text-sm">{selectedPost?.content} </p>
				<div
					className={`my-2 flex flex-col gap-1  ${
						selectedPost?.media?.length > 0 && "p-0.5 border"
					} bg-gray-200`}
				>
					{selectedPost?.media &&
						selectedPost?.media.map((m) => {
							return (
								<Image
									key={m.id}
									src={m.mediaUrl}
									alt={`An image of something`}
									width={200}
									height={200}
									className="max-w-full w-full h-auto block"
								/>
							);
						})}
				</div>
				<div className="text-xs flex flex-row gap-2 justify-between items-center my-1 text-neutral-500">
					<p>{postLikes?.length} Likes</p>
					<p>{postComments?.length} Comments</p>
				</div>

				<div ref={commentBoxRef}>
					<button
						onClick={() => {
							console.log(selectedPost.createdAt.slice(0, 23));
							setCommentBoxVisible((prevState) => !prevState);
						}}
						className="p-1 block w-full bg-gray-200 hover:bg-gray-300 active:text-green-700"
					>
						<span className="material-symbols-outlined align-middle size-20 mr-2 text-sky-500">
							comment
						</span>
						View Comments
					</button>

					{/* open element to display comments */}
					<div className={`${commentBoxVisible ? "block" : "hidden"}`}>
						<ul>
							{postComments?.map((p_comment) => {
								const { id, commentedBy, comment } = p_comment;
								const isCommenter = commentedBy?.id === currentUser?.id;
								const commenterHref = isCommenter
									? "/profile"
									: `/profile/visit?id=${commentedBy?.id}`;
								return (
									<li
										key={id}
										className="p-2 bg-gray-100 rounded relative"
									>
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
				<button
					className="block mx-auto underline hover:text-rose-400 active:text-rose-500 my-2 text-xs"
					onClick={() => {
						setIsModalOpen(false);
						selectedPostRef.current.close();
						setCommentBoxVisible(false);
					}}
				>
					Close
				</button>
			</dialog>
		</>
	);
}

export default TrendingNews;
