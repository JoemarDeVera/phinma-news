"use client";

import SiginReminder from "@/app/components/SigninReminder";
import Trademark from "@/app/components/Trademark";
import { useSession } from "next-auth/react";
import Link from "next/link";

function PrivacyPolicyPage() {
	const { data: session } = useSession();

	if (!session) {
		<SiginReminder />;
	}

	return (
		<>
			<main>
				<div className="p-4 bg-gray-200 my-8 w-full sm:w-3/4 xl:w-1/2 mx-auto rounded">
					<h1 className="bg-gray-300 font-bold text-lg p-2 rounded">
						Privacy Policy
					</h1>
					<div className="p-2 bg-gray-300 mt-2 rounded">
						<p>
							Lorem ipsum dolor sit amet. Ut pariatur ducimus est accusantium
							culpa sed reiciendis dolor et quis voluptate est eius explicabo ea
							quisquam facere. Sed libero internos in doloremque omnis ea iure
							repellendus ut eveniet deserunt. In dolore fugiat non eligendi
							quia ex enim inventore ea atque ducimus ea incidunt eligendi vel
							temporibus autem quo aliquam omnis? Qui ipsa debitis et libero
							tempora ut earum voluptas.
						</p>
						<p>
							In possimus veritatis sed ipsam galisum rem corrupti rerum qui
							rerum dolor qui voluptatem numquam. Quo dolore iste ex voluptate
							quaerat et nemo incidunt et molestiae maiores ea omnis omnis et
							officiis culpa. Aut doloribus quidem et Quis expedita qui totam
							cupiditate eum placeat fugiat eum cupiditate quidem. Sed natus
							vero et quia quasi ex facere dolores.
						</p>
					</div>
				</div>
				<div className="p-2 bg-gray-300 my-8 w-full sm:w-3/4 xl:w-1/2 mx-auto rounded">
					<nav className="flex flex-row flex-wrap gap-3 text-sm justify-center my-1 text-neutral-600">
						<Link
							href={"/about"}
							className="hover:underline hover:text-neutral-800 active:text-neutral-950"
						>
							About
						</Link>
						<Link
							href={"/privacy-policy"}
							className="hover:underline hover:text-neutral-800 active:text-neutral-950"
						>
							Privacy Policy
						</Link>
						<Link
							href={"/home"}
							className="hover:underline hover:text-neutral-800 active:text-neutral-950"
						>
							Get App
						</Link>
					</nav>
					<Trademark />
				</div>
			</main>
		</>
	);
}

export default PrivacyPolicyPage;
