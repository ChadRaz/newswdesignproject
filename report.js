const PDFDocument = require('pdfkit');

function Volunteer(doc, last, first, id, skills, pref){
	doc.font(Helvetica, 14);
	doc.table({
		columnStyles: ["*", "*", "*", "*"],
		rowStyles: (i) => {
			if (i === 0) return {border: [0, 0, 2, 0], borderColor: "black", font: "Helvetica-Bold"}
            else return {border: [0, 0, 1, 0], borderColor: "lightgray", font: "Helvetica"}
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

let today = new Date();
let date = String(today.getMonth() + 1).padStart(2, "0") + "/"
    + String(today.getDate()).padStart(2, "0") + "/"
    + today.getFullYear();
let time = today.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});

var doc = new PDFDocument({size: 'LETTER'});
var stream = doc.pipe(blobStream());

doc.font('Helvetica');

doc
    .font('Helvetica-Bold', 26)
    .text('VOLUNTEER REPORT', {
	    align: 'center'
});
doc
    .font('Helvetica', 15)
    .text('Updated ' + date + ' at ' + time, {
	    align: 'center'
});
doc.moveDown();

doc
    .font('Helvetica-Bold', 20)
    .text('Volunteer Records', {
	    align: 'left'
});

if(volunteerList.length() === 0) {
	doc.text('There are no volunteers in the database.', {
		align: 'center'
	});
}
else for(let i = 0; i < volunteerList.length(); i ++){
	volunteer(doc, volunteerList[i].nameL, volunteerList[i].nameF,
        volunteerList[i].id, volunteerList[i].skills, volunteerList[i].preferences)
    doc.moveDown();
}
doc.moveDown();

doc
    .font('Helvetica-Bold', 20)
    .text('Past Events', {
	    align: 'left'
});



doc.end();

