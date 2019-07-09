let biometricData = {};
let rollNo;
const Quality = 60;
const TimeOut = 10;
let fingerprintArray = null;

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

async function getExamName() {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
        logout();
    }
    const settings = {
        async: true,
        method: "GET",
        url: `api/getExamName/`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };
    try {
        return await $.ajax(settings)
            .done((res) => {
                // console.log(res);
                examName = res.examName;
                document.getElementById('ExamNameNav').innerHTML = res.examName;
            });
    } catch (jqXHR) {
        if (jqXHR.status === 403) {
            toastr.error('Login expired. Please login again');
            setTimeout(() => {
                logout();
            }, 1000);
        } else {
            toastr.error(jqXHR.responseJSON.error);
        }
    }
}

function assignToFinger(finger, imgSrc, isoTemplate) {
    switch (finger) {
        case "thumb":
            $('#thumb-img').attr("src", `data:image/bmp;base64,${imgSrc}`);
            biometricData.thumb = isoTemplate;
            break;

        case "index":
            $('#index-img').attr("src", `data:image/bmp;base64,${imgSrc}`);
            biometricData.fingerprintOne = isoTemplate;
            break;
        case "middle":
            $('#middle-img').attr("src", `data:image/bmp;base64,${imgSrc}`);
            biometricData.fingerprintTwo = isoTemplate;
            break;
        case "ring":
            $('#ring-img').attr("src", `data:image/bmp;base64,${imgSrc}`);
            biometricData.fingerprintThree = isoTemplate;
            break;
        case "little":
            $('#little-img').attr("src", `data:image/bmp;base64,${imgSrc}`);
            biometricData.fingerprintFour = isoTemplate;
            break;

        default:
            console.error("Not a valid finger");
            break;
    }
}

function clearImages() {
    $('#thumb-img').removeAttr('src');
    $('#index-img').removeAttr('src');
    $('#middle-img').removeAttr('src');
    $('#ring-img').removeAttr('src');
    $('#little-img').removeAttr('src');
    $("#face-img").removeAttr('src');
}

function getFingerTemplate(finger) {
    if (!rollNo || rollNo === '') {
        return toastr.info('Please enter a rollno and click verify');
    }
    if (rollNo !== $("#rollNo").val()) {
        return toastr.warning("New roll-number entered must first be verified");
    }

    const res = CaptureFinger(Quality, TimeOut);
    if (res.httpStaus) {
        if (res.data.ErrorCode === "0") {
            assignToFinger(finger, res.data.BitmapData, res.data.IsoTemplate);
        } else {
            toastr.error(`ERROR:  ${res.data.ErrorDescription} (${res.data.ErrorCode})`);
        }
    } else {
        toastr.error(res.err);
    }

    return false;
}

async function saveToDB() {
    if (!rollNo || rollNo === '') {
        return toastr.info('Please enter a rollno and click verify');
    }
    if (rollNo !== $("#rollNo").val()) {
        return toastr.warning("New roll-number entered must first be verified");
    }
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
        toastr.error("Fatal: No jwt token found. Login again");
        setTimeout(() => {
            logout();
        }, 1000);
        return await false;
    }
    const jsonData = JSON.stringify(biometricData);
    const settings = {
        method: "POST",
        url: `api/candidates/${rollNo}/update-biometric`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        processData: false,
        data: jsonData
    }

    try {
        return await $.ajax(settings).done(res => {
            toastr.success(res.message);
            clearImages();
            $("#biometric-details").addClass("collapse");
        });
    } catch (jqXHR) {
        toastr.error(jqXHR.responseJSON.error);
    }
}

async function updateBiometric() {

    const res = await verifyRollno();
    if (res) {
        $("#biometric-details").removeClass("collapse");
    } else {
        $("#biometric-details").addClass("collapse");
    }
}

async function matchFinger() {
    if (rollNo !== $("#rollNo").val() || fingerprintArray === null) {
        const res = await verifyRollno();
        if (!res) return;
        try {
            fingerprintArray = [
                _decryptBuffer(res.thumb.data),
                _decryptBuffer(res.fingerprintOne.data),
                _decryptBuffer(res.fingerprintTwo.data),
                _decryptBuffer(res.fingerprintThree.data),
                _decryptBuffer(res.fingerprintFour.data)
            ];
            //ToDo: A toaster after clicking on the Verify Cand button 
            // await toastr.success('Place your finger on the scanner.');
            // console.log("TEST");
        } catch (err) {
            if (err instanceof TypeError) {
                toastr.error("Update biometric details first", "Biometric Data Not Found");
                return;
            }
            console.error(err);
            return;
        }
    }
    try {

        const fingerInput = CaptureFinger(Quality, TimeOut);
        if (fingerInput.httpStaus) {
            if (fingerInput.data.ErrorCode !== "0") {
                toastr.error(`ERROR:  ${fingerInput.data.ErrorDescription} (${fingerInput.data.ErrorCode})`);
                return;
            }
        } else {
            toastr.error(fingerInput.err);
            return;
        }
        for (let fingerprint of fingerprintArray) {
            const verify = VerifyFinger(fingerInput.data.IsoTemplate, fingerprint);
            if (verify.httpStaus) {
                if (verify.data.Status) {
                    toastr.success("Fingerprint matched", 'Verification Server');
                    return true;
                }
                else {
                    if (verify.data.ErrorCode != "0") {
                        toastr.error(verify.data.ErrorDescription);
                    }
                }
            }
            else {
                toastr.error(verify.err);
                return;
            }
        }
    } catch (err) {
        toastr.error(err);
    }
    toastr.warning('Fingerprint not verified', 'Verification server');
}

function logout() {
    localStorage.removeItem('token');
    location.href = "index.html";
}

async function verifyRollno() {
    clearImages();
    biometricData = {};
    rollNo = $("#rollNo").val();

    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
        toastr.error("Fatal: No jwt token found. Login again");
        setTimeout(() => {
            logout();
        }, 1000);
        return await false;
    }
    const settings = {
        async: true,
        method: "GET",
        url: `api/candidates/${rollNo}`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    try {
        return await $.ajax(settings)
            .done((res) => {
                // console.log(res);
                $("#fullName").val(res.name);
                $("#gender").val(res.gender);
                $("#dob").val(res.dateOfBirth);
                $("#candidate-img").attr('src', res.photoPtr);
                $("#email").val(res.email);
                $("#phone").val(res.mobileNo);
                $("#currAddress").text(res.address);
                $("#perAddress").text(res.address);
            });
    } catch (jqXHR) {
        if (jqXHR.status === 403) {
            toastr.error('Login expired. Please login again');
            setTimeout(() => {
                logout();
            }, 1000);
        } else {
            toastr.error(jqXHR.responseJSON.error);
        }
    }
}

function encodeImageFileAsURL() {
    const filesSelected = $("#photoBtn")[0].files;
    if (filesSelected.length > 0) {
        const fileToLoad = filesSelected[0];

        const fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
            console.log(fileLoadedEvent);
            const srcData = fileLoadedEvent.target.result; // <--- data: base64
            $("#face-img").attr('src', srcData);
            biometricData.newPhotoPtr = srcData;
        }
        fileReader.readAsDataURL(fileToLoad);
    }
}

function initListeners() {
    $("#checkRollNo").click(() => updateBiometric());
    $("#verifyCandidateBtn").click(() => matchFinger());

    $("#photoBtn").change(() => encodeImageFileAsURL());

    $("#thumbButton").click(() => getFingerTemplate("thumb"));
    $("#indexButton").click(() => getFingerTemplate("index"));
    $("#middleButton").click(() => getFingerTemplate("middle"));
    $("#ringButton").click(() => getFingerTemplate("ring"));
    $("#littleButton").click(() => getFingerTemplate("little"));

    $("#saveBtn").click(() => saveToDB());

    $("#logoutBtn").click(() => logout());
}

$(() => {
    clearImages();
    initListeners();
    getExamName();
});