export default defineNuxtRouteMiddleware((to, from) => {
	const {status, signIn} = useAuth();

	// Return immediately if user is already authenticated
	if (status.value === "authenticated") {
		return;
	}

	// Redirect to login page if user is not authenticated
	return navigateTo("/admin/login?redirect=" + to.fullPath);
});
