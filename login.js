import { supabase } from "./supabase.js";

console.log("LOGIN.JS АЖИЛЛАЖ БАЙНА");

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // 1. HTML элементүүдийг сонгох
    // ========================================

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginMessage = document.getElementById("loginMessage");
    const loginButton = loginForm.querySelector(
        'button[type="submit"]'
    );


    // ========================================
    // 2. Мэдээлэл харуулах функц
    // ========================================

    function showMessage(message, type = "error") {

        loginMessage.textContent = message;

        loginMessage.className =
            "form-message is-visible";

        if (type === "success") {
            loginMessage.classList.add("is-success");
        } else {
            loginMessage.classList.add("is-error");
        }
    }


    // ========================================
    // 3. Нууц үг харуулах / нуух
    // ========================================

    if (passwordInput && togglePassword) {

        togglePassword.addEventListener("click", function () {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword ? "text" : "password";

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


    // ========================================
    // 4. Нэвтрэх форм
    // ========================================

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Хэрэглэгчийн оруулсан мэдээлэл
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Өмнөх мэдэгдлийг арилгах
        loginMessage.textContent = "";
        loginMessage.className = "form-message";

        // Хоосон эсэхийг шалгах
        if (!email || !password) {

            showMessage(
                "И-мэйл болон нууц үгээ оруулна уу."
            );

            return;
        }

        // Товчийг түр идэвхгүй болгох
        loginButton.disabled = true;
        loginButton.querySelector("span").textContent =
            "Нэвтэрч байна...";

        try {

            // Supabase Authentication
            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            // Supabase алдаа буцаасан бол
            if (error) {
                throw error;
            }

            // Хэрэглэгчийн мэдээлэл шалгах
            if (!data.user) {

                throw new Error(
                    "Хэрэглэгчийн мэдээлэл олдсонгүй."
                );
            }

            // Амжилттай нэвтэрсэн
            showMessage(
                "Амжилттай нэвтэрлээ. Түр хүлээнэ үү...",
                "success"
            );

            // Dashboard руу шилжих
            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Login error:", error);

            // Алдааны мэдээлэл
            if (
                error.message?.toLowerCase().includes(
                    "invalid login credentials"
                )
            ) {

                showMessage(
                    "И-мэйл эсвэл нууц үг буруу байна."
                );

            } else if (
                error.message?.toLowerCase().includes(
                    "email not confirmed"
                )
            ) {

                showMessage(
                    "И-мэйл хаягаа баталгаажуулна уу."
                );

            } else {

                showMessage(
                    "Нэвтрэх үед алдаа гарлаа. " +
                    "Мэдээллээ шалгаад дахин оролдоно уу."
                );

            }

        } finally {

            // Нэвтрэх товчийг буцааж идэвхжүүлэх
            loginButton.disabled = false;

            loginButton.querySelector("span").textContent =
                "Нэвтрэх";

        }

    });

});