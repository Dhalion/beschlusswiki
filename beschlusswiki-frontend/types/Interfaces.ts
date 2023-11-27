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
