import Link from "next/link";

function SiginReminder() {
	return (
		<>
			<main className="pt-12">
				<h1 className="text-center font-bold text-xl my-2 text-green-700">
					Not signed in!
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

export default SiginReminder;
