const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;

    if (user) {
        document.getElementById("username").textContent =
            user.username ? "@" + user.username : user.first_name;

        document.getElementById("userid").textContent =
            "User ID: " + user.id;

        loadDashboard(user.id);
    }
}

async function loadDashboard(uid) {
    try {
        const res = await fetch(
            `https://telebot.botifyhost.app/api/dashboard?uid=${uid}`
        );

        const data = await res.json();

        console.log(data);

        if (data.user) {

            if (document.getElementById("credits")) {
                document.getElementById("credits").innerText =
                    data.user.credits || 0;
            }

            if (document.getElementById("plan")) {
                document.getElementById("plan").innerText =
                    data.user.plan_name || "Free";
            }

            if (document.getElementById("expiry")) {
                document.getElementById("expiry").innerText =
                    data.user.expiry_date || "No Expiry";
            }
        }
    } catch (e) {
        console.log("API Error", e);
    }
}

document.querySelectorAll(".nav").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".nav").forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        document.querySelectorAll(".page").forEach(p =>
            p.classList.remove("show")
        );

        document
            .getElementById(btn.dataset.page)
            .classList.add("show");
    });
});
