import {
	SearchEngine,
	type ElasticApiKeyResponse,
	type IReducedResolution,
} from "~/types/Interfaces";
import type {IResolution} from "~/types/models/resolution.schema";

type useSearchOptions = {
	engine?: SearchEngine;
	limit?: number;
	automatic?: boolean;
};

export async function useSearch(
	query: Ref<string>,
	options?: useSearchOptions
) {
	const config = useRuntimeConfig();
	const results = ref(<IReducedResolution[]>[]);
	const error = ref<string | null>("");
	const pending = ref(false);
	const elasticAvailable = ref(false);
	const elasticKey = ref<string | null>(null);
	const elasticLastUpdate = ref<number>(0);
	const resultsFrom = ref<SearchEngine | null>(null);

	if (!elasticAvailable.value || Date.now() - elasticLastUpdate.value > 3000) {
		getElasticAPIKey()
			.then((res) => {
				// console.log(res);
				elasticKey.value = res.key;
				elasticAvailable.value = res.success;
			})
			.catch((e) => {
				console.error(e);
				elasticAvailable.value = false;
				elasticKey.value = null;
			})
			.finally(() => {
				elasticLastUpdate.value = Date.now();
			});
	}

	const search = async (query: Ref<string>) => {
		pending.value = true;
		error.value = null;
		results.value = [];

		if (!query) {
			pending.value = false;
			return;
		}

		pending.value = true;

		try {
			if (
				options?.engine !== SearchEngine.ELASTICSEARCH ||
				!elasticAvailable.value ||
				!elasticKey.value
			) {
				results.value = await searchMongo(query);
				resultsFrom.value = SearchEngine.MONGO;
			} else {
				results.value = await searchElastic(query);
				resultsFrom.value = SearchEngine.ELASTICSEARCH;
			}
		} catch (error: any) {
			console.error(`Error while searching: ${error}`);
			error.value = error.message;
			results.value = [];
		}
		pending.value = false;
	};

	async function searchMongo(
		query: Ref<string>
	): Promise<IReducedResolution[]> {
		const {data, pending, error, refresh} = await useFetch("/api/resolution", {
			baseURL: config.public.apiEndpoint,
			query: {
				query: query,
				engine: SearchEngine.MONGO,
			},
			key: Date.now().toLocaleString(),
		});
		if (data.value && !pending.value && !error.value) {
			return data.value;
		}
		return [];
	}

	async function searchElastic(
		query: Ref<string>
	): Promise<IReducedResolution[]> {
		// console.log(`Searching elastic for ${query}`);
		const {data, pending, error, refresh} = await useFetch<any>("/_search", {
			baseURL: config.public.elasticUrl + "/" + config.public.elasticIndex,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "ApiKey " + elasticKey.value,
			},
			body: {
				query: {
					simple_query_string: {
						query: query,
						default_operator: "and",
					},
				},
			},
		});
		if (data.value && !pending.value && !error.value) {
			return data.value?.hits.hits.map((hit: any) => {
				return {
					...hit._source,
					_id: hit._id,
				};
			});
		}
		if (error.value) {
			console.error(error.value);
		}
		return [];
	}

	async function getElasticAPIKey(): Promise<{
		success: boolean;
		key: string | null;
	}> {
		const {data, pending, error, refresh} =
			await useFetch<ElasticApiKeyResponse>("/api/auth/elastickey");
		if (data?.value && !pending.value && !error.value) {
			return {success: true, key: data.value.encoded};
		}
		return {success: false, key: null};
	}

	watchEffect(() => {
		if (options?.automatic != false) {
			search(query);
		}
	});

	return {
		search,
		results,
		error,
		pending,
		resultsFrom,
	};
}
