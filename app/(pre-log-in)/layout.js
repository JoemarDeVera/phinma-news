import "@/app/globals.css";
import { Inter } from "next/font/google";
import Provider from "../components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Phinma News",
	description:
		"A social media platform for Phinma students to get their daily campus news.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
					rel="stylesheet"
				/>
			</head>
			<body className={inter.className}>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
