// Loaded Resolution State. Contains resolution object
export const useLoadedResolution = () =>
	useState("loadedResolution", () => {
		return {};
	});

// Contains path before login redirect
export const usePreAuthDestination = () =>
	useState("preAuthDestination", () => {
		return "";
	});
