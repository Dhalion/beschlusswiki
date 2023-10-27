export default defineNuxtRouteMiddleware((to, from) => {
	const {status, signIn} = useAuth();

	// Return immediately if user is already authenticated
	if (status.value === "authenticated") {
		return;
	}

	// Save redirect path
	const redirectPath = to.fullPath;

	// Redirect to login page if user is not authenticated
	return navigateTo("/admin/login?redirect=" + redirectPath);
});
