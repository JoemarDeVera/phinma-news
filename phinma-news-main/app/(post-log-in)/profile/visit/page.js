"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import AnyPost from "@/app/components/AnyPost";
import SiginReminder from "@/app/components/SigninReminder";

function VisitProfile() {
	const { data: session } = useSession();
	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	const [visitedProfile, setVisitedProfile] = useState(null);
	const [posts, setPosts] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);

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
		async function getProfile() {
			const res = await fetch(`/api/users/other-user?id=${id}`);
			if (res.ok) {
				const data = await res.json();
				setVisitedProfile(data?.user);
				setPosts(data.userPosts);
			}
		}
		getProfile();
	}, []);

	if (!session) {
		return <SiginReminder />;
	}
	return (
		<>
			{visitedProfile && (
				<main>
					<div className="w-full sm:w-3/4 xl:w-1/2 mx-auto p-4 bg-white">
						<section className="flex flex-col sm:flex-row items-center gap-4 justify-center bg-gray-200 p-2 rounded my-4">
							{visitedProfile?.image ? (
								<Image
									src={visitedProfile.image}
									alt={`Profile of ${visitedProfile.name}`}
									width={65}
									height={65}
									className="rounded-full"
								/>
							) : (
								<Image
									src={"/images/default_user_img.webp"}
									alt="default user image"
									width={65}
									height={65}
									className="rounded-full"
								/>
							)}
							<div className=" text-center sm:text-left">
								<h1 className="text-lg font-bold">{visitedProfile?.name}</h1>
							</div>
						</section>

						<section className="bg-gray-200 my-4 rounded">
							<div className=" bg-gray-300 flex flex-row items-center justify-between gap-2 rounded-t p-4">
								<h2 className="text-lg font-bold ">About</h2>
							</div>

							<div className="my-4 px-4">
								<h3 className="font-semibold ">Biography</h3>
								<p className="my-2 p-4 bg-gray-300 rounded ">
									{visitedProfile?.biography}
								</p>
							</div>
							<div className="my-4 px-4">
								<h3 className="font-semibold ">Course</h3>
								<p className="p-4 bg-gray-300 rounded ">
									{visitedProfile?.course}
								</p>
							</div>
							<div className="my-4 px-4">
								<h3 className="font-semibold ">Department</h3>
								<ul className="py-4">
									{visitedProfile?.department.map((dept) => {
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
						{posts.length < 1 && (
							<p className="text-center font-bold my-2">No post to display!</p>
						)}
						{posts && (
							<div className="bg-gray-200 my-4">
								{posts.map((post) => {
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
											currentUserId={currentUser?.id}
											likedBy={likedBy}
											comments={comments}
											media={media}
										/>
									);
								})}
							</div>
						)}
					</div>
				</main>
			)}
		</>
	);
}

export default VisitProfile;
