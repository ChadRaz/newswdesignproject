// This file was originally written by Alex Jimenez.
const PDFDocument = require('pdfkit');

// Get a connection to the database using fetch().

// Volunteer block. Used when adding volunteers.
function volunteer(doc, name, id, skills, pref, attended, noShow){
	doc.font(Helvetica, 14);
	doc.table({
		columnStyles: ["*", "*", "*", "*"], // Set up 4 columns.
		rowStyles: (i) => {
            // First row = Headers: Bold text, black underline, size 14.
			if (i === 0) return {border: [0, 0, 2, 0], borderColor: "black", font: "Helvetica-Bold", fontSize: 14}
            // Other rows = Values: normal text, lighter uderline, size 11.
            else return {border: [0, 0, 1, 0], borderColor: "lightslategray", font: "Helvetica", fontSize: 11};
        },
		// ...
		data: [
			[{colSpan: 3, text: name}, {align: right, text: id}],
			[{colSpan: 4, text: "SKILLS: " + skills.join(", ")}],
            [{colSpan: 4, text: "PREFERENCES: " + pref}]
		],
	});
    doc
        .underline(true)
        .text("ATTENDANCE")
        .underline(false);
    if (attended.length() === 0) doc.text(name + "hasn't volunteered at any events yet.")
    else for(let i = 0; i < attended.length(); i ++){
        // Query the database. Use the event's ID.
        let eName; // Event Name
        let eID; // Event ID
        let eDate; // Event Date
        let eTime; // Event Time
        let vRole; // Assigned Role

        doc.text(eName + " [" + eID + "]: " + eDate + " " + eTime);
        doc.list("ASSIGNED ROLE: " + vRole);
    }
    if (noShow.length() > 0){
        doc
            .underline(true)
            .text("NO SHOW: " + noShow.length() + " EVENT(S)")
            .underline(false);
        for(let i = 0; i < noShow.length(); i ++){
            // Query the database. Use the event's ID.
            let eName; // Event Name
            let eID; // Event ID
            let eDate; // Event Date
            let eTime; // Event Time

            doc.text(eName + " [" + eID + "]: " + eDate + " " + eTime);
        }
    }
}

// Event block. Used when adding events.
function event(doc, name, id, date, time, urgency, skills, desc, attendance){
	doc.table({
		columnStyles: ["*", "*", "*", "*"], // Set up 4 columns.
		rowStyles: (i) => {
            // First row = Headers: Bold text, black underline, size 14.
			if (i === 0) return {border: [0, 0, 2, 0], borderColor: "black", font: "Helvetica-Bold", fontSize: 14}
            // Other rows = Values: normal text, lighter uderline, size 11.
            else return {border: [0, 0, 1, 0], borderColor: "lightslategray", font: "Helvetica", fontSize: 11};
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
    doc
        .underline(true)
        .text("ATTENDANCE")
        .underline(false);
    if (attendance.length() === 0) doc.text(name + "N/A.")
    else for(let i = 0; i < attendance.length(); i ++){
        // Query the database. Use the event's ID.
        let eName; // Event Name
        let eID; // Event ID
        let eDate; // Event Date
        let eTime; // Event Time
        let vRole; // Assigned Role

        doc.text(eName + " [" + eID + "]");
    }
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
doc.pipe(res); // What does this do, exactly? Does it result in a browser prompt for printing?

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
    let preferences = "None";
    if (volunteerList[i].preferences().length() >= 1) preferences = String(volunteerList[i].preferences());
	volunteer(doc, volunteerList[i].name, volunteerList[i].id,
        volunteerList[i].skills, preferences, volunteerList[i].attendance, 
        volunteerList[i].noShow);
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
    let description = "No description provided.";
    if (eventList[i].desc().length() >= 1) description = String(eventList[i].desc());
    //function event(doc, name, id, date, time, urgency, skills, desc){
	event(doc, eventList[i].name, eventList[i].id, eventList[i].date,
        eventList[i].time, eventLit[i].urgency, eventList[i].skills,
        description, eventList[i].attendance);
    doc.moveDown();
}

doc.end();
// Is something supposed to go here?

