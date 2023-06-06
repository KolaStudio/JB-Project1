const NOTES_StorageKey = "Kola-Note";
const RECYCLE_StorageKey = "Kola-Recycle";
let notesArr = [];
let recycleArr = [];

const taskTextBox = document.getElementById("taskTextBox");
const dateInputBox = document.getElementById("dateInputBox");
const timeInputBox = document.getElementById("timeInputBox");

loadFromLocalStorage();

function createNote(){
    event.preventDefault();
    const note = {
        task: taskTextBox.value,
        date: dateInputBox.value,
        time: timeInputBox.value,
        create: new Date(),
        visual: {
            rotate: (Math.random() * (5 + 5)) -5,
            scotch: Math.floor(Math.random() * 5)+1,
            scotchPos: Math.floor(Math.random() * (140 - 50)) + 50
        }
    }
    notesArr.push(note);
    saveToLocalStorage();
    displayNotes();
    clearForm();
}

function saveToLocalStorage(){
    const str1 = JSON.stringify(notesArr);
    localStorage.setItem(NOTES_StorageKey, str1);

    const str2 = JSON.stringify(recycleArr);
    localStorage.setItem(RECYCLE_StorageKey, str2);
}

function loadFromLocalStorage(){
    const str = localStorage.getItem(NOTES_StorageKey);
    if(str){
        notesArr = JSON.parse(str);
        displayNotes();
    }
}

function displayNotes(){
    const allNotesContainer = document.getElementById("allNotesContainer");
    let html = "";

    for(let i=0; i<notesArr.length; i++){
        html += `
        <div class="noteItem" style="rotate: ${notesArr[i].visual["rotate"]}deg;">
            <img class="scotch" src="assets/images/s${notesArr[i].visual["scotch"]}.png" style="margin-left:${notesArr[i].visual["scotchPos"]}px" alt="#">
            <div class="noteTools">
                <button id="delete_${i}" class="deleteBtn" onclick="deleteNote(${i})">X</button>
            </div>
            <div class="noteContent"><div>${notesArr[i].task}</div><span class="contentFade"></span></div>
            <div class="noteDateAndTime"><span>${notesArr[i].date}</span> <span>${notesArr[i].time}</span></div>
        </div>
        `;
    }
    allNotesContainer.innerHTML = html;
}

function editNote(noteID){
    //Open popup form
}

function deleteNote(noteID){
    recycleArr.push(notesArr[noteID]);
    notesArr.splice(noteID, 1);
    saveToLocalStorage();
    displayNotes();
}

function clearForm(){
    taskTextBox.value = "";
    dateInputBox.value = "";
    timeInputBox.value = "";
}