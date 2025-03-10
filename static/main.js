const submitButton = document.getElementById("openModal");
const sendDataToServerButton = document.getElementById("submitData");
const closeConfirmationModal = document.getElementById("closeButton");

const initials = document.getElementById("initials");
const teamNumber = document.getElementById("teamNumber");
const matchNumber = document.getElementById("matchNumber");
const secretCode = document.getElementById("secretCode");

const autoL1 = document.getElementById("autoL1");
const autoL2 = document.getElementById("autoL2");
const autoL3 = document.getElementById("autoL3");
const autoL4 = document.getElementById("autoL4");

const autoL1Plus = document.getElementById("autoL1ButtonPlus");
const autoL2Plus = document.getElementById("autoL2ButtonPlus");
const autoL3Plus = document.getElementById("autoL3ButtonPlus");
const autoL4Plus = document.getElementById("autoL4ButtonPlus");
const autoL1Minus = document.getElementById("autoL1ButtonMinus");
const autoL2Minus = document.getElementById("autoL2ButtonMinus");
const autoL3Minus = document.getElementById("autoL3ButtonMinus");
const autoL4Minus = document.getElementById("autoL4ButtonMinus");

const autoProcessor = document.getElementById("autoProcessor");
const autoProcessorPlus = document.getElementById("autoProcessorPlus");
const autoProcessorMinus = document.getElementById("autoProcessorMinus");

const autoBarge = document.getElementById("autoBarge");
const autoBargePlus = document.getElementById("autoBargePlus");
const autoBargeMinus = document.getElementById("autoBargeMinus");

const teleL1 = document.getElementById("teleL1");
const teleL2 = document.getElementById("teleL2");
const teleL3 = document.getElementById("teleL3");
const teleL4 = document.getElementById("teleL4");

const teleL1Plus = document.getElementById("teleL1ButtonPlus");
const teleL2Plus = document.getElementById("teleL2ButtonPlus");
const teleL3Plus = document.getElementById("teleL3ButtonPlus");
const teleL4Plus = document.getElementById("teleL4ButtonPlus");
const teleL1Minus = document.getElementById("teleL1ButtonMinus");
const teleL2Minus = document.getElementById("teleL2ButtonMinus");
const teleL3Minus = document.getElementById("teleL3ButtonMinus");
const teleL4Minus = document.getElementById("teleL4ButtonMinus");

const teleProcessor = document.getElementById("teleProcessor");
const teleProcessorPlus = document.getElementById("teleProcessorPlus");
const teleProcessorMinus = document.getElementById("teleProcessorMinus");

const teleBarge = document.getElementById("teleBarge");
const teleBargePlus = document.getElementById("teleBargePlus");
const teleBargeMinus = document.getElementById("teleBargeMinus");

const deepClimb = document.getElementById("deepClimb");
const shallowClimb = document.getElementById("shallowClimb");
const park = document.getElementById("park");
const deadRobot = document.getElementById("deadRobot");

const allBoolFields = document.getElementsByClassName("switchInput");

const confirmationModal = document.getElementById("confirmationModalLol");

const errorTextDisplay = document.getElementById("errtext");

const clearableInputs = document.getElementsByClassName("clearableInput");

const dataSendSuccessfulText = document.getElementById("dataSendSuccessfulText");

const url = "http://127.0.0.1:5000/send";
const getUrl = "http://127.0.0.1:5000/getData";

let debounce = false;

function getBoxData() {
    return initials.value;
}

function sendData(json) {
    let req = new XMLHttpRequest();
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(json);

    req.onload = () => {
        debounce = false;
        if(req.response == "success") {
            onSuccessfulDataSubmission();
        } else {
            throwVisibleError("Server indicated data is invalid. Check scouting code.")
        }
    }
}

function getScoutingData() {
    let req = new XMLHttpRequest();
    req.open("GET", getUrl);
    req.send();

    req.onload = () => {
        console.log(req.response);
    }
}

function sanitizeNumberEntryData(rawData) {
    let num = Number(rawData);
    if(isNaN(rawData)) {
        return 0;
    }
    return num;
}

function getJSON() {
    return JSON.stringify({
        scouterInitials: initials.value,
        scoutedTeamNumber: teamNumber.value,
        scoutedMatchNumber: matchNumber.value,

        autoL1Scores: sanitizeNumberEntryData(autoL1.value),
        autoL2Scores: sanitizeNumberEntryData(autoL2.value),
        autoL3Scores: sanitizeNumberEntryData(autoL3.value),
        autoL4Scores: sanitizeNumberEntryData(autoL4.value),
        autoBargeScores: sanitizeNumberEntryData(autoBarge.value),
        autoProcessorScores: sanitizeNumberEntryData(autoProcessor.value),

        teleL1Scores: sanitizeNumberEntryData(teleL1.value),
        teleL2Scores: sanitizeNumberEntryData(teleL2.value),
        teleL3Scores: sanitizeNumberEntryData(teleL3.value),
        teleL4Scores: sanitizeNumberEntryData(teleL4.value),
        teleBargeScores: sanitizeNumberEntryData(teleBarge.value),
        teleProcessorScores: sanitizeNumberEntryData(teleProcessor.value),

        didDeepClimb: deepClimb.checked,
        didShallowClimb: shallowClimb.checked,
        didPark: park.checked,
        didRobotDie: deadRobot.checked,

        secretScoutingCode: secretCode.value
    })
}

function checkDataValidity() {
    return initials.value != "" && teamNumber.value != "" && matchNumber.value != "";
}

function showConfirmationModal() {
    hideErrorText()
    confirmationModal.style.display = "block";
}

function hideConfirmationModal() {
    confirmationModal.style.display = "none";
}

function throwVisibleError(errtext) {
    errorTextDisplay.innerHTML = errtext;
    errorTextDisplay.style.display = "block";
}

function hideErrorText() {
    errorTextDisplay.style.display = "none";
}

function indicateSuccess() {
    dataSendSuccessfulText.style.display = "block";
    setTimeout(() => dataSendSuccessfulText.style.display = "none", 5000);
}

function onSuccessfulDataSubmission() {
    hideConfirmationModal()
    clearNonEssentialElements()
    indicateSuccess();
}

function onSubmitButtonPress() {
    if(debounce) {
        return;
    }

    if(checkDataValidity()) {
        console.log("Sending data!")
        sendData(getJSON());
        debounce = true;
        return;
    }
    throwVisibleError("Data invalid. Double check input fields and try again.")
}

function offset(uiElement, offset) {
    let uiValue = Number(uiElement.value);
    uiValue += offset;
    uiValue = (uiValue >= 0) ? uiValue: 0;
    uiElement.value = uiValue;
}

function setupPlusMinusNumEntry(uiElement, plus, minus) {
    plus.onclick = (() => offset(uiElement, 1));
    minus.onclick = (() => offset(uiElement, -1));
}

function setupBoxCheck(checkBox) {
    checkBox.addEventListener("change", function() {
        if(checkBox.checked == false) {
            return;
        }
        for(let i = 0; i < allBoolFields.length; i++) {
            allBoolFields[i].checked = false;
        }
        checkBox.checked = true;
    });
}

function clearNonEssentialElements() {
    for(let i = 0; i < clearableInputs.length; i++) {
        clearableInputs[i].value = 0;
    }

    for(let i = 0; i < allBoolFields.length; i++) {
        allBoolFields[i].checked = false;
    }

    matchNumber.value = "";
    teamNumber.value = "";
}

setupPlusMinusNumEntry(autoL1, autoL1Plus, autoL1Minus);
setupPlusMinusNumEntry(autoL2, autoL2Plus, autoL2Minus);
setupPlusMinusNumEntry(autoL3, autoL3Plus, autoL3Minus);
setupPlusMinusNumEntry(autoL4, autoL4Plus, autoL4Minus);

setupPlusMinusNumEntry(autoBarge, autoBargePlus, autoBargeMinus);
setupPlusMinusNumEntry(autoProcessor, autoProcessorPlus, autoProcessorMinus);

setupPlusMinusNumEntry(teleL1, teleL1Plus, teleL1Minus);
setupPlusMinusNumEntry(teleL2, teleL2Plus, teleL2Minus);
setupPlusMinusNumEntry(teleL3, teleL3Plus, teleL3Minus);
setupPlusMinusNumEntry(teleL4, teleL4Plus, teleL4Minus);

setupPlusMinusNumEntry(teleBarge, teleBargePlus, teleBargeMinus);
setupPlusMinusNumEntry(teleProcessor, teleProcessorPlus, teleProcessorMinus);

setupBoxCheck(deepClimb);
setupBoxCheck(shallowClimb);
setupBoxCheck(park);
setupBoxCheck(deadRobot);

submitButton.onclick = showConfirmationModal;
sendDataToServerButton.onclick = onSubmitButtonPress;
closeConfirmationModal.onclick = hideConfirmationModal;