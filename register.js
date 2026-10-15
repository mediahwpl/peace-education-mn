import { supabase } from "supabase.js";

/* =====================================
   1. SELECT ELEMENTS
===================================== */

const registerForm = document.getElementById("registerForm");

const formMessage = document.getElementById("formMessage");

const passwordInput = document.getElementById("password");

const confirmPasswordInput = document.getElementById("confirmPassword");

const birthDateInput = document.getElementById("birthDate");

const phoneInput = document.getElementById("phone");

const emailInput = document.getElementById("email");

const agreeTermsInput = document.getElementById("agreeTerms");

const termsError = document.getElementById("termsError");


/* =====================================
   2. SET MAXIMUM BIRTH DATE
===================================== */

// A person's birth date cannot be in the future.

const today = new Date();

const year = today.getFullYear();

const month = String(today.getMonth() + 1).padStart(2, "0");

const day = String(today.getDate()).padStart(2, "0");

birthDateInput.max = `${year}-${month}-${day}`;


/* =====================================
   3. SHOW / HIDE PASSWORD
===================================== */

const passwordToggleButtons = document.querySelectorAll(".toggle-password");

passwordToggleButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const targetId = button.dataset.target;

        const targetInput = document.getElementById(targetId);

        const icon = button.querySelector("i");

        if (targetInput.type === "password") {

            targetInput.type = "text";

            icon.classList.remove("fa-eye");

            icon.classList.add("fa-eye-slash");

            button.setAttribute(
                "aria-label",
                "Нууц үг нуух"
            );

        } else {

            targetInput.type = "password";

            icon.classList.remove("fa-eye-slash");

            icon.classList.add("fa-eye");

            button.setAttribute(
                "aria-label",
                "Нууц үг харуулах"
            );

        }

    });

});


/* =====================================
   4. ERROR HELPERS
===================================== */

function showError(input, message) {

    const formGroup = input.closest(".form-group");

    if (!formGroup) {
        return;
    }

    const errorElement = formGroup.querySelector(".error-message");

    input.setAttribute("aria-invalid", "true");

    if (errorElement) {

        errorElement.textContent = message;

    }

}


function clearError(input) {

    const formGroup = input.closest(".form-group");

    if (!formGroup) {
        return;
    }

    const errorElement = formGroup.querySelector(".error-message");

    input.removeAttribute("aria-invalid");

    if (errorElement) {

        errorElement.textContent = "";

    }

}


function clearAllErrors() {

    const inputs = registerForm.querySelectorAll("input, select");

    inputs.forEach(function (input) {

        input.removeAttribute("aria-invalid");

    });

    const errorMessages = registerForm.querySelectorAll(".error-message");

    errorMessages.forEach(function (element) {

        element.textContent = "";

    });

}


/* =====================================
   5. STATUS MESSAGE
===================================== */

function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message";

    if (type) {

        formMessage.classList.add(type);

    }

}


/* =====================================
   6. REQUIRED FIELD VALIDATION
===================================== */

function validateRequiredField(input, message) {

    if (!input.value.trim()) {

        showError(input, message);

        return false;

    }

    return true;

}


/* =====================================
   7. VALIDATE FORM
===================================== */

function validateForm() {

    let isValid = true;

    clearAllErrors();

    showMessage("", "");


    // Last name

    const lastName = document.getElementById("lastName");

    if (
        !validateRequiredField(
            lastName,
            "Овгоо бүтнээр нь оруулна уу."
        )
    ) {

        isValid = false;

    }


    // First name

    const firstName = document.getElementById("firstName");

    if (
        !validateRequiredField(
            firstName,
            "Нэрээ бүтнээр нь оруулна уу."
        )
    ) {

        isValid = false;

    }


    // Gender

    const gender = document.getElementById("gender");

    if (
        !validateRequiredField(
            gender,
            "Хүйсээ сонгоно уу."
        )
    ) {

        isValid = false;

    }


    // Phone

    const phone = phoneInput.value.trim();

    const phoneDigits = phone.replace(/\D/g, "");

    if (!phone) {

        showError(
            phoneInput,
            "Утасны дугаараа оруулна уу."
        );

        isValid = false;

    } else if (
        !/^[0-9+\s()-]+$/.test(phone) ||
        phoneDigits.length < 8 ||
        phoneDigits.length > 15
    ) {

        showError(
            phoneInput,
            "Утасны дугаараа зөв форматаар оруулна уу."
        );

        isValid = false;

    }


    // Birth date

    const birthDate = birthDateInput.value;

    if (!birthDate) {

        showError(
            birthDateInput,
            "Төрсөн огноогоо сонгоно уу."
        );

        isValid = false;

    } else {

        const selectedDate = new Date(`${birthDate}T00:00:00`);

        const currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);

        if (
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate > currentDate
        ) {

            showError(
                birthDateInput,
                "Төрсөн огноогоо зөв сонгоно уу."
            );

            isValid = false;

        }

    }


    // Email

    const email = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {

        showError(
            emailInput,
            "И-мэйл хаягаа оруулна уу."
        );

        isValid = false;

    } else if (!emailPattern.test(email)) {

        showError(
            emailInput,
            "И-мэйл хаягийн форматыг шалгана уу."
        );

        isValid = false;

    }


    // Occupation / status

    const status = document.getElementById("status");

    if (
        !validateRequiredField(
            status,
            "Одоогийн эрхэлж буй байдлаа сонгоно уу."
        )
    ) {

        isValid = false;

    }


    // Organization / school

    const organization = document.getElementById("organization");

    if (
        !validateRequiredField(
            organization,
            "Харьяа байгууллага эсвэл сургуулийн нэрийг оруулна уу."
        )
    ) {

        isValid = false;

    }


    // Position / course / grade

    const position = document.getElementById("position");

    if (
        !validateRequiredField(
            position,
            "Албан тушаал, курс эсвэл ангиа оруулна уу."
        )
    ) {

        isValid = false;

    }


    // Password

    const password = passwordInput.value;

    if (!password) {

        showError(
            passwordInput,
            "Нууц үгээ оруулна уу."
        );

        isValid = false;

    } else if (password.length < 8) {

        showError(
            passwordInput,
            "Нууц үг хамгийн багадаа 8 тэмдэгт байна."
        );

        isValid = false;

    }


    // Confirm password

    const confirmPassword = confirmPasswordInput.value;

    if (!confirmPassword) {

        showError(
            confirmPasswordInput,
            "Нууц үгээ давтан оруулна уу."
        );

        isValid = false;

    } else if (password !== confirmPassword) {

        showError(
            confirmPasswordInput,
            "Нууц үгнүүд хоорондоо таарахгүй байна."
        );

        isValid = false;

    }


    // Terms and conditions

    if (!agreeTermsInput.checked) {

        termsError.textContent =
            "Үйлчилгээний нөхцөлийг зөвшөөрнө үү.";

        agreeTermsInput.setAttribute(
            "aria-invalid",
            "true"
        );

        isValid = false;

    }


    return isValid;

}


/* =====================================
   8. CLEAR ERRORS WHEN TYPING
===================================== */

const formInputs = registerForm.querySelectorAll("input, select");

formInputs.forEach(function (input) {

    input.addEventListener("input", function () {

        clearError(input);

        showMessage("", "");

    });

    input.addEventListener("change", function () {

        clearError(input);

        showMessage("", "");

    });

});


/* =====================================
   9. CHECK PASSWORD MATCH
===================================== */

function validatePasswordMatch() {

    if (
        confirmPasswordInput.value &&
        passwordInput.value !== confirmPasswordInput.value
    ) {

        showError(
            confirmPasswordInput,
            "Нууц үгнүүд хоорондоо таарахгүй байна."
        );

        return false;

    }

    clearError(confirmPasswordInput);

    return true;

}


passwordInput.addEventListener("input", function () {

    if (confirmPasswordInput.value) {

        validatePasswordMatch();

    }

});


confirmPasswordInput.addEventListener("input", function () {

    validatePasswordMatch();

});


/* =====================================
   10. TERMS CHECKBOX
===================================== */

agreeTermsInput.addEventListener("change", function () {

    termsError.textContent = "";

    agreeTermsInput.removeAttribute("aria-invalid");

    showMessage("", "");

});


/* =====================================
   11. SUBMIT FORM
===================================== */

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateForm()) {
        showMessage(
            "Мэдээллээ шалгаж, шаардлагатай талбаруудыг бөглөнө үү.",
            "error"
        );

        const firstInvalidInput = registerForm.querySelector(
            '[aria-invalid="true"]'
        );

        if (firstInvalidInput) {
            firstInvalidInput.focus();
        }

        return;
    }

    const submitButton = registerForm.querySelector(
        'button[type="submit"]'
    );

    const originalButtonText = submitButton
        ? submitButton.textContent
        : "";

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Бүртгэж байна...";
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const surname =
            document.getElementById("lastName").value.trim();

        const firstName =
            document.getElementById("firstName").value.trim();

        const gender =
            document.getElementById("gender").value;

        const phone = phoneInput.value.trim();

        const birthDate = birthDateInput.value;

        const occupation =
            document.getElementById("status").value;

        const organization =
            document.getElementById("organization").value.trim();

        const position =
            document.getElementById("position").value.trim();

        // Supabase Auth-д хэрэглэгч бүртгэх
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,

            options: {
                emailRedirectTo:
                    window.location.href.replace(
                        /register\.html(?:\?.*)?$/,
                        "login.html"
                    ),

                data: {
                    surname: surname,
                    first_name: firstName,
                    gender: gender,
                    phone: phone,
                    birth_date: birthDate,
                    occupation: occupation,
                    organization: organization,
                    position: position
                }
            }
        });

        if (error) {
            throw error;
        }

        if (!data.user) {
            throw new Error(
                "Хэрэглэгчийн бүртгэл үүссэн эсэхийг шалгаж чадсангүй."
            );
        }

        showMessage(
            "Бүртгэл амжилттай үүслээ. И-мэйл хаягаа шалгаж, баталгаажуулна уу.",
            "success"
        );

        registerForm.reset();

        birthDateInput.max = [
            new Date().getFullYear(),
            String(new Date().getMonth() + 1).padStart(2, "0"),
            String(new Date().getDate()).padStart(2, "0")
        ].join("-");

    } catch (error) {
        console.error("Registration error:", error);

        let message =
            "Бүртгэл үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.";

        if (error.message?.includes("already registered")) {
            message =
                "Энэ и-мэйл хаяг бүртгэлтэй байна. Нэвтрэх хэсгийг ашиглана уу.";
        } else if (error.message?.includes("Password")) {
            message =
                "Нууц үгийн шаардлагыг шалгана уу.";
        } else if (error.message?.includes("rate limit")) {
            message =
                "Хэт олон хүсэлт илгээсэн байна. Түр хүлээгээд дахин оролдоно уу.";
        }

        showMessage(message, "error");

    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }
});