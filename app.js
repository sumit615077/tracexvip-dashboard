const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

if (tg) {
  tg.ready();
  tg.expand();
  const user = tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : null;
  if (user) {
    const name = user.username ? '@' + user.username : [user.first_name, user.last_name].filter(Boolean).join(' ');
    document.getElementById('username').textContent = name || 'Telegram User';
    document.getElementById('userid').textContent = 'User ID: ' + user.id;
    document.getElementById('tgUser').textContent = name || 'Telegram Mini App Dashboard';
    document.getElementById('avatar').textContent = (user.first_name || 'TX').slice(0,2).toUpperCase();
  }
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
