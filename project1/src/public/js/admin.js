let levelIndex = '';
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

async function saveToDB() {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
        toastr.error("Fatal: No jwt token found. Login again");
        setTimeout(() => {
            logout();
        }, 1000);
        return await false;
    }
    const jsonData = JSON.stringify(levelIndex);
    const settings = {
        async: true,
        // method: "POST",
        url: "api/setLevel/",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        processData: false,
        data: jsonData
    }
    // $.post(settings)
    //     .done(function (response) {
    //         // localStorage.setItem("token", response.token);
    //         levelIndex = res.levelIndex
    //     })
    //     .fail((jqXHR, textStatus, errorThrown) => {
    //         console.log(jqXHR.responseJSON.error);
    //     });
    try {
        return await $.ajax(settings).done(res => {
            // toastr.success(res.message);
            levelIndex = res.levelIndex;
        });
    } catch (jqXHR) {
        toastr.error(jqXHR.toString());
    }
    getLevel();
}

$(() => {
    initListeners();
    getLevel();
});