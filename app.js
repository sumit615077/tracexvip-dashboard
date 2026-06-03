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

        setText("username", name);
        setText("userid", "User ID: " + user.id);
        setText("welcome", "Welcome " + (user.first_name || "User"));
        setText("avatar", (user.first_name || "TX").slice(0, 2).toUpperCase());

        loadDashboard();
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

async function loadDashboard() {
    try {
        const res = await fetch("https://telebot.botifyhost.app/api/miniapp/me", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                initData: tg.initData
            })
        });

        const data = await res.json();
        console.log("MiniApp Data:", data);

        const user = data.user || data;

        setText("credits", user.credits ?? user.balance ?? 0);
        setText("plan", user.plan_name || user.plan || "Free");
        setText("expiry", user.expiry_date || user.expiry || user.days_remaining || "No Expiry");
        setText("account_plan", user.plan_name || user.plan || "Free");

    } catch (e) {
        console.log("API Error:", e);
    }
}

document.querySelectorAll(".nav").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".nav").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".page").forEach(p => p.classList.remove("show"));

        const page = document.getElementById(btn.dataset.page);
        if (page) page.classList.add("show");
    });
});
