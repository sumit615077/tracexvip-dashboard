const tg = window.Telegram?.WebApp;
const API = "https://telebot.botifyhost.app/api/miniapp/me";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = String(value);
}

async function getJson(url, options = {}) {
  const r = await fetch(url, options);
  return await r.json();
}

async function loadDashboard() {
  try {
    tg?.ready();
    tg?.expand();

    const user = tg?.initDataUnsafe?.user;
    if (!user) {
      setText("credits", "Open in Telegram");
      return;
    }

    setText("username", user.username ? "@" + user.username : user.first_name);
    setText("userid", "User ID: " + user.id);
    setText("welcome", "Welcome " + (user.first_name || "User"));
    setText("avatar", (user.first_name || "TX").slice(0, 2).toUpperCase());

    let data = null;

    try {
      data = await getJson(API + "?uid=" + encodeURIComponent(user.id));
    } catch (e) {
      console.log("GET uid failed", e);
    }

    if (!data || data.error || data.success === false) {
      data = await getJson(API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ initData: tg.initData, uid: user.id })
      });
    }

    console.log("API DATA:", data);

    const u = data.user || data.data || data;

    setText("credits", u.credits ?? u.balance ?? 0);
    setText("plan", "💎 " + (u.plan_name || u.plan || "Free"));
    setText("account_plan", u.plan_name || u.plan || "Free");
    setText("expiry", (u.days_remaining ?? u.days_left ?? 0) + " days left");
    setText("today_searches", u.today_searches ?? u.requests_today ?? 0);
    setText("total_searches", u.total_searches ?? u.total_requests ?? 0);

  } catch (err) {
    console.log("Dashboard error:", err);
    setText("credits", "API Error");
    setText("plan", "API Not Connected");
    setText("expiry", "Check backend");
  }
}

document.querySelectorAll(".nav").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".page").forEach(p => p.classList.remove("show"));
    document.getElementById(btn.dataset.page)?.classList.add("show");
  });
});

loadDashboard();
