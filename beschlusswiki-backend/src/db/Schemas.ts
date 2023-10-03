import mongoose, {mongo} from "mongoose";

//! #################################
//! #    THIS FILE IS DEPRECATED    #
//! #################################

//* USER Schema
const userSchema = new mongoose.Schema({
	uuid: {type: String, unique: true, required: true},
	username: {type: String, unique: false, required: true},
	email: {type: String, unique: true, required: false},
	authentication: {
		password: {type: String, select: false},
		salt: {type: String, select: false},
		sessionToken: {type: String, select: false},
	},
});

export const UserModel = mongoose.model("User", userSchema, "users");

export interface IResolution {
	rid: String;
	rcode: String;
	created: Date;
	user: String;
	parent: mongoose.Schema.Types.ObjectId;
	body: {
		title: String;
		tag: String;
		applicants: Array<String>;
		year: Number;
		category: {
			name: String;
			id: String;
		};
		text: String;
	};
}

//* RESOLUTION Schema
const resolutionSchema = new mongoose.Schema<IResolution>(
	{
		rid: {type: String, unique: true},
		rcode: {type: String},
		created: {type: Date},
		user: {type: String},
		parent: {type: mongoose.Schema.Types.ObjectId},
		body: {
			title: {type: String},
			tag: {type: String},
			applicants: {type: Array},
			year: {type: Number},
			category: {
				name: {type: String},
				id: {type: String},
			},
			text: {type: String},
		},
	},
	{strict: "throw"} // Throw an error if invalid data is passed
);

export const ResolutionModel = mongoose.model(
	"anträge",
	resolutionSchema,
	"resolutions"
);

//**********************************/
//****** RESOLUTION METHODS ********/
//**********************************/
export const getAllResolutions = () => ResolutionModel.find();
export const getResolutionById = (id: string) => ResolutionModel.findById(id);
export const createResolution = (values: Record<string, any>) =>
	new ResolutionModel(values)
		.save()
		.then((resolution) => resolution.toObject());
export const deleteResolutionById = (id: string) =>
	ResolutionModel.findByIdAndDelete(id);
export const updateResolutionById = (id: string, values: Record<string, any>) =>
	ResolutionModel.findByIdAndUpdate(id, values, {new: true});

//******************************** */
//****** USER METHODS **************
//**********************************/
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: String) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken: String) =>
	UserModel.findOne({"authentication.sessionToken": sessionToken});

export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
	new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);
export const updateUserById = (id: string, values: Record<string, any>) =>
	UserModel.findByIdAndUpdate(id, values, {new: true});
