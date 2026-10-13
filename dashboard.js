/* ========================================
   HWPL PEACE EDUCATION - DASHBOARD JS
======================================== */

"use strict";


// ========================================
// 1. COURSE DATA
// ========================================

// Эдгээр нэрсийг албан ёсны 12 хичээлийн нэрээр солино.

const lessons = [
    {
        id: 1,
        title: "Энх тайвны боловсролын үндэс",
        description: "Энх тайван, боловсрол болон тэдгээрийн нийгэмд гүйцэтгэх үүргийг ойлгох."
    },
    {
        id: 2,
        title: "Энх тайвны үнэ цэнэ",
        description: "Энх тайвны үнэ цэнэ болон түүний ач холбогдлыг судлах."
    },
    {
        id: 3,
        title: "Хүний эрх ба энх тайван",
        description: "Хүний эрх, харилцан хүндлэл, энх тайвны харилцааг ойлгох."
    },
    {
        id: 4,
        title: "Харилцан ойлголцол",
        description: "Бусдыг сонсох, ойлгох, харилцан хүндэтгэх чадварыг хөгжүүлэх."
    },
    {
        id: 5,
        title: "Зөрчилдөөнийг шийдвэрлэх нь",
        description: "Зөрчлийг тайван замаар шийдвэрлэх зарчмуудтай танилцах."
    },
    {
        id: 6,
        title: "Энх тайван ба нийгэм",
        description: "Нийгмийн оролцоо, хамтын ажиллагааны ач холбогдлыг судлах."
    },
    {
        id: 7,
        title: "Энх тайвны соёл",
        description: "Өдөр тутмын амьдралд энх тайвны соёлыг төлөвшүүлэх."
    },
    {
        id: 8,
        title: "Хариуцлагатай иргэн",
        description: "Иргэний оролцоо, хариуцлагын талаар суралцах."
    },
    {
        id: 9,
        title: "Хамтын ажиллагаа",
        description: "Нийтлэг зорилгын төлөө хамтран ажиллахын ач холбогдлыг ойлгох."
    },
    {
        id: 10,
        title: "Энх тайвны төлөөх үйл ажиллагаа",
        description: "Энх тайвныг дэмжих үйл ажиллагааны боломжуудыг судлах."
    },
    {
        id: 11,
        title: "Энх тайвны боловсролыг түгээх нь",
        description: "Сурсан мэдлэгээ бусадтай хуваалцах арга замыг судлах."
    },
    {
        id: 12,
        title: "Энх тайвны боловсролын дүгнэлт",
        description: "Сурсан мэдлэгээ нэгтгэж, сургалтын эцсийн даалгавраа гүйцэтгэх."
    }
];


// ========================================
// 2. STORAGE
// ========================================

// DEMO MODE:
// Одоогоор жишээ мэдээллийг localStorage-д хадгална.
// Бодит системд Supabase ашиглах шаардлагатай.

const STORAGE_KEY = "hwpl_dashboard_demo_v1";

let activeLessonId = null;

let toastTimeout = null;

let currentFilter = "all";

let isDemoMode = true;


function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw) {
            const saved = JSON.parse(raw);

            if (
                saved &&
                saved.lessons &&
                typeof saved.lessons === "object"
            ) {
                return saved;
            }
        }
    } catch (error) {
        console.error("Мэдээлэл уншихад алдаа гарлаа:", error);
    }

    return {
        lessons: {},
        user: {
            fullName: "Суралцагч",
            email: "",
            userType: "individual",
            organization: ""
        }
    };
}


let state = loadState();


function saveState() {
    if (!isDemoMode) {
        return;
    }

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );
    } catch (error) {
        console.error("Мэдээлэл хадгалахад алдаа гарлаа:", error);

        showToast(
            "Мэдээллийг браузерт хадгалж чадсангүй."
        );
    }
}


function getLessonState(lessonId) {
    if (!state.lessons[lessonId]) {
        state.lessons[lessonId] = {
            videoProgress: 0,
            videoCompleted: false,
            assignmentSubmitted: false,
            assignmentName: "",
            assignmentSize: 0
        };
    }

    return state.lessons[lessonId];
}


// ========================================
// 3. USER INFORMATION
// ========================================

// Бүртгэлийн мэдээллийг түр дамжуулах шаардлагатай бол
// өмнөх register/login кодтой холбож болно.
// Бодит системд хэрэглэгчийг Supabase-аас уншина.

function getUserInitials(fullName) {
    return String(fullName || "С")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part.charAt(0))
        .join("")
        .toUpperCase() || "С";
}


function renderUserInfo() {
    const user = state.user || {};

    const fullName =
        user.fullName ||
        "Суралцагч";

    const initials = getUserInitials(fullName);

    const userType =
        user.userType === "organization"
            ? "Байгууллагын суралцагч"
            : "Хувь суралцагч";

    document.getElementById("userName").textContent =
        fullName;

    document.getElementById("welcomeName").textContent =
        fullName.split(/\s+/)[0];

    document.getElementById("userAvatar").textContent =
        initials;

    document.getElementById("profileAvatar").textContent =
        initials;

    document.getElementById("userType").textContent =
        userType;

    document.getElementById("profileName").textContent =
        fullName;

    document.getElementById("profileEmail").textContent =
        user.email || "Имэйл бүртгэгдээгүй";

    document.getElementById("profileType").textContent =
        userType;

    const organizationRow =
        document.getElementById("organizationProfileRow");

    if (user.userType === "organization") {
        organizationRow.hidden = false;

        document.getElementById("profileOrganization").textContent =
            user.organization || "Мэдээлэл оруулаагүй";
    } else {
        organizationRow.hidden = true;
    }
}


// ========================================
// 4. LESSON STATUS
// ========================================

// Хичээлийн дараалал:
// 1. Видео 100% үзсэн байна.
// 2. Даалгавраа илгээсэн байна.
// 3. Дараагийн хичээл нээгдэнэ.

function isLessonCompleted(lessonId) {
    const lesson = getLessonState(lessonId);

    return (
        lesson.videoCompleted === true &&
        lesson.videoProgress >= 100 &&
        lesson.assignmentSubmitted === true
    );
}


function isLessonUnlocked(lessonId) {
    if (lessonId === 1) {
        return true;
    }

    return isLessonCompleted(lessonId - 1);
}


function getLessonStatus(lessonId) {
    const lesson = getLessonState(lessonId);

    if (isLessonCompleted(lessonId)) {
        return "completed";
    }

    if (!isLessonUnlocked(lessonId)) {
        return "locked";
    }

    if (
        lesson.videoProgress > 0 ||
        lesson.assignmentSubmitted
    ) {
        return "in-progress";
    }

    return "available";
}


function getLessonStatusText(status) {
    const labels = {
        completed: "Дууссан",
        locked: "Түгжээтэй",
        "in-progress": "Үргэлжилж буй",
        available: "Эхлэх боломжтой"
    };

    return labels[status] || "Хүлээгдэж буй";
}


// ========================================
// 5. PROGRESS CALCULATION
// ========================================

function getStatistics() {
    let completed = 0;
    let inProgress = 0;
    let unlocked = 0;
    let submitted = 0;

    let totalVideoProgress = 0;

    lessons.forEach(lesson => {
        const lessonState = getLessonState(lesson.id);

        const status = getLessonStatus(lesson.id);

        if (status === "completed") {
            completed++;
        }

        if (status === "in-progress") {
            inProgress++;
        }

        if (status !== "locked") {
            unlocked++;
        }

        if (lessonState.assignmentSubmitted) {
            submitted++;
        }

        totalVideoProgress += Math.min(
            100,
            Math.max(0, lessonState.videoProgress)
        );
    });

    // Нийт ахиц:
    // 50% видео үзсэн ахиц + 50% даалгаврын гүйцэтгэл.
    // Хичээл бүрийн гүйцэтгэлд адил жин өгнө.

    const overallProgress = Math.round(
        (
            totalVideoProgress / lessons.length +
            (submitted / lessons.length) * 100
        ) / 2
    );

    return {
        completed,
        inProgress,
        unlocked,
        submitted,
        overallProgress
    };
}


function renderStatistics() {
    const stats = getStatistics();

    document.getElementById("completedCount").textContent =
        stats.completed;

    document.getElementById("submittedCount").textContent =
        stats.submitted;

    document.getElementById("overallProgress").textContent =
        stats.overallProgress;

    document.getElementById("circleProgress").textContent =
        `${stats.overallProgress}%`;

    document.getElementById("legendCompleted").textContent =
        stats.completed;

    document.getElementById("legendInProgress").textContent =
        stats.inProgress;

    document.getElementById("legendLocked").textContent =
        lessons.length - stats.completed - stats.inProgress;

    const circle = document.getElementById("progressCircle");

    circle.style.setProperty(
        "--progress",
        `${stats.overallProgress}%`
    );

    circle.setAttribute(
        "aria-valuenow",
        stats.overallProgress
    );

    document.getElementById("assignmentSummary").textContent =
        `Та ${stats.submitted} / ${lessons.length} даалгавар илгээсэн байна.`;

    renderNextLesson();

    renderCertificate();
}


// ========================================
// 6. RENDER COURSE CARDS
// ========================================

function createCourseCard(lesson) {
    const status = getLessonStatus(lesson.id);

    const lessonState = getLessonState(lesson.id);

    const locked = status === "locked";

    const completed = status === "completed";

    const videoProgress = Math.round(
        lessonState.videoProgress
    );

    const statusIcon = completed
        ? "fa-circle-check"
        : locked
            ? "fa-lock"
            : status === "in-progress"
                ? "fa-play"
                : "fa-book-open";

    const actionText = completed
        ? "Дахин харах"
        : locked
            ? "Түгжээтэй"
            : status === "in-progress"
                ? "Үргэлжлүүлэх"
                : "Хичээл эхлэх";

    const card = document.createElement("article");

    card.className = `course-card ${status}`;

    card.dataset.status = status;

    const cover = document.createElement("div");

    cover.className = "course-card-cover";

    const numberBadge = document.createElement("span");

    numberBadge.className = "course-number-badge";

    numberBadge.textContent =
        `ХИЧЭЭЛ ${String(lesson.id).padStart(2, "0")}`;

    const statusBadge = document.createElement("span");

    statusBadge.className = "course-status";

    statusBadge.innerHTML =
        `<i class="fa-solid ${statusIcon}"></i> ` +
        getLessonStatusText(status);

    const coverIcon = document.createElement("i");

    coverIcon.className = "fa-solid fa-earth-asia";

    cover.append(numberBadge, statusBadge, coverIcon);


    const body = document.createElement("div");

    body.className = "course-card-body";

    const title = document.createElement("h3");

    title.textContent = lesson.title;

    const description = document.createElement("p");

    description.textContent = lesson.description;

    const progressRow = document.createElement("div");

    progressRow.className = "course-card-progress";

    const progressLabel = document.createElement("span");

    progressLabel.textContent = "Видео үзсэн";

    const progressValue = document.createElement("strong");

    progressValue.textContent = `${videoProgress}%`;

    progressRow.append(progressLabel, progressValue);


    const progressTrack = document.createElement("div");

    progressTrack.className = "mini-progress-track";

    const progressBar = document.createElement("span");

    progressBar.style.width = `${videoProgress}%`;

    progressTrack.append(progressBar);


    const assignmentText = document.createElement("p");

    assignmentText.textContent =
        lessonState.assignmentSubmitted
            ? "Даалгавар: Илгээсэн"
            : "Даалгавар: Илгээгээгүй";

    const button = document.createElement("button");

    button.className =
        "primary-button course-card-action";

    button.type = "button";

    button.disabled = locked;

    button.innerHTML =
        `${actionText} <i class="fa-solid fa-arrow-right"></i>`;

    if (completed) {
        button.innerHTML =
            'Дууссан <i class="fa-solid fa-circle-check"></i>';
    }

    if (!locked) {
        button.addEventListener("click", () => {
            openLesson(lesson.id);
        });
    }

    body.append(
        title,
        description,
        progressRow,
        progressTrack,
        assignmentText,
        button
    );

    card.append(cover, body);

    return card;
}


function renderCourses() {
    const dashboardGrid =
        document.getElementById("coursesGrid");

    const allCoursesGrid =
        document.getElementById("allCoursesGrid");

    dashboardGrid.replaceChildren();

    allCoursesGrid.replaceChildren();

    lessons.slice(0, 3).forEach(lesson => {
        dashboardGrid.appendChild(
            createCourseCard(lesson)
        );
    });

    lessons.forEach(lesson => {
        const card = createCourseCard(lesson);

        if (currentFilter !== "all") {
            const status = getLessonStatus(lesson.id);

            if (currentFilter === "available") {
                if (
                    status !== "available" &&
                    status !== "in-progress"
                ) {
                    card.hidden = true;
                }
            } else if (currentFilter !== status) {
                card.hidden = true;
            }
        }

        allCoursesGrid.appendChild(card);
    });
}


// ========================================
// 7. NEXT LESSON
// ========================================

function renderNextLesson() {
    const nextLesson = lessons.find(lesson => {
        return !isLessonCompleted(lesson.id);
    });

    if (!nextLesson) {
        document.getElementById("nextLessonNumber").textContent =
            "БҮХ ХИЧЭЭЛ ДУУССАН";

        document.getElementById("nextLessonTitle").textContent =
            "Баяр хүргэе!";

        document.getElementById("nextLessonDescription").textContent =
            "Та 12 хичээл болон бүх даалгавраа дуусгалаа.";

        document.getElementById("nextLessonProgressBar").style.width =
            "100%";

        document.getElementById("nextLessonProgressText").textContent =
            "100%";

        document.getElementById("continueLessonButton").textContent =
            "Сертификат харах";

        return;
    }

    const lessonState = getLessonState(nextLesson.id);

    const unlocked = isLessonUnlocked(nextLesson.id);

    document.getElementById("nextLessonNumber").textContent =
        `ХИЧЭЭЛ ${String(nextLesson.id).padStart(2, "0")}`;

    document.getElementById("nextLessonTitle").textContent =
        nextLesson.title;

    document.getElementById("nextLessonDescription").textContent =
        unlocked
            ? nextLesson.description
            : "Өмнөх хичээлийн видео болон даалгаврыг бүрэн дуусгана уу.";

    document.getElementById("nextLessonProgressBar").style.width =
        `${lessonState.videoProgress}%`;

    document.getElementById("nextLessonProgressText").textContent =
        `${Math.round(lessonState.videoProgress)}%`;

    document.getElementById("continueLessonButton").innerHTML =
        unlocked
            ? 'Хичээл рүү очих <i class="fa-solid fa-arrow-right"></i>'
            : '<i class="fa-solid fa-lock"></i> Өмнөх хичээлийг дуусгах';
}


// ========================================
// 8. COURSE MODAL
// ========================================

function openLesson(lessonId) {
    const lesson = lessons.find(item => item.id === lessonId);

    if (!lesson) {
        return;
    }

    if (!isLessonUnlocked(lessonId)) {
        showToast(
            "Өмнөх хичээлийн шаардлагыг эхлээд биелүүлнэ үү."
        );

        return;
    }

    activeLessonId = lessonId;

    const lessonState = getLessonState(lessonId);

    document.getElementById("modalLessonNumber").textContent =
        `ХИЧЭЭЛ ${String(lesson.id).padStart(2, "0")}`;

    document.getElementById("modalLessonTitle").textContent =
        lesson.title;

    document.getElementById("modalLessonDescription").textContent =
        lesson.description;

    document.getElementById("modalVideoProgress").textContent =
        `${Math.round(lessonState.videoProgress)}%`;

    document.getElementById("modalVideoProgressBar").style.width =
        `${lessonState.videoProgress}%`;

    document.getElementById("assignmentFile").value = "";

    document.getElementById("selectedFileName").textContent = "";

    document.getElementById("assignmentMessage").textContent = "";

    document.getElementById("assignmentMessage").className =
        "form-message";

    document.getElementById("submissionStatus").textContent =
        lessonState.assignmentSubmitted
            ? `Илгээсэн файл: ${lessonState.assignmentName}`
            : "";

    const submitButton =
        document.getElementById("submitAssignmentButton");

    submitButton.disabled = false;

    const isCompleted = isLessonCompleted(lessonId);

    if (isCompleted) {
        submitButton.disabled = true;

        document.getElementById("assignmentMessage").textContent =
            "Энэ хичээл бүрэн дууссан байна.";
    }

    const video = document.getElementById("lessonVideo");

    // Хэрэв видео URL тохируулсан бол энд src онооно.
    // Жишээ:
    // lesson.videoUrl = "videos/lesson-01.mp4";

    if (lesson.videoUrl) {
        video.src = lesson.videoUrl;

        video.hidden = false;

        document.getElementById("modalVideoPlaceholder").hidden = true;

        video.currentTime = 0;

        video.onloadedmetadata = () => {
            const savedProgress = getLessonState(lessonId);

            if (
                video.duration &&
                savedProgress.videoProgress > 0 &&
                savedProgress.videoProgress < 100
            ) {
                video.currentTime =
                    video.duration *
                    (savedProgress.videoProgress / 100);
            }
        };
    } else {
        video.pause();

        video.removeAttribute("src");

        video.load();

        video.hidden = true;

        document.getElementById("modalVideoPlaceholder").hidden =
            false;
    }

    document.getElementById("courseModal").hidden = false;

    document.body.style.overflow = "hidden";
}


function closeLessonModal() {
    const video = document.getElementById("lessonVideo");

    video.pause();

    document.getElementById("courseModal").hidden = true;

    document.body.style.overflow = "";

    activeLessonId = null;
}


// ========================================
// 9. VIDEO PROGRESS
// ========================================

// Үзсэн хугацааг хадгална.
// Хичээл бүрэн дуусахын тулд видеог 100% үзсэн байх ёстой.

function updateVideoProgress() {
    if (!activeLessonId) {
        return;
    }

    const video = document.getElementById("lessonVideo");

    if (
        !video ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
    ) {
        return;
    }

    const lessonState = getLessonState(activeLessonId);

    const progress = Math.min(
        100,
        Math.max(
            0,
            (video.currentTime / video.duration) * 100
        )
    );

    lessonState.videoProgress = Math.max(
        lessonState.videoProgress,
        progress
    );

    if (video.ended) {
        lessonState.videoProgress = 100;

        lessonState.videoCompleted = true;
    }

    saveState();

    document.getElementById("modalVideoProgress").textContent =
        `${Math.round(lessonState.videoProgress)}%`;

    document.getElementById("modalVideoProgressBar").style.width =
        `${lessonState.videoProgress}%`;

    renderStatistics();

    renderCourses();
}


// ========================================
// 10. ASSIGNMENT UPLOAD
// ========================================

// ЧУХАЛ:
// Доорх хувилбар зөвхөн файл сонгосныг бүртгэнэ.
// Файлыг серверт илгээхгүй.
// localStorage-д файл өөрөө биш, нэр болон хэмжээ хадгалагдана.
//
// Бодит хувилбарт Supabase Storage ашиглана.

function handleAssignmentSubmit(event) {
    event.preventDefault();

    if (!activeLessonId) {
        return;
    }

    if (!isLessonUnlocked(activeLessonId)) {
        showToast("Энэ хичээл одоогоор түгжээтэй байна.");

        return;
    }

    const lessonState = getLessonState(activeLessonId);

    if (lessonState.videoProgress < 100) {
        showAssignmentMessage(
            "Даалгавар илгээхийн өмнө видеог 100% үзнэ үү.",
            "error"
        );

        return;
    }

    const fileInput =
        document.getElementById("assignmentFile");

    const file = fileInput.files[0];

    if (!file) {
        showAssignmentMessage(
            "Эхлээд даалгаврын файлаа сонгоно уу.",
            "error"
        );

        return;
    }

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png"
    ];

    const extension = file.name
        .split(".")
        .pop()
        .toLowerCase();

    const allowedExtensions = [
        "pdf",
        "doc",
        "docx",
        "jpg",
        "jpeg",
        "png"
    ];

    if (
        !allowedExtensions.includes(extension) ||
        (
            file.type &&
            !allowedTypes.includes(file.type)
        )
    ) {
        showAssignmentMessage(
            "PDF, DOC, DOCX, JPG эсвэл PNG файл сонгоно уу.",
            "error"
        );

        return;
    }

    // Demo хувилбарын файл хэмжээний хязгаар.
    // Сервер дээр давхар шалгах шаардлагатай.

    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
        showAssignmentMessage(
            "Файлын хэмжээ 10 MB-аас бага байх ёстой.",
            "error"
        );

        return;
    }

    // Энэ нь бодит upload биш.
    // Зөвхөн интерфэйс турших зорилготой.

    lessonState.assignmentSubmitted = true;

    lessonState.assignmentName = file.name;

    lessonState.assignmentSize = file.size;

    saveState();

    showAssignmentMessage(
        "Туршилтын бүртгэл амжилттай. Файл серверт байршуулаагүй байна.",
        "success"
    );

    document.getElementById("submissionStatus").textContent =
        `Сонгосон файл: ${file.name} — туршилтын төлөв.`;

    document.getElementById("submitAssignmentButton").disabled =
        true;

    renderStatistics();

    renderCourses();

    renderAssignments();

    showToast(
        "Даалгаврын туршилтын төлөв хадгалагдлаа."
    );
}


function showAssignmentMessage(message, type) {
    const element =
        document.getElementById("assignmentMessage");

    element.textContent = message;

    element.className = `form-message ${type}`;
}


// ========================================
// 11. ASSIGNMENT TABLE
// ========================================

function renderAssignments() {
    const tbody =
        document.getElementById("assignmentsTableBody");

    tbody.replaceChildren();

    lessons.forEach(lesson => {
        const lessonState = getLessonState(lesson.id);

        const status = getLessonStatus(lesson.id);

        const row = document.createElement("tr");

        const lessonCell = document.createElement("td");

        lessonCell.textContent =
            `${String(lesson.id).padStart(2, "0")}. ${lesson.title}`;

        const videoCell = document.createElement("td");

        const videoStatus = document.createElement("span");

        videoStatus.className =
            "table-status " +
            (
                lessonState.videoProgress >= 100
                    ? "completed"
                    : status === "locked"
                        ? "locked"
                        : "pending"
            );

        videoStatus.textContent =
            `${Math.round(lessonState.videoProgress)}%`;

        videoCell.appendChild(videoStatus);


        const assignmentCell = document.createElement("td");

        const assignmentStatus = document.createElement("span");

        assignmentStatus.className =
            "table-status " +
            (
                lessonState.assignmentSubmitted
                    ? "completed"
                    : status === "locked"
                        ? "locked"
                        : "pending"
            );

        assignmentStatus.textContent =
            lessonState.assignmentSubmitted
                ? "Илгээсэн"
                : status === "locked"
                    ? "Түгжээтэй"
                    : "Хүлээгдэж буй";

        assignmentCell.appendChild(assignmentStatus);


        const actionCell = document.createElement("td");

        const button = document.createElement("button");

        button.className = "table-action";

        button.type = "button";

        button.textContent =
            status === "locked"
                ? "Түгжээтэй"
                : "Нээх";

        button.disabled = status === "locked";

        if (status !== "locked") {
            button.addEventListener("click", () => {
                openLesson(lesson.id);
            });
        }

        actionCell.appendChild(button);

        row.append(
            lessonCell,
            videoCell,
            assignmentCell,
            actionCell
        );

        tbody.appendChild(row);
    });
}


// ========================================
// 12. CERTIFICATE
// ========================================

function renderCertificate() {
    const stats = getStatistics();

    const eligible =
        stats.completed === lessons.length &&
        stats.submitted === lessons.length;

    const downloadButton =
        document.getElementById("downloadCertificateButton");

    downloadButton.disabled = !eligible;

    document.getElementById("certificateHeading").textContent =
        eligible
            ? "Баяр хүргэе! Та сургалтаа дуусгалаа."
            : "Таны амжилтын аялал үргэлжилж байна";

    document.getElementById("certificateDescription").textContent =
        eligible
            ? "Та бүх хичээл болон даалгаврыг дуусгасан байна."
            : `Үлдсэн хичээл: ${lessons.length - stats.completed}. ` +
              `Илгээх шаардлагатай даалгавар: ${lessons.length - stats.submitted}.`;

    document.getElementById("certificateNote").textContent =
        eligible
            ? "Сертификат үүсгэхэд бэлэн."
            : "Бүх 12 хичээлийг 100% үзэж, даалгавраа илгээсний дараа нээгдэнэ.";

    const viewButton =
        document.getElementById("viewCertificateButton");

    viewButton.disabled = !eligible;
}


function downloadDemoCertificate() {
    const stats = getStatistics();

    const eligible =
        stats.completed === lessons.length &&
        stats.submitted === lessons.length;

    if (!eligible) {
        showToast(
            "Сертификат авахын тулд бүх хичээлийг дуусгана уу."
        );

        return;
    }

    // Энэ нь жинхэнэ сертификат биш.
    // Сертификатын PDF-ийг серверийн баталгаажуулалттайгаар
    // үүсгэх шаардлагатай.

    showToast(
        "Сертификатын PDF үүсгэх функцийг Supabase-тай холбох шаардлагатай."
    );
}


// ========================================
// 13. PAGE NAVIGATION
// ========================================

const pageTitles = {
    overview: "Хянах самбар",
    courses: "Миний хичээлүүд",
    assignments: "Миний даалгавар",
    certificate: "Сертификат",
    profile: "Миний профайл"
};


function showSection(sectionId) {
    const target = document.getElementById(sectionId);

    if (!target || !target.classList.contains("page-section")) {
        return;
    }

    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.toggle(
            "active",
            section.id === sectionId
        );
    });

    document.querySelectorAll(".nav-link[data-section]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );
    });

    document.getElementById("pageTitle").textContent =
        pageTitles[sectionId] || "Хянах самбар";

    closeSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function handleNavigation(event) {
    const link = event.target.closest(
        ".nav-link[data-section]"
    );

    if (!link) {
        return;
    }

    event.preventDefault();

    const sectionId = link.dataset.section;

    showSection(sectionId);

    history.replaceState(
        null,
        "",
        `#${sectionId}`
    );
}


// ========================================
// 14. SIDEBAR
// ========================================

function openSidebar() {
    document.getElementById("sidebar").classList.add("open");

    document.getElementById("sidebarOverlay").classList.add("show");
}


function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");

    document.getElementById("sidebarOverlay").classList.remove("show");
}


// ========================================
// 15. COURSE FILTER
// ========================================

function handleCourseFilter(event) {
    const button = event.target.closest(".filter-button");

    if (!button) {
        return;
    }

    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach(item => {
        item.classList.toggle(
            "active",
            item === button
        );
    });

    renderCourses();
}


// ========================================
// 16. NOTIFICATIONS
// ========================================

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


// ========================================
// 17. DEMO LOGIN / LOGOUT
// ========================================

function handleLogout() {
    const confirmed = window.confirm(
        "Та системээс гарахдаа итгэлтэй байна уу?"
    );

    if (!confirmed) {
        return;
    }

    // Бодит системд Supabase Auth signOut() ашиглана.

    showToast(
        "Гарах үйлдлийг бодит нэвтрэх системтэй холбох шаардлагатай."
    );
}


// ========================================
// 18. EVENT LISTENERS
// ========================================

function bindEvents() {
    document.querySelectorAll(".sidebar-nav").forEach(nav => {
        nav.addEventListener("click", handleNavigation);
    });

    document.getElementById("menuToggle")
        .addEventListener("click", openSidebar);

    document.getElementById("sidebarClose")
        .addEventListener("click", closeSidebar);

    document.getElementById("sidebarOverlay")
        .addEventListener("click", closeSidebar);

    document.getElementById("viewAllCourses")
        .addEventListener("click", () => {
            showSection("courses");
        });

    document.getElementById("viewCertificateButton")
        .addEventListener("click", () => {
            showSection("certificate");
        });

    document.getElementById("continueLessonButton")
        .addEventListener("click", () => {
            const nextLesson = lessons.find(lesson => {
                return !isLessonCompleted(lesson.id);
            });

            if (!nextLesson) {
                showSection("certificate");

                return;
            }

            if (!isLessonUnlocked(nextLesson.id)) {
                showToast(
                    "Өмнөх хичээлийн видео болон даалгаврыг дуусгана уу."
                );

                return;
            }

            openLesson(nextLesson.id);
        });

    document.getElementById("courseModal")
        .addEventListener("click", event => {
            if (
                event.target.matches("[data-close-modal]") ||
                event.target.closest("#modalClose")
            ) {
                closeLessonModal();
            }
        });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            !document.getElementById("courseModal").hidden
        ) {
            closeLessonModal();
        }
    });

    document.getElementById("lessonVideo")
        .addEventListener("timeupdate", updateVideoProgress);

    document.getElementById("lessonVideo")
        .addEventListener("ended", updateVideoProgress);

    document.getElementById("assignmentForm")
        .addEventListener("submit", handleAssignmentSubmit);

    document.getElementById("assignmentFile")
        .addEventListener("change", event => {
            const file = event.target.files[0];

            document.getElementById("selectedFileName").textContent =
                file
                    ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
                    : "";
        });

    document.getElementById("allCoursesGrid")
        .addEventListener("click", handleCourseFilter);

    document.querySelector(".course-filter")
        .addEventListener("click", handleCourseFilter);

    document.getElementById("downloadCertificateButton")
        .addEventListener("click", downloadDemoCertificate);

    document.getElementById("logoutButton")
        .addEventListener("click", handleLogout);

    document.getElementById("notificationButton")
        .addEventListener("click", () => {
            showToast(
                "Одоогоор шинэ мэдэгдэл алга."
            );
        });

    document.getElementById("userMenu")
        .addEventListener("click", () => {
            showSection("profile");
        });
}


// ========================================
// 19. INITIALIZE
// ========================================

function initDashboard() {
    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    renderUserInfo();

    renderCourses();

    renderAssignments();

    renderStatistics();

    bindEvents();

    const initialSection =
        window.location.hash.replace("#", "");

    if (pageTitles[initialSection]) {
        showSection(initialSection);
    }
}


document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);