import {PatchActions} from "~/types/Interfaces";

/**
 * Accepts or rejects a proposed Resolution by changing its sate to live
 * or rejected.
 * @param id The id of the resolution to accept
 * @param action The action to perform on the resolution (ACCEPT / REJECT)
 */
export async function utilHandleResolutionState(
	id: string,
	action: PatchActions
) {
	const toast = useToast();
	const config = useRuntimeConfig();
	const API_ENDPOINT = config.public.apiEndpoint;
	const auth = useAuth();

	const {data, error, status, pending} = useFetch("/resolution", {
		baseURL: API_ENDPOINT,
		method: "PATCH",
		query: {
			id: id,
			action: action,
		},
		headers: {
			Authorization: String(auth.token.value),
		},
	});

	if (error.value) {
		console.error(error.value);
		toast.add({
			title: "Error",
			description: error.value.message,
			timeout: 5000,
		});
	} else {
		toast.add({
			title: "Beschluss bearbeitet",
			description: `Der Beschluss ${id} wurde ${translate(action)}`,
			timeout: 5000,
		});
	}
}

const translate = (action: PatchActions) => {
	switch (action) {
		case PatchActions.ACCEPT:
			return "akzeptiert";
		case PatchActions.ARCHIVE:
			return "archiviert";
		case PatchActions.REJECT:
			return "abgelehnt";
		case PatchActions.SET_STATE_LIVE:
			return "auf live gesetzt";
		case PatchActions.SET_STATE_STAGED:
			return "auf Entwurf gesetzt";
	}
};
