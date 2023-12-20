import {ElasticStatus} from "~/types/Interfaces";

const CHECK_INTERVAL = 10000;
const ELASTIC_URL = "https://es.arschwolke.xyz";
// const ELASTIC_URL = "http://orca-test:9200";

export const useElastic = () => {
	return {
		elasticStatus,
		checkElasticStatus,
	};
};

const elasticStatus = ref({
	state: ElasticStatus.UNKNOWN,
	lastCheck: 0,
});

async function checkElasticStatus() {
	const toast = useToast();

	const diff = Date.now() - elasticStatus.value.lastCheck;
	if (
		diff > CHECK_INTERVAL &&
		elasticStatus.value.state === ElasticStatus.UNKNOWN
	) {
		elasticStatus.value.lastCheck = Date.now();

		const {data, error} = await useFetch("/_cluster/health", {
			baseURL: ELASTIC_URL,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			onRequestError: (error) => {
				console.error(error);
				elasticStatus.value.state = ElasticStatus.UNAVAILABLE;
				throwElasticErrorToast(
					"Elasticsearch nicht erreichbar",
					"Die Verbindung zu Elasticsearch konnte nicht hergestellt werden."
				);
			},
			onResponse: (response) => {
				if (!response.error && response.response.ok) {
					elasticStatus.value.state = ElasticStatus.AVAILABLE;
				} else {
					console.error(response);
					elasticStatus.value.state = ElasticStatus.UNAVAILABLE;
				}
			},
		});
	}
}

function throwElasticErrorToast(title: string, description: string) {
	const toast = useToast();
	toast.add({
		title,
		description,
		icon: "i-heroicons-information-circle",
	});
}
