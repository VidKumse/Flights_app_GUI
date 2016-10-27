$(document).ready(function() {
	var $elements_ul = $("#elements");
	var url = "http://localhost:4567/api/posts"
	var $flightsTable = $('#tbody');
	//var $row = $('tr');
	var flights = [];
	var $form = $('#user_input');
	var $confirm_btn = $("#confirm");
	var id_edit;
	var status_edit_add;
	var search_filter = [];


	function getAll(data) {
		var items = [];

				for(i=0; i<data.length; i++) {
					var cursor = data[i];
					//console.log(cursor.params["Flight number"]);

					items.push('<tr id="'+cursor.id+'"><td>'+cursor.id+'</td>'+
						'<td id="flight-number-table">'+cursor.params["Flight number"]+'</td>'+
						'<td id="origin-airport-table">'+cursor.params["Origin airport"]+'</td>'+
						'<td id="destination-airport-table">'+cursor.params["Destination airport"]+'</td>'+
						'<td id="carrier-table">'+cursor.params["Carrier"]+'</td>'+
						'<td id="price-table">'+cursor.params["Price"]+'</td>'+
						'<td id="day-table">'+cursor.params["Day"]+'</td>'+
						'<td id="time-table">'+cursor.params["Time"]+'</td>'+
						'<td id="duration-table">'+cursor.params["Duration"]+'</td>'+
						'<td id="available-seats-table">'+cursor.params["Available seats"]+'</td></tr>');
					}


				//$flightsTable.after(items.join(""));
				$flightsTable.append(items.join(""));
				//console.log(items.join(""));

	}

	
	$.ajax({
			url: url,
			//method: "GET",
			//dataType: "jsonp",
			success: function(data) {
				
				getAll(data);
			}
		});


	$(document).on("dblclick", "tr", function() {
		status_edit_add = 'edit';
		
		$("#flight-number").attr('value', $(this).children('#flight-number-table').text());
		$("#origin-airport").attr('value', $(this).children('#origin-airport-table').text());
		$("#destination-airport").attr('value', $(this).children('#destination-airport-table').text());
		$("#carrier").attr('value', $(this).children('#carrier-table').text());
		$("#price").attr('value', $(this).children('#price-table').text());
		$("#day").attr('value', $(this).children('#day-table').text());
		$("#time").attr('value', $(this).children('#time-table').text());
		$("#duration").attr('value', $(this).children('#duration-table').text());
		$("#available-seats").attr('value', $(this).children('#available-seats-table').text());

		id = $(this).attr('id');

		$form.css('display', 'block');
		
	});

	$(document).on("click", "tr", function() {
		$(this).toggleClass("clicked");
		var id = $(this).attr('id');
		
		if($(this).attr('class') == "clicked") {
			flights.push(id);
		}

		if($(this).attr('class') != "clicked") {
			flights = $.grep(flights, function(value) {
 			 return value != id;
			});
		}
		//console.log($(this).attr('class'));
		console.log(flights.join(""));
	});

	$('#delete').click(function() {
		for(i=0; i<flights.length; i++) {
			
			$.ajax({
			method: 'DELETE',
			url: url+"/"+flights[i],
			success: function(result) {
				console.log(result);
				location.reload();
			}
		});
		}

	});


	$('#add').click(function() {
		status_edit_add = 'add';
		$form.css('display', 'block');
	});

	$('#cancel').click(function() {
		$form.css('display', 'none');
	});

	$('#search').click(function() {
		$form.css('display', 'block');
		status_edit_add='search';
	})

	$('#refresh').click(function() {
		$flightsTable.empty();
		$.ajax({
			url: url,
			//method: "GET",
			//dataType: "jsonp",
			success: function(data) {
				
				getAll(data);
			}
		});

	})



	$confirm_btn.click(function() {
		var Flight_number = $('#flight-number').val();
		var Origin_airport = $('#origin-airport').val();
		var Destination_airport = $('#destination-airport').val();
		var Carrier = $('#carrier').val();
		var Price = $('#price').val();
		var Day = $('#day').val();
		var Time = $('#time').val();
		var Duration = $('#duration').val();
		var Available_seats = $('#available-seats').val();

		if(status_edit_add == 'add') {
			$.ajax({
			method: 'POST',
			url: url+"?Flight number="+Flight_number+"&"+
			"Origin airport="+Origin_airport+"&"+
			"Destination airport="+Destination_airport+"&"+
			"Carrier="+Carrier+"&"+
			"Price="+Price+"&"+
			"Day="+Day+"&"+
			"Time="+Time+"&"+
			"Duration="+Duration+"&"+
			"Available seats="+Available_seats,
			success: function(result) {
				console.log(result);
				location.reload();
			}
			});
		}

		if(status_edit_add == 'edit') {
			$.ajax({
			method: 'PUT',
			url: url+"/"+id+"?Flight number="+Flight_number+"&"+
			"Origin airport="+Origin_airport+"&"+
			"Destination airport="+Destination_airport+"&"+
			"Carrier="+Carrier+"&"+
			"Price="+Price+"&"+
			"Day="+Day+"&"+
			"Time="+Time+"&"+
			"Duration="+Duration+"&"+
			"Available seats="+Available_seats,
			success: function(result) {
				console.log(result);
				location.reload();
			}
			});
		}

		if(status_edit_add='search') {
			if(Flight_number != '') {search_filter.push("Flight number="+Flight_number)}
			if(Origin_airport != '') {search_filter.push("Origin airport="+Origin_airport)}
			if(Destination_airport != '') {search_filter.push("Destination airport="+Destination_airport)}
			if(Carrier != '') {search_filter.push("Carrier="+Carrier)}
			if(Price != '') {search_filter.push("Price="+Price)}
			if(Day != '') {search_filter.push("Day="+Day)}
			if(Time != '') {search_filter.push("Time="+Time)} 
			if(Duration != '') {search_filter.push("Duration="+Duration)}
			if(Available_seats != '') {search_filter.push("Available seats="+Available_seats)}

			console.log(search_filter.join("&"));

			$.ajax({
			method: 'GET',
			url: url+"/search?"+search_filter.join("&"),
			success: function(result) {
				console.log(result);
				//location.reload();
				$flightsTable.empty();
				getAll(result);
			}
			});
		}


		
		$form.css('display', 'none');
		
	});
	
});