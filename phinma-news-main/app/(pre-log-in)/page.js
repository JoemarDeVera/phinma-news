"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Trademark from "../components/Trademark";

function SignIn() {
	const { data: session } = useSession();
	const router = useRouter();

	// if user navigates to "/", useRouter will redirect them to homepage
	useEffect(() => {
		if (session) {
			router.push("/home");
		}
	}, [session]);
	return (
		<>
			<main className="min-h-screen bg-green-100 pt-12 px-4">
				<Image
					src={"/logo/pn_logo_medium.webp"}
					alt="Phinma News Logo"
					width={160}
					height={160}
					className="block mx-auto my-4"
				/>

				<section className="bg-green-600 p-4 w-fit mx-auto text-neutral-50 rounded border border-gray-900">
					<h1 className="text-center text-xl font-bold mt-2 mb-1 ">
						Get your daily campus news!
					</h1>
					<p className="mt-1 mb-2 text-center">
						Sign in wiht your gmail account
					</p>

					<button
						onClick={() => signIn("google", { callbackUrl: "/home" })}
						className="bg-green-700 hover:bg-green-800 active:bg-green-900 block mx-auto p-2 rounded font-semibold border border-gray-700"
					>
						Sign In
					</button>
				</section>

				<Trademark />
			</main>
		</>
	);
}

export default SignIn;
