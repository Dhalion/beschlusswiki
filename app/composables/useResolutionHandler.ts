import {utilHandleResolutionState as handleResolutionState} from "./ResolutionHandlerUtils/utilHandleResolutionState";
import {utilEnsureValidSession as ensureSession} from "./ResolutionHandlerUtils/utilEnsureValidSession";

/**
 * Composable to bundle functions to maipulate Resolutions via the Beschlusswiki API.
 */
export function useResolutionHandler() {
	return {
		// Ensure the User is logged in and authenticated
		ensureSession,
		handleResolutionState,
	};
}
