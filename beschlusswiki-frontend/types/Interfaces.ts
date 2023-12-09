import {omit} from "@nuxt/ui/dist/runtime/utils";
import type {IUser} from "./models/user.schema";

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

export interface ICategory {
	_id: String;
	name: String;
	tag: String;
	resolutions: Array<String>;
}

export interface ICategoriesResponse {
	categories: Array<ICategory>;
}

export interface SessionData {
	accessToken: string;
	refreshToken: string;
	user: IUser;
	expires: Date;
}

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
};
