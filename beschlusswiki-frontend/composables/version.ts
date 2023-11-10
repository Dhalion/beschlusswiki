export const getVersion = async () => {
	const version = (await import("~/package.json")).version;
	return version;
};
