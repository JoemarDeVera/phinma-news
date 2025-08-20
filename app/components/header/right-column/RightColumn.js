// Componentts
import HeaderNav from "./HeaderNav";
import MobileHeaderNav from "./MobileHeaderNav";

function RightColumn() {
	return (
		<>
			{/* pass image and name as props */}
			<HeaderNav />
			<MobileHeaderNav />
		</>
	);
}

export default RightColumn;
