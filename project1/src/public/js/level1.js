let biometricData = {};
let rollNo;
const Quality = 60;
const TimeOut = 10;
let fingerprintArray = null;
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
    if (!rollNo) {
        return alert('Please enter a rollno and click verify');
    }
    if (rollNo !== $("#rollNo").val()) {
        return alert("New roll-number entered must first be verified");
    }

    const res = CaptureFinger(Quality, TimeOut);
    if (res.httpStaus) {
        if (res.data.ErrorCode === "0") {
            assignToFinger(finger, res.data.BitmapData, res.data.IsoTemplate);
        } else {
            alert(`ERROR:  ${res.data.ErrorDescription} (${res.data.ErrorCode})`);
        }
    } else {
        alert(res.err);
    }

    return false;
}

async function saveToDB() {
    // console.log(biometricData);
    if (!rollNo) {
        return alert('Please enter a rollno and click verify');
    }
    if (rollNo !== $("#rollNo").val()) {
        return alert("New roll-number entered must first be verified");
    }
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
        alert("Fatal: No jwt token found. Login again");
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
            alert(res.message);
            clearImages();
            $("#biometric-details").addClass("collapse");
        });
    } catch (jqXHR) {
        console.log("ERROR");
        console.log(jqXHR);
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

function matchFingerLcl() {
    try {
        var res = MatchFinger(Quality, TimeOut, biometricData.thumb);

        if (res.httpStaus) {
            if (res.data.Status) {
                alert("Finger matched");
            }
            else {
                if (res.data.ErrorCode != "0") {
                    alert(res.data.ErrorDescription);
                }
                else {
                    alert("Finger not matched");
                }
            }
        }
        else {
            alert(res.err);
        }
    }
    catch (e) {
        alert(e);
    }
    return false;
}

async function matchFinger() {
    if (rollNo !== $("#rollNo").val() || fingerprintArray === null) {
        const res = await verifyRollno();
        if (!res) return;
        fingerprintArray = [
            _decryptBuffer(res.thumb.data),
            _decryptBuffer(res.fingerprintOne.data),
            _decryptBuffer(res.fingerprintTwo.data),
            _decryptBuffer(res.fingerprintThree.data),
            _decryptBuffer(res.fingerprintFour.data)
        ];
    }
    try {
        const fingerInput = CaptureFinger(Quality, TimeOut);
        if (fingerInput.httpStaus) {
            if (fingerInput.data.ErrorCode !== "0") {
                alert(`ERROR:  ${fingerInput.data.ErrorDescription} (${fingerInput.data.ErrorCode})`);
                return;
            }
        } else {
            alert(fingerInput.err);
            return;
        }
        for (let fingerprint of fingerprintArray) {
            const verify = VerifyFinger(fingerInput.data.IsoTemplate, fingerprint);
            if (verify.httpStaus) {
                if (verify.data.Status) {
                    alert("Finger matched");
                    return true;
                }
                else {
                    if (verify.data.ErrorCode != "0") {
                        alert(verify.data.ErrorDescription);
                    }
                }
            }
            else {
                alert(verify.err);
                return;
            }
        }
    } catch (err) {
        alert(err);
    }
    alert('Finger not matched');
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
        alert("Fatal: No jwt token found. Login again");
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
                $("#firstName").val(res.name);
                $("#dob").val(res.dateOfBirth);
                $("#phone").val(res.mobileNo);
            });
    } catch (jqXHR) {
        if (jqXHR.status === 403) {
            alert('Login expired. Please login again');
            setTimeout(() => {
                logout();
            }, 1000);
        } else {
            alert(jqXHR.responseJSON.error);
        }
        console.error(jqXHR.responseJSON.error);
    }
}

function encodeImageFileAsURL() {
    const filesSelected = $("#photoBtn")[0].files;
    if (filesSelected.length > 0) {
        const fileToLoad = filesSelected[0];

        const fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
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
});