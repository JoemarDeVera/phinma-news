"use client";

import Link from "next/link";
import Image from "next/image";

function DepartmentList({ departmentList }) {
	return (
		<ul className={`${departmentList.length > 0 ? "my-4" : "my-0"}`}>
			{departmentList.map((department) => {
				const { id, name, description, image } = department;

				return (
					<li
						key={id}
						className="py-2 px-4 bg-gray-300 block rounded my-4"
					>
						<div className="flex flex-row gap-2 items-center justify-start my-4">
							<Link
								href={`/departments/department?id=${id}`}
								className="block"
							>
								{image ? (
									<Image
										src={image}
										alt={`Logo of ${name}`}
										width={40}
										height={40}
										className="rounded-full"
										style={{
											minWidth: "48px",
											aspectRatio: "1 / 1",
											objectPosition: "50% 50%",
											objectFit: "cover",
										}}
									/>
								) : (
									<Image
										src={"/images/upang.webp"}
										alt="default image for department logo"
										width={40}
										height={40}
										className="rounded-full"
										style={{
											minWidth: "48px",
											aspectRatio: "1 / 1",
											objectPosition: "50% 50%",
											objectFit: "cover",
										}}
									/>
								)}
							</Link>
							<Link
								href={`/departments/department?id=${id}`}
								className="font-bold text-lg block hover:underline active:text-green-700"
							>
								{name}
							</Link>
						</div>
						<hr
							className={`${description ? "block" : "hidden"} border-gray-500`}
						/>
						<p className="my-2">{description}</p>
					</li>
				);
			})}
		</ul>
	);
}

export default DepartmentList;
