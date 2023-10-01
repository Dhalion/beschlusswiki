// Search Object Shared State
export const useSearch = () =>
	useState("searchQuery", () => {
		return {
			searchQuery: "",
		};
	});

// Loaded Resolution State. Contains resolution object
export const useLoadedResolution = () =>
	useState("loadedResolution", () => {
		return {};
	});
