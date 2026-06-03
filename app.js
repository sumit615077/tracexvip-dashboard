const tg = window.Telegram?.WebApp;

const API_MINIAPP = "https://telebot.botifyhost.app/api/miniapp/me";

let tgUserId = null;

function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null && value !== "") {
        el.innerText = String(value);
    }
}

function pick(obj, keys, fallback = "") {
    if (!obj) return fallback;
    for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
    }
    return fallback;
}

function normalizeUser(raw) {
    if (!raw) return {};
    return raw.user || raw.data || raw.profile || raw.me || raw;
}

function formatPlan(user) {
    const plan = pick(user, [
        "plan_name", "plan", "subscription", "vip_plan", "package",
        "membership", "sub_name", "title"
    ], "Free");

    return String(plan).includes("💎") ? String(plan) : "💎 " + plan;
}

function formatExpiry(user) {
    const days = pick(user, [
        "days_remaining", "days_left", "vip_days", "remaining_days",
        "subscription_days", "days"
    ], "");

    if (days !== "" && !isNaN(Number(days))) {
        return Number(days) + " days left";
    }

    return pick(user, [
        "expiry_date", "expiry", "vip_expiry", "subscription_expiry",
        "expires_at", "valid_till"
    ], "No Expiry");
}

function applyUserData(rawData) {
    const user = normalizeUser(rawData);

    setText("credits", pick(user, [
        "credits", "credit", "balance", "wallet", "coins", "points"
    ], 0));

    setText("plan", formatPlan(user));
    setText("account_plan", formatPlan(user).replace("💎 ", ""));
    setText("expiry", formatExpiry(user));

    setText("today_searches", pick(user, [
        "today_searches", "today_requests", "today_lookup", "requests_today"
    ], 0));

    setText("total_searches", pick(user, [
        "total_searches", "total_requests", "total_lookup", "requests_total"
    ], 0));
}

async function fetchJson(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        console.log("Non JSON:", text);
        return null;
    }
}

async function loadDashboard() {
    try {
        if (!tg || !tg.initData) {
            console.log("Telegram initData missing. Open from Telegram Open button.");
            return;
        }

        const data = await fetchJson(API_MINIAPP, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                initData: tg.initData
            })
        });

        console.log("MiniApp API Data:", data);

        if (!data || data.success === false || data.error) {
            console.log("MiniApp API failed:", data);
            return;
        }

        applyUserData(data);

    } catch (e) {
        console.log("Dashboard API Error:", e);
    }
}

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#070707");
    tg.setBackgroundColor("#060607");

    const user = tg.initDataUnsafe?.user;

    if (user) {
        tgUserId = user.id;

        const name = user.username
            ? "@" + user.username
            : [user.first_name, user.last_name].filter(Boolean).join(" ") || "Telegram User";

        setText("username", name);
        setText("userid", "User ID: " + user.id);
        setText("welcome", "Welcome " + (user.first_name || "User"));
        setText("avatar", (user.first_name || "TX").slice(0, 2).toUpperCase());
    }

    loadDashboard();
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
