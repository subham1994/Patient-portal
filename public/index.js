$(document).ready(function() {
	// Materialize css initialization
	$('select').material_select();
	$('.collapsible').collapsible();

	$('#id_create_entry').click(function(evt) {
		evt.preventDefault();
		$(this).addClass('active');
		$('#id_entry_section').show();
		$('#id_directory').removeClass('active');
		$('#id_dir_sec').html('');
		$('#id_nav_sec').html('');
	});

	function isValid(data) {
		var isvalid = true;
		if (!data.firstName) {
			isvalid = false;
			$('input[name=firstName]').addClass('invalid');
		}
		if (!data.lastName) {
			isvalid = false;
			$('input[name=lastName]').addClass('invalid');
		}
		if (!data.sex) {
			isvalid = false;
			Materialize.toast('Please select your gender', 4000);
		}
		if (!data.info) {
			isvalid = false;
			$('input[name=info]').addClass('invalid');
		}
		if (data.symptoms.length === 0) {
			isvalid = false;
			Materialize.toast('Please provide atleast one symptom', 4000);
		}
		if (!data.contact || isNaN(data.contact)) {
			isvalid = false;
			$('input[name=contact]').addClass('invalid');
		}
		var dateParts = data.dob.split('-').filter(function(num) {
			return !isNaN(num);
		});
		console.log(dateParts);
		if (dateParts.length < 3) {
			isvalid = false;
			$('input[name=dob]').addClass('invalid');
		} else if (dateParts.length === 3) {
			if (dateParts[0] < 1000 || dateParts[1] >= 13 || dateParts[1] <= 0 || dateParts[2] > 31 || dateParts[2] <= 0) {
				isvalid = false;
				$('input[name=dob]').addClass('invalid');
			}
		}
		return isvalid;
	}

	function resetForm() {
		$('input[name=firstName]').val('');
		$('input[name=lastName]').val('');
		$('select[name=sex]').val('');
		$('input[name=contact]').val('');
		$('input[name=dob]').val('');
		$('select[name=symptoms]').val('');
		$('input[name=info]').val('');
	}

	$('#id_submit').click(function(evt) {
		evt.preventDefault();
		var data = {
			firstName: $('input[name=firstName]').val(),
			lastName: $('input[name=lastName]').val(),
			sex: $('select[name=sex]').val(),
			contact: $('input[name=contact]').val(),
			dob: $('input[name=dob]').val(),
			symptoms: $('select[name=symptoms]').val(),
			info: $('input[name=info]').val()
		};

		if (isValid(data)) {
			var options = {
				method: 'POST',
				mode: 'same-origin',
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			};

			fetch('/api/patients', options)
				.then(function(response) {
					if (response.status !== 200) {
						throw new Error();
					} else {
						return response.json();
					}
				})
				.then(function(data) {
					resetForm();
					Materialize.toast('Entry created successfully !', 4000)
					console.log(data);
				})
				.catch(function(err) {
					Materialize.toast('Error while creating entry !', 4000)
					console.log(err);
				});
		}
	});

	function getFormattedDate(date) {
		date = new Date(date);
		return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
	}

	function getSymptomChips(symptoms) {
		str = '';
		symptoms.forEach(function(symptom) {
			str += '\
			<div class="chip custom-chip">\
				<b>' + symptom + '</b>\
			</div>'
		})
		return str;
	}

	function renderSearch() {
		var $search = $('\
			<nav class="white" style="color: rgba(0, 0, 0, 0.71); margin-bottom: 10px;">\
				<div class="nav-wrapper">\
					<div class="input-field">\
						<input name="name" id="search" type="search" placeholder="enter a name to search patient" required>\
					</div>\
				</div>\
			</nav>');
		
		$('#id_nav_sec').append($search);
	}

	function renderUsersList(usersData) {
		$('#id_dir_sec').html('');
		usersData.forEach(function(userData) {
			var $metaData = $(
				'<div class="card-panel">\
					<h3 class="header-text right-align">'+ userData.name.firstName + ' ' + userData.name.lastName +'</h3>\
					<div class="row">\
						<div class="col l12">\
							<table class="highlight centered">\
								<thead>\
									<tr>\
										<th data-field="gender">Gender</th>\
										<th data-field="dob">DOB</th>\
										<th data-field="contact">contact</th>\
									</tr>\
								</thead>\
								<tbody>\
									<tr>\
										<td>'+ userData.sex +'</td>\
										<td>'+ getFormattedDate(userData.dob) +'</td>\
										<td>'+ userData.contact +'</td>\
									</tr>\
							</table>\
						</div>\
					</div>\
					<div class="row">\
						<div class="col l12">\
							<ul class="collection">\
								<li class="collection-item">\
									<span class="title info-title">Symptoms</span>\
									<br>'
									+ getSymptomChips(userData.symptoms) + '\
								</li>\
								<li class="collection-item">\
									<span class="title info-title">Info</span>\
									<p class="info-text">'+ userData.info +'</p>\
								</li>\
							</ul>\
						<div>\
					<div>\
				</div>\
				<br>'
			);
			$('#id_dir_sec').append($metaData);
		});
	};

	var users;
	$('#id_directory').click(function(evt) {
		evt.preventDefault();
		$('#id_create_entry').removeClass('active');
		$('#id_entry_section').hide();
		$(this).addClass('active');
		$('#id_dir_sec').html('');
		$('#id_nav_sec').html('');
		renderSearch();

		var options = {
			method: 'GET',
			mode: 'same-origin'
		};

		fetch('/api/patients', options)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				users = data;
				renderUsersList(users);
			})
			.catch(function(err) {
				Materialize.toast('Could not fetch the patients list !', 4000)
				console.log(err);
			});
	});

	$(document).on('keyup', '#search', function() {
		renderUsersList(users.filter(function(user) {
			var name = user.name.firstName + ' ' + user.name.lastName;
			return name.indexOf($('#search').val()) !== -1;
		}));
	});
});