import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-da8cb-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")


const endorsementEL = document.getElementById("endorsement-el") // endorsement form 
const fromEl = document.getElementById("from-el") // for the From element
const toEl = document.getElementById("to-el") // for the To element 

const endorsementForm = document.getElementById("endorsement-form") // for the form 
const endorsementList = document.getElementById("endorsement-list") // list of endorsements listed 

var endoresementObject = new Object();

endorsementForm.addEventListener("submit", function() {
    event.preventDefault();
    endoresementObject.endorsement = endorsementEL.value
    endoresementObject.from = fromEl.value
    endoresementObject.to = toEl.value
    //let inputValue = inputFieldEl.value
    push(endorsementListInDB, endoresementObject)
    clearEndorsement()
    console.log("submitted form")
})

function clearEndorsement() {
    endorsementEL.innerHTML = "" 
}

function clearAllFormFields() {
    endorsementForm.value = ""
    toEl.value = ""
    fromEl.value = ""
}


onValue(endorsementListInDB, function (snapshot) {
    if (snapshot.exists()) {

        let itemsArray = Object.entries(snapshot.val())
        let latestEndorsements = itemsArray.reverse()
        clearEndorsement()
        for (let i = 0; i < latestEndorsements.length; i++) {
            let currentItem = latestEndorsements[i]
            appendEndorsements(currentItem)
        }
    } else {
        endorsementEL.innerHTML = `<p style='padding: 10px;line-height:20px;'>There are no endoresements yet. Please add few...</p>`
    }
})




function appendEndorsements(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("div")
    newEl.className = "singleEndorsement"
    newEl.innerHTML = `<b>To: ${itemValue.to}</b><br><br>${itemValue.endorsement}<br><br><b>From: ${itemValue.from}</b>`

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}`)

        remove(exactLocationOfItemInDB)
    })

    endorsementList.append(newEl)
}

