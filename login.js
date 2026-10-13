document.addEventListener("DOMContentLoaded", function () {
    // Нууц үг харуулах / нуух
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {

        togglePassword.addEventListener("click", function () {

            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            togglePassword.innerHTML = isPassword
                ? '<i class="fa-regular fa-eye-slash"></i>'
                : '<i class="fa-regular fa-eye"></i>';

            togglePassword.setAttribute(
                "aria-label",
                isPassword
                    ? "Нууц үг нуух"
                    : "Нууц үг харуулах"
            );

            togglePassword.setAttribute(
                "aria-pressed",
                String(isPassword)
            );

        });

    }


    // Нэвтрэх формын түр шалгалт
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (loginForm && loginMessage) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            loginMessage.textContent =
                "Нэвтрэх систем хараахан холбогдоогүй байна. Дараагийн алхамд Supabase-тай холбоно.";

            loginMessage.className =
                "form-message is-visible";

        });

    }

});
