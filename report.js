const PDFDocument = require('pdfkit');

// Volunteer block. Used when adding volunteers.
function volunteer(doc, last, first, id, skills, pref){
	doc.font(Helvetica, 14);
	doc.table({
		columnStyles: ["*", "*", "*", "*"], // Set up 4 columns.
		rowStyles: (i) => {
            // First row = Headers: Bold text, black underline, size 14.
			if (i === 0) return {border: [0, 0, 2, 0], borderColor: "black", font: "Helvetica-Bold", fontSize: 14}
            // Other rows = Values: normal text, lighter uderline, size 11.
            else return {border: [0, 0, 1, 0], borderColor: "lightgray", font: "Helvetica", fontSize: 11};
        },
		// ...
		data: [
			[{colSpan: 3, text: last + ", " + first}, {align: right, text: id}],
			[{colSpan: 4, text: "SKILLS: " + skills.join(", ")}],
            [{colSpan: 4, text: pref}]
		],
	});
    // Query for events attended by the volunteer. Use id.
}

// Event block. Used when adding events.
function event(doc, name, id, date, time, urgency, skills, desc){
	doc.table({
		columnStyles: ["*", "*", "*", "*"], // Set up 4 columns.
		rowStyles: (i) => {
            // First row = Headers: Bold text, black underline, size 14.
			if (i === 0) return {border: [0, 0, 2, 0], borderColor: "black", font: "Helvetica-Bold", fontSize: 14}
            // Other rows = Values: normal text, lighter uderline, size 11.
            else return {border: [0, 0, 1, 0], borderColor: "lightgray", font: "Helvetica", fontSize: 11};
        },
		// ...
		data: [
			[{colSpan: 3, text: name}, {align: right, text: id}],
            [date, {colSpan: 2, text: time}, {align: right, text: urgency}],
			[{colSpan: 4, text: "REQUIRED SKILLS: " + skills.join(", ")}],
            [{colSpan: 4, text: desc}]
		],
	});
    // Query for attendance record of event. Use id.
}

// For the update subtitle.
let today = new Date();
let date = String(today.getMonth() + 1).padStart(2, "0") + "/"
    + String(today.getDate()).padStart(2, "0") + "/"
    + today.getFullYear();
let time = today.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
// End of Date block.

var doc = new PDFDocument({size: 'LETTER'});
var stream = doc.pipe(blobStream());

doc.font('Helvetica');

doc // "VOLUNTEER REPORT"
    .font('Helvetica-Bold', 26)
    .text('VOLUNTEER REPORT', {
	    align: 'center'
});
doc // "Updated on MM/DD/20YY at XX:XX YM"
    .font('Helvetica', 15)
    .text('Updated on ' + date + ' at ' + time, {
	    align: 'center'
});
doc.moveDown(); // Acts as a line break.

doc
    .font('Helvetica-Bold', 20)
    .text('Volunteer Records', {
	    align: 'left'
});

doc.font("Helvetica", 11);

if(volunteerList.length() === 0) { // If no volunteers...
	doc.text('There are no volunteers in the database.', {
		align: 'center'
	});
}
else for(let i = 0; i < volunteerList.length(); i ++){ // Volunteers are listed from first ID to last ID.
	volunteer(doc, volunteerList[i].nameL, volunteerList[i].nameF,
        volunteerList[i].id, volunteerList[i].skills, volunteerList[i].preferences)
    doc.moveDown();
}

doc.addPage(); // Move to next page.

doc
    .font('Helvetica-Bold', 20)
    .text('Past Events', {
	    align: 'left'
});

doc.font("Helvetica", 11);

if(eventList.length() === 0) { // Events are listed from most recent onward.
	doc.text('There are no events in the database.', {
		align: 'center'
	});
}
else for(let i = eventList.length() - 1; i > -1; i --){
	event(doc, eventList[i].name, volunteerList[i].id,
        volunteerList[i].id, volunteerList[i].skills, volunteerList[i].preferences)
    doc.moveDown();
}



doc.end();

