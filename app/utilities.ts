export default function capitalize(str: string | String) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
