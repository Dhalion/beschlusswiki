const demoResolution = {
	//* RID - Resolution ID
	// If the resolution is edited, the resolution ID will remain the same,
	// but the document ID will change.
	// Is a 4 digit Hex number.
	rid: "12ab",

	//* RCODE - Resolution Code
	// This is a human readable code that is used to identify the resolution.
	// Contains the year and the tag seperated by a dash.
	rcode: "2020-A1",

	//* created - Date Created
	// This is the date the resolution was created.
	// Is a BSON date.
	created: "Sun Oct 01 2023 18:00:22 GMT+0200 (Mitteleuropäische Sommerzeit)",

	//* user - User
	// This is the user who created the resolution.
	// Is a User ID. (4 digit Hex number)
	user: "34cd",

	//* parent - Parent Resolution
	// This is the parent resolution if the resolution
	// is a edited version of another resolution.
	// Is a BSON Object ID.
	parent: "5f7b1c8b9e6c1d1e0f2a3b4c",

	//* BODY - Resolution Body
	body: {
		//* title - Resolution Title
		// This is the title of the resolution.
		title: "Resolution Title",

		//* tag - Resolution Tag
		// This is the tag of the resolution.
		tag: "A1",

		//* applicants - Resolution Applicants
		// This is a list of applicants. (String Array)
		applicants: ["RLP", "Bundesvorstand"],

		//* year - Resolution Year
		// This is the year of the resolution.
		year: "2020",

		//* category - Resolution Category
		// This is the category of the resolution.
		category: {
			//* name - Category Name
			// This is the name of the category.
			name: "Klima",

			//* id - Category ID
			// This is the ID of the category.
			// Is a 4 digit Hex number.
			id: "12ab",
		},

		//* text - Resolution Text
		// This is the text of the resolution.
		text: "Resolution Text",
	},
};
