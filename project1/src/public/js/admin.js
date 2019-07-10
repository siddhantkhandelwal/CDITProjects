let levelIndex = '';
let examName = '';
function logout() {
    localStorage.removeItem('token');
    location.href = "index.html";
}

function initListeners() {
    $("#logoutBtn").click(() => logout());
    // $("#saveBtn").click(() => saveToDB());
}

async function getLevel() {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
        logout();
    }
    const settings = {
        async: true,
        method: "GET",
        url: `api/getLevel/`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };
    try {
        return await $.ajax(settings)
            .done((res) => {
                // console.log(res);
                levelIndex = res.levelIndex;
                document.getElementById('LevelExam').innerHTML = "Current Level of the Exam: " + res.levelIndex;
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

async function saveToDB() {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
        logout();
    }
    if (document.getElementById('Level1').checked) {
        levelIndex = document.getElementById('Level1').value;
    }
    else if (document.getElementById('Level2').checked) {
        levelIndex = document.getElementById('Level2').value;
    }
    requestdata = {}
    requestdata.levelIndex = levelIndex;
    requestdata.examName = document.getElementById("ExamName").value;
    const jsonData = JSON.stringify(requestdata);
    // console.log(jsonData);
    const settings = {
        // async: true,
        method: "POST",
        url: `api/setLevel/`,
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
            // toastr.success(res.message);
            levelIndex = res.levelIndex;
            examName = res.examName;
        });
        document.getElementById("ExamNameNav").value = examName;
        document.getElementById('LevelExam').innerHTML = "Current Level of the Exam: " + levelIndex;
    } catch (jqXHR) {
        toastr.error(jqXHR.toString());
    }
}

$(() => {
    initListeners();
    getLevel();
    getExamName();
});