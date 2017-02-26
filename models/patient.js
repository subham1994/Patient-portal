const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
	name: {
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		}
	},
	dob: {
		type: Date,
		required: true
	},
	sex: {
		type: String,
		required: true
	},
	contact: {
		type: Number,
		required: true,
		unique: true
	},
	symptoms: {
		type: [String],
		required: true
	},
	info: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Patient", PatientSchema)