import Image from "next/image";

function Trademark() {
	return (
		<div className="flex flex-col gap-2 items-center justify-center text-xs">
			<span className="block mt-2">
				<Image
					src={"/logo/pn_logo_small.webp"}
					alt="Phinma News logo"
					width={40}
					height={40}
					className="align-bottom mx-auto"
					style={{ minWidth: "24px" }}
				/>
			</span>
			<p className="text-center">Phinma News © 2022. All rights reserved</p>
		</div>
	);
}

export default Trademark;
