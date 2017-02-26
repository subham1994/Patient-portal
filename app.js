const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const Patient = require('./models/patient');

// use native promises in mongoose
mongoose.Promise = global.Promise;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(config.connectionString, (err) => {
	if (err) {
		console.log(`${err.name}: ${err.message}`);
		return;
	}
	console.log("connection established to the db");
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

router.get('/patients', (req, res) => {
	Patient
		.find()
		.exec()
		.then(patients => {
			res.json(patients);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.post('/patients', (req, res) => {
	const patientData = req.body;

	var patient = new Patient({
		'name.firstName': patientData.firstName,
		'name.lastName': patientData.lastName,
		dob: new Date(patientData.dob),
		sex: patientData.sex,
		contact: patientData.contact,
		symptoms: patientData.symptoms,
		info: patientData.info
	});

	patient
		.save()
		.then(patient => {
			res.json(patient);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

app.use('/api', router);

app.listen(PORT, () => {
	console.log("Listening at port: " + PORT);
});