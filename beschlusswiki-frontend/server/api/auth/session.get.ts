export default defineEventHandler(async (event) => {
	return new Response("Hello", {status: 200});
});
