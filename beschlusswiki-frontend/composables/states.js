// Search Object Shared State
export const useSearch = () =>
	useState("searchQuery", () => {
		return {
			searchQuery: "",
		};
	});
