const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor("#070707");
  tg.setBackgroundColor("#060607");
  const u = tg.initDataUnsafe?.user;
  if (u) {
    const name = u.username ? "@" + u.username : [u.first_name,u.last_name].filter(Boolean).join(" ");
    username.textContent = name || "Telegram User";
    userid.textContent = "User ID: " + u.id;
    welcome.textContent = "Welcome " + (u.first_name || "VIP User");
    avatar.textContent = (u.first_name || "TX").slice(0,2).toUpperCase();
  }
}

document.querySelectorAll(".nav").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".nav").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("show"));
    document.getElementById(btn.dataset.page).classList.add("show");
  });
});
