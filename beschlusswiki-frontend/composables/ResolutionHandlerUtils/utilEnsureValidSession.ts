/**
 * Ensures the User is logged in and there is a valid session token.
 */
export async function utilEnsureValidSession() {
	// Ensure JWT is valid
	const {getSession, token} = useAuth();
	const toast = useToast();
	const router = useRouter();
	const route = useRoute();
	const session = await getSession({required: true});
	if (!session) {
		toast.add({
			title: "Fehler beim Speichern",
			description: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
			icon: "i-heroicons-exclamation-triangle",
			actions: [
				{
					label: "Anmelden",
					click: () => router.push(`/admin/login?redirect=${route.fullPath}`),
				},
			],
		});
		return false;
	}
	return true;
}
