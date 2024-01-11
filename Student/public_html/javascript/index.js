var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDBName = "SCHOOL-DB";
var studentRelationName = "STUDENT-TABLE";
var connToken = "90931835|-31949300793674728|90962983";

$("#studentid").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getStudentIdAsJsonObj() {
    var studentid = $("#studentid").val();
    var jsonStr = {
        id: studentid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#studentname").val(data.studentname);
    $("#std").val(data.std);
    $("#dob").val(data.dob);
    $("#address").val(data.address);
    $("#enroll").val(data.enroll);
}

function resetForm() {
    $("#studentid").val("");
    $("#studentname").val("");
    $("#std").val("");
    $("#dob").val("");
    $("#address").val("");
    $("#enroll").val("");
    $("#studentid").prop('disabled', false);
    $("#save").prop('disabled', true);
    $("#change").prop('disabled', true);
    $("#reset").prop('disabled', true);
    $("studentid").focus();
}

function validateData() {
    var studentid, studentname, std, dob, address, enroll;
    studentid = $("#studentid").val();
    studentname = $("#studentname").val();
    std = $("#std").val();
    dob = $("#dob").val();
    address = $("#address").val();
    enroll = $("#enroll").val();
    
    if (studentid === "") {
        alert("Student ID Required Value");
        $("#studentid").focus();
        return "";
    }
   
    if (studentname === "") {
        alert("Student Name is Required Value");
        $("#studentname").focus();
        return "";
    }
    
    if (std === "") {
        alert("Class is Required ");
        $("#std").focus();
        return "";
    }
    if (dob === "") {
        alert("dob is Required ");
        $("#dob").focus();
        return "";
    }
    if (address === "") {
        alert("Address is Required ");
        $("#address").focus();
        return "";
    }
    if (enroll === "") {
        alert("Enrollment No is missing");
        $("#enroll").focus();
        return "";
    }
    var jsonStrObj = {
        id: studentid,
        studentname: studentname,
        std: std,
        dob: dob,
        address: address,
        enroll:enroll
    };
    return JSON.stringify(jsonStrObj);
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#studentid').focus();
}

function changeData() {
    $("#change").prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#studentid").focus();
}

function getStudent() {
    var studentIdJsonObj = getStudentIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, studentIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("studentname").focus();
    } else if (resJsonObj.status === 200) {
        $("#studentid").prop('disabled', true);
        fillData(resJsonObj);

        $("#change").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("studentname").focus();
    }

}



