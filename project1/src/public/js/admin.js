function logout() {
    localStorage.removeItem('token');
    location.href = "index.html";
}

function initListeners() {
    $("#logoutBtn").click(() => logout());
}

$(() => {
    initListeners();
});