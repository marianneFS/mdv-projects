/**
 * @author Lucy Hutcheson
 * Date: 2012-03-01
 * Created for:  Mobile Interfaces and Usability 1203
 */

	//Variable defaults
	var bibleTopics = ["--Choose A Topic--", "Christian Life", "Marriage", "Family"],
		audienceValue;
	makeTopics();
	setDate();
	var category = getUrlVars()["cat"];
	var lessonId = getUrlVars()["lessonId"];
	var op = getUrlVars()["op"];

	bible_book_disclosure();
	$("#focus").change(function(){
		bible_book_disclosure(); 
	});


	// Responsive Disclosure
	function bible_book_disclosure(){
		$('#ot-books').hide();
		$('#nt-books').hide();
		if($("#focus").val() == "Old Testament") {
			$("#ot-books").show();
		}else if($("#focus").val() == "New Testament"){
			$("#nt-books").show();
		}
	}
	


	function getData(audience) {
		// Update page header title
		var category = getUrlVars()["cat"];
		$('h1#headerTitle').replaceWith('<h2>'+ category + '</h2>');

		$('#errors').empty(); //Reset error messages

		if (localStorage.length === 0) {
			var ask = confirm("There are no lessons in local storage.  Do you want to load default lessons?");
			if(ask){
				autoFillData(audience);
			}else{
				alert("Lessons were not loaded.");
				return false;
			}
		}

		// Create list items from sorted storage array
		for (var i=0, len=localStorage.length; i<len; i++){
		
			var makeli = document.createElement('li');
			makeli.setAttribute("data-theme", "c");
		 	 $('#lesson-list').append(makeli);
			
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			// convert the string back to an object
			var obj = JSON.parse(value);
	
			var makeSubAnchor = document.createElement('a'); //create sub div
			makeSubAnchor.setAttribute("href", "view.html?lessonId="+key);
			makeSubAnchor.setAttribute("data-url", "view.html?lessonId="+key);
			makeSubAnchor.setAttribute("rel", "external");
			makeli.appendChild(makeSubAnchor); // add sub ul to li
			
			// Move date to the bottom if you want to sort based on Header Text
			// DATE
			var makeDate = document.createElement('p');
			makeDate.setAttribute("class", "ui-li-aside");
			var dateText = obj.date[1];
			makeSubAnchor.appendChild(makeDate);
			var dateSubText = "<strong>"+dateText+" </strong> ";
			makeDate.innerHTML = dateSubText;
			// HEADER TEXT
			var makeHeader = document.createElement('h3');
			var headerText = obj.name[1];
			makeSubAnchor.appendChild(makeHeader);
			makeHeader.innerHTML = headerText;
			// SUB HEAD
			var makeStrongP = document.createElement('p');
			makeStrongP.setAttribute("style", "font-weight: bold;");
			var strongPText = obj.topic[0] + " " + obj.topic[1];
			makeSubAnchor.appendChild(makeStrongP);
			makeStrongP.innerHTML = strongPText;
			// LESSON DESCRIPTION
			var makeDesc = document.createElement('p');
			var descText = obj.lesson[1];
			makeSubAnchor.appendChild(makeDesc);
			makeDesc.innerHTML = descText;
		}

	}

	switch (category) {
		case "Adults":
			var audience = "Adults";
			getData(json.adults.lessons);
		 	break;
		case "Men":
			var audience = "Men";
			getData(json.men.lessons);
		  	break;
		case "Women":
			var audience = "Women";
			getData(json.women.lessons);
		  	break;
		case "Youth":
			var audience = "Youth";
			getData(json.youth.lessons);
		  	break;
		case "Children":
			var audience = "Children";
			getData(json.children.lessons);
		  	break;
	}


	if(lessonId > 0) {
		showLesson(lessonId);
	}
	function showLesson(id){
		var lessonKey = id;
		var value = localStorage.getItem(lessonKey);
		// convert the string back to an object
		var obj = JSON.parse(value);
		var makeSubDiv = document.createElement('div'); //create sub div
		makeSubDiv.setAttribute("class", "content-container ui-btn  ui-li ui-corner-top ui-corner-bottom ui-btn-up-c");
	    $('#content').append(makeSubDiv);
		for(var n in obj){
			var makeSubP = document.createElement('p');
			var audienceClass = obj.audience[1];
			makeSubP.setAttribute("class", "item-details " );
			makeSubDiv.appendChild(makeSubP);
			var optSubText = "<strong>"+obj[n][0]+" </strong> "+obj[n][1];
			makeSubP.innerHTML = optSubText;
		}
		var makeHeader = document.createElement('h3');
		//var headerText = obj.name[1];
		makeSubDiv.appendChild(makeHeader);
		//makeHeader.innerHTML = headerText;
		$('h1#headerTitle').replaceWith('<h1>'+ obj.name[1] + '</h1>');
		
		//Create Edit button
		$("#navbar ul").prepend('<li><a href="additem.html?lessonId='+id+'&op=edit" title="Edit Lesson" data-icon="gear" rel="external">Edit</a></li>');
	}

	//Add default data if there is none in local storage
	function autoFillData(audience){
		//Store the JSON object in local storage
		for(var n in audience){
			var id = Math.floor(Math.random()*10000001);
			localStorage.setItem(id, JSON.stringify(audience[n]));
		}
	} 

	// Sort my lesson list after it has been created
	var mylist = $('#lesson-list');
	var listitems = mylist.children('li').get();
	listitems.sort(function(a, b) {
	var compA = $(a).text().toUpperCase();
	var compB = $(b).text().toUpperCase();
	// Currently set to descending date based on the > < symbols
	// Set to < > to sort ascending
	return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
	})
	$.each(listitems, function(idx, itm) { mylist.append(itm); });
   
    //Create select field element and populate with options.
	function makeTopics(){
		var formTag = document.getElementsByTagName("form"), // formTag is an array of all form tags.
			makeSelect = document.createElement('select');
		makeSelect.setAttribute("id", "topics");
		makeSelect.setAttribute("data-theme", "c");
		for (var i=0, j=bibleTopics.length; i<j; i++){
			var makeOption = document.createElement('option');
			var optText = bibleTopics[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		$('#select').append(makeSelect);
	}
	
	//  Set default date
	function setDate(){
		if (!($('#date').val()) ) {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1;//January is 0!
			var yyyy = today.getFullYear();
			if(dd<10){dd='0'+dd}
			if(mm<10){mm='0'+mm}
			$('#date').val(mm+'/'+dd+'/'+yyyy);
		}
	}
	
	function toggleControls(n){
		switch(n){
			case "on":
				$('#lessonForm').css("display", "none");
				$('displayLink').css("display", "none");
				$('addNew').css("display", "block");
				$('required').css("display", "none");
				$('#pageTitle').html("Submitted Bible Study Lessons");
				break;
			case "off":
				$('lessonForm').css("display", "block");
				$('clear').css("display", "inline");
				$('displayLink').css("display", "inline");
				$('addNew').css("display", "none");
				$('items').css("display", "none");
				break;
			default:
				return false;
		}
	}

	//Save data into local storage.
	function storeData(key,category){
		//Create new key if one doesn't exist.
		if(!key){
			var id = Math.floor(Math.random()*10000001);
		}else{
			//Use the existing key.
			var id = key;
		}
		// Gather up all form values and labels.
		//Find the value of the selected radio button.
		var newItem = {};
			newItem.name = ["Lesson Name:", $('#lesson-name').val()];
			newItem.author = ["Author:", $('#author').val()];
			newItem.email = ["Email:", $('#email').val()];
			newItem.date = ["Date:", $('#date').val()];
			newItem.topic = ["Topics:", $('#topics').val()];
			newItem.focus = ["Focus:", $('#focus').val()];
			newItem.book = ["Book:", $('#book').val()];
			newItem.audience = ["Audience:", $('input:radio[name=audience]:checked').val()];
			newItem.length = ["Lesson Length:", $('#length').val()];
			newItem.lesson = ["Lesson Text:", $('#lesson-text').val()];

		//Save data into local storage
		localStorage.setItem(id, JSON.stringify(newItem));
		alert("Bible Study Lesson successfully saved.");
		window.location.href = "lessons.html?cat="+newItem.audience[1];
	}

	// EDIT FUNCTION
	if(op === 'edit') {
		editLesson(lessonId);
	}
	function editLesson(lessonId){
		//Grab the data from local storage
		var value = localStorage.getItem(lessonId);
		var item = JSON.parse(value);
		
		//populate the form fields with current values
		$('#lesson-name').val(item.name[1]);
		$('#author').val(item.author[1]);
		$('#email').val(item.email[1]);
		$('#date').val(item.date[1]);
		$('#topics').val(item.topic[1]);
		$('#focus').val(item.focus[1]);
		$('#book').val(item.book[1]);
		var radios = document.forms[0].audience;
		for(var i=0; i<radios.length; i++){
			if(radios[i].value == "Adults" && item.audience[1] == "Adults") {
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Children" && item.audience[1] == "Children") {
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Youth" && item.audience[1] == "Youth") {
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Men" && item.audience[1] == "Men") {
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Women" && item.audience[1] == "Women") {
				radios[i].setAttribute("checked", "checked");
			}
		}
		$('#length').val(item.length[1]);
		$('#lesson-text').val(item.lesson[1]);
		//remove initial listener from save button
		$("#submit").unbind("click");
		//Change submit button value to edit button
		$('#submit').attr('value','Edit Lesson');
		$('#lessonForm').submit(function() {
			validateForm(lessonId);
		});
	}
	
	// DELETE FUNCTION
	function deleteLesson(){
		var ask = confirm("Are you sure you want to delete this lesson?");
		if(ask){
			localStorage.removeItem(lessonId);
			alert("Lesson was successfully deleted.")
			if(localStorage.length === 0){
				window.location.href = "index.html";
			} else {
        		parent.history.back();
			}
		}else{
			alert("Lesson was NOT deleted.");
		}
	}
	
	// CLEAR ALL FUNCTION
	function clearLocal(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			var ask = confirm("Are you sure you want to delete all lessons?");
			if(ask){
				localStorage.clear();
				alert("All information deleted.");
				window.location.href = "index.html";
				return false;
			}else{
				alert("Lesson was NOT deleted.");
			}
		}
	}

	// VALIDATE FUNCTION
	function validateForm(lessonId) {
		var getLessonName = $("#lesson-name").val();
		var getAuthor = $("#author").val();
		var getEmail = $("#email").val();
		var getTopic = $("#topics").val();
		var formErrors = $('#formErrors');

		//Reset error messages
		$(".error").hide();
		var hasError = false;
		$('#errors').empty();
		$('#lesson-name').css("border", "none") ;
		$('#author').css("border", "none") ;
		$('#email').css("border", "none") ;
		$('#select > div').css("border", "none") ;

		//Get Error messages
		var messageArray = [];
		//Lesson Name validation
		if(getLessonName == ""){
			$('#lesson-name').after('<span class="error">Please enter a lesson name.</span>');
			$('#lesson-name').css("border", "1px solid red") ;
			hasError = true;
		}
		//Author validation
		if(getAuthor == ""){
			$('#author').after('<span class="error">Please enter an author name.</span>');
			$('#author').css("border", "1px solid red") ;
			hasError = true;
		}
		//Email validation
		var re = /^\w+([\.-]?]\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if ((getEmail == '') || (!re.test(getEmail))){
			$('#email').after('<span class="error">Please enter a valid email address.</span>');
			$('#email').css("border", "1px solid red") ;
			hasError = true;
		} 
		
		//Topic validation
		if(getTopic === "--Choose A Topic--"){
			$('#select > div').after('<span class="error">Please choose a topic.</span>');
			var topicError = "Please choose a topic.";
			$('#select > div').css("border", "1px solid red") ;
			hasError = true;
		}
		
		//Set Errors
		if(hasError == true) {
			$('#submit-container').after('<span class="error">Please correct the errors above.</span>');
			event.preventDefault();
			return false;
		}else{
			//If all is validated, save the data and send the key value from editData
			storeData(lessonId);
		}
	}

	// Get value from URL
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	}

	if(op != 'edit') {
		$("#submit").click(function() {
		  validateForm();
		});
	}

