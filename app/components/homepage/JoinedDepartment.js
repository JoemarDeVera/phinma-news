import Link from "next/link";
import Image from "next/image";

function JoinedDepartment({ department }) {
	return (
		<>
			<h2 className="font-bold rounded py-1 px-2 bg-gray-300 my-2">
				<span className="material-symbols-outlined align-bottom size-24 mr-2 text-sky-500">
					groups
				</span>
				Your Department
			</h2>
			<ul>
				{department?.map((dept) => {
					return (
						<li key={dept.id}>
							<Link
								href={`/departments/department?id=${dept.id}`}
								className="py-1 px-2 my-2 hover:bg-gray-200 active:text-green-700 flex flex-row gap-2 items-center"
							>
								{dept?.image ? (
									<Image
										src={dept.image}
										alt={`logo for ${dept.name}`}
										width={50}
										height={50}
										className="rounded-full"
										style={{
											minWidth: "32px",
											aspectRatio: "1 / 1",
											objectPosition: "50% 50%",
											objectFit: "cover",
										}}
									/>
								) : (
									<Image
										src={"/images/upang.webp"}
										alt={`default logo for department`}
										width={50}
										height={50}
										className="rounded-full"
										style={{
											minWidth: "32px",
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
		</>
	);
}

export default JoinedDepartment;
