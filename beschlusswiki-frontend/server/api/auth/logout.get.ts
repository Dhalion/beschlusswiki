export default defineEventHandler(async (event) => {
	return new Response("Signed Out", {status: 200});
});
