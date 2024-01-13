import {omit} from "@nuxt/ui/dist/runtime/utils";
import type {IUser} from "./models/user.schema";
import type {ICategory} from "./models/category.schema";
import {ConnectionStates} from "mongoose";
//* Full Resolution Interface
export interface INewResolution {
	rid: String;
	rcode: String;
	created: Date;
	state: String;
	body: {
		title: String;
		tag: String;
		applicants: Array<String>;
		year: Number;
		category: ICategory | null;
		text: String;
	};
	applicantsInput: String;
}

export interface IResolution {
	_id: String;
	rid: String;
	rcode: String;
	created: Date;
	user: String;
	parent: String;
	state: String;
	hash?: String;
	body: {
		title: String;
		tag: String;
		applicants: Array<String>;
		year: Number;
		category: ICategory | null;
		text: String;
	};
}

export type IResolutionToSend = Omit<IResolution, "hash" | "user">;

export interface ICategoriesResponse {
	categories: Array<ICategory>;
}

export type SessionData = {
	token: string;
	user: IUser;
	expires: Date;
};

export type JWTSesssionData = {
	exp: number;
	iat: number;
	user: IUser;
};

// A resolution can be in one of three states
// Staged: The resolution has been created but not yet approved
// Live: The resolution has been approved and is live
// Archived: The resolution has been archived
// Rejected: The proposed resolution has been rejected
export enum ResolutionState {
	Staged = "staged",
	Live = "live",
	Archived = "archived",
	Rejected = "rejected",
	Draft = "draft",
}

export enum SearchEngine {
	// Enum for the search engine to use
	// Built in mongoDB or ElasticSearch
	MONGO = "mongo",
	ELASTICSEARCH = "elastic",
}

export enum PatchActions {
	ACCEPT = "accept",
	REJECT = "reject",
	ARCHIVE = "archive",
	SET_STATE_LIVE = "state_live",
	SET_STATE_STAGED = "state_staged",
}

export const resolutionStateToPatchAction: Record<
	ResolutionState,
	PatchActions
> = {
	[ResolutionState.Staged]: PatchActions.SET_STATE_STAGED,
	[ResolutionState.Live]: PatchActions.SET_STATE_LIVE,
	[ResolutionState.Archived]: PatchActions.ARCHIVE,
	[ResolutionState.Rejected]: PatchActions.REJECT,
	[ResolutionState.Draft]: PatchActions.SET_STATE_STAGED,
};

export enum ElasticStatus {
	// Enum for the ElasticSearch Server State
	// States are Available, Unavailable, and Unknown
	AVAILABLE = "available",
	UNAVAILABLE = "unavailable",
	UNKNOWN = "unknown",
}

export type ApiStatusData = {
	db: ConnectionStates;
	es: ElasticStatusResponse | null;
	api: 1;
};

export enum AdminDashboardResolutionsDisplay {
	ALL = "all",
	STAGED = "staged",
	NEW = "new",
	MY = "my",
}

export interface IResolutionCreatedResponse {
	success: boolean;
	id: string;
}

export interface ElasticStatusResponse {
	cluster_name: string;
	status: string;
	timed_out: boolean;
	number_of_nodes: number;
	number_of_data_nodes: number;
	active_primary_shards: number;
	active_shards: number;
	relocating_shards: number;
	initializing_shards: number;
	unassigned_shards: number;
	delayed_unassigned_shards: number;
	number_of_pending_tasks: number;
	number_of_in_flight_fetch: number;
	task_max_waiting_in_queue_millis: number;
	active_shards_percent_as_number: number;
}

export interface ElasticApiKeyResponse {
	id: string;
	name: string;
	api_key: string;
	encoded: string;
}

export type ElasticIndexInfo = {
	count: number;
	_shards: {
		total: number;
		successful: number;
		skipped: number;
		failed: number;
	};
};

export interface ElasticIndexInfoResponse {
	statusCode: number;
	message: string;
	data: ElasticIndexInfo;
}

export type {ICategory};
