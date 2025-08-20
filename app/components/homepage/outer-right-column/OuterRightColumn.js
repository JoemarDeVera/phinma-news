import TrendingNews from "../TrendingNews";

function OuterRightColumn() {
	return (
		<div className="hidden xl:block w-1/3 max-w-sm rounded bg-gray-100 mt-4 px-2">
			<TrendingNews />
		</div>
	);
}

export default OuterRightColumn;
