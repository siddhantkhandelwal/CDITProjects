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
function login() {
    var userId = $("#inputId").val();
    var pass = $("#inputPassword").val();
    var captcha = $("#g-recaptcha-response").val();
    if (userId == "" || pass == "") {
        toastr.warning("Please fill all details");
        return false;
    }
    if (captcha == "") {
        toastr.warning("Please verify captcha");
        return false;
    }
    let userJSON = { username: userId, password: pass, captcha: captcha };
    const userString = JSON.stringify(userJSON);
    const settings = {
        async: true,
        url: "api/login",
        headers: {
            "Content-Type": "application/json"
        },
        processData: false,
        data: userString
    };
    $.post(settings)
        .done(function (response) {
            localStorage.setItem("token", response.token);
            if (response.permission_level == 3) {
                location.href = "admin.html";
            }
            else {
                location.href = "level1.html";
            }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            toastr.error(jqXHR.responseJSON.error);
        });
}
$(() => {
    $("#signin-form").submit(e => {
        e.preventDefault();
        login();
    });
});