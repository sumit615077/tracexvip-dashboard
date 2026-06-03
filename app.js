const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#070707");
    tg.setBackgroundColor("#060607");

    const user = tg.initDataUnsafe?.user;

    if (user) {
        const name = user.username
            ? "@" + user.username
            : (user.first_name || "Telegram User");

        const usernameEl = document.getElementById("username");
        const useridEl = document.getElementById("userid");
        const welcomeEl = document.getElementById("welcome");
        const avatarEl = document.getElementById("avatar");

        if (usernameEl) usernameEl.textContent = name;
        if (useridEl) useridEl.textContent = "User ID: " + user.id;
        if (welcomeEl) welcomeEl.textContent = "Welcome " + (user.first_name || "User");
        if (avatarEl) avatarEl.textContent = (user.first_name || "TX").slice(0, 2).toUpperCase();

        loadDashboard(user.id);
    }
}

async function loadDashboard(uid) {
    try {
        const res = await fetch(
            `https://telebot.botifyhost.app/api/dashboard?uid=${uid}`
        );

        const data = await res.json();

        console.log("Dashboard Data:", data);

        if (data.user) {

            const creditsEl = document.getElementById("credits");
            const planEl = document.getElementById("plan");
            const expiryEl = document.getElementById("expiry");
            const accountPlanEl = document.getElementById("account_plan");

            if (creditsEl) {
                creditsEl.innerText = data.user.credits || 0;
            }

            if (planEl) {
                planEl.innerText = data.user.plan_name || "Free";
            }

            if (expiryEl) {
                expiryEl.innerText = data.user.expiry_date || "No Expiry";
            }

            if (accountPlanEl) {
                accountPlanEl.innerText = data.user.plan_name || "Free";
            }
        }

    } catch (e) {
        console.log("API Error:", e);
    }
}

document.querySelectorAll(".nav").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".nav").forEach(b => {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        document.querySelectorAll(".page").forEach(p => {
            p.classList.remove("show");
        });

        const page = document.getElementById(btn.dataset.page);

        if (page) {
            page.classList.add("show");
        }
    });
});
