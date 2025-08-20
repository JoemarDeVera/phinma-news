"use client";

import Link from "next/link";

function AccessDenied() {
	return (
		<>
			<main className=" bg-green-100 pt-12 min-h-screen">
				<h1 className="text-center text-xl font-bold my-2">
					Access Denied: Please sign in with your Phinma-issued email.
				</h1>
				<Link
					href={"/"}
					className="underline hover:text-gray-500 active:text-gray-600 text-sm block mx-auto text-center"
				>
					Back to sign in page
				</Link>
			</main>
		</>
	);
}

export default AccessDenied;
