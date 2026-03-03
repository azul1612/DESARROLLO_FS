/* =============================================
   ECOHUELLA — app.js
   ============================================= */

const API_BASE = 'http://localhost:5000/api';

// ============================================================
// CATÁLOGOS
// ============================================================

const HABITS = [
  { id: 'bike',     emoji: '🚴', name: 'Ir en Bicicleta',   desc: 'Km recorridos sin combustible',     unit: 'km',      co2PerUnit: 0.21,  category: 'Transporte'    },
  { id: 'walk',     emoji: '🚶', name: 'Caminar',            desc: 'Km caminados en lugar de conducir', unit: 'km',      co2PerUnit: 0.18,  category: 'Transporte'    },
  { id: 'noflight', emoji: '✈️', name: 'Evité un Vuelo',     desc: 'Vuelos cortos evitados hoy',        unit: 'vuelos',  co2PerUnit: 255,   category: 'Transporte'    },
  { id: 'vegan',    emoji: '🥗', name: 'Comida Vegana',      desc: 'Comidas sin carne ni lácteos',      unit: 'comidas', co2PerUnit: 1.5,   category: 'Alimentación'  },
  { id: 'nomeat',   emoji: '🥦', name: 'Sin Carne Roja',     desc: 'Evitar carne de res o cerdo',       unit: 'comidas', co2PerUnit: 1.2,   category: 'Alimentación'  },
  { id: 'local',    emoji: '🛒', name: 'Compra Local',        desc: 'Productos de productores locales',  unit: 'kg',      co2PerUnit: 0.4,   category: 'Alimentación'  },
  { id: 'recycle',  emoji: '♻️', name: 'Reciclé Residuos',   desc: 'Kg de residuos separados',          unit: 'kg',      co2PerUnit: 0.7,   category: 'Residuos'      },
  { id: 'compost',  emoji: '🌱', name: 'Compostaje',          desc: 'Kg de orgánicos compostados',       unit: 'kg',      co2PerUnit: 0.5,   category: 'Residuos'      },
  { id: 'shower',   emoji: '🚿', name: 'Ducha Corta',         desc: 'Duchas de menos de 5 minutos',      unit: 'min',     co2PerUnit: 0.08,  category: 'Agua & Energía' },
  { id: 'solar',    emoji: '☀️', name: 'Energía Renovable',  desc: 'kWh consumidos de fuente limpia',   unit: 'kWh',     co2PerUnit: 0.5,   category: 'Agua & Energía' },
  { id: 'reuse',    emoji: '🛍️', name: 'Reutilicé Envase',   desc: 'Envases de un solo uso evitados',   unit: 'piezas',  co2PerUnit: 0.1,   category: 'Residuos'      },
  { id: 'tree',     emoji: '🌳', name: 'Planté un Árbol',    desc: 'Árboles plantados hoy',             unit: 'árboles', co2PerUnit: 21,    category: 'Naturaleza'    },
];

const CHALLENGES = [
  { id: 'noplastic', emoji: '🚫', title: 'Semana Sin Plásticos de Un Solo Uso', desc: 'Evita bolsas, popotes y envases desechables durante 7 días', duration: '7 días',  participants: 1243, co2Collective: 3720, target: 5000,  daysLeft: 4,  category: 'Residuos'     },
  { id: 'bikeweek',  emoji: '🚴', title: 'Reto Pedal: 50km Esta Semana',        desc: 'Suma 50km en bicicleta para el desafío grupal de 10,000km',  duration: '7 días',  participants: 867,  co2Collective: 9200, target: 18000, daysLeft: 3,  category: 'Transporte'   },
  { id: 'veganmon',  emoji: '🥗', title: 'Mes Vegano (Lunes)',                   desc: 'Todos los lunes de este mes: cero productos animales',        duration: '4 lunes', participants: 2105, co2Collective: 6300, target: 8400,  daysLeft: 18, category: 'Alimentación' },
  { id: 'zerowaste', emoji: '🗑️', title: 'Chef Residuo Cero',                   desc: 'Una semana de recetas de aprovechamiento: nada al bote',     duration: '7 días',  participants: 540,  co2Collective: 1620, target: 4000,  daysLeft: 6,  category: 'Residuos'     },
];

const BADGES = [
  { id: 'firstlog',   emoji: '🌱', name: 'Primer Paso',       desc: 'Registra tu primer hábito ecológico',   condition: s => s.totalLogs >= 1           },
  { id: 'bikeHero',   emoji: '🚴', name: 'Nómada del Pedal',  desc: 'Acumula 50 km en bicicleta',            condition: s => (s.bikeKm     || 0) >= 50  },
  { id: 'zerowaste',  emoji: '♻️', name: 'Chef Residuo Cero', desc: 'Registra reciclaje 7 días distintos',    condition: s => (s.recycleDays || 0) >= 7  },
  { id: 'treelover',  emoji: '🌳', name: 'Guardabosques',     desc: 'Equivale a plantar 10 árboles',          condition: s => s.treesTotal >= 10         },
  { id: 'week',       emoji: '🔥', name: 'Racha Semanal',     desc: '7 días consecutivos con algún registro', condition: s => s.streak >= 7              },
  { id: 'co2hero',    emoji: '🌍', name: 'Héroe del Clima',   desc: 'Ahorra 100 kg de CO₂ en total',          condition: s => s.co2Total >= 100          },
  { id: 'veganchamp', emoji: '🥦', name: 'Guerrero Verde',    desc: 'Registra 14 comidas veganas',            condition: s => (s.veganMeals || 0) >= 14  },
  { id: 'solar',      emoji: '☀️', name: 'Ciudadano Solar',   desc: 'Registra 50 kWh de energía renovable',   condition: s => (s.solarKwh   || 0) >= 50  },
];

// ============================================================
// ESTADO EN MEMORIA
// ============================================================

let currentUser = null;
let state = {
  logs: [], streak: 0, lastLogDate: null,
  treesTotal: 0, co2Total: 0, totalLogs: 0,
  bikeKm: 0, recycleDays: 0, veganMeals: 0, solarKwh: 0,
  unlockedBadges: [], challenges: {},
};

// ============================================================
// API
// ============================================================

function getToken() {
  return currentUser?.token || null;
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || data.error || `Error ${res.status}`);
  return data;
}

// ============================================================
// SESIÓN
// ============================================================

function saveSession(user) {
  currentUser = user;
  sessionStorage.setItem('ecohuella_token', user.token);
  sessionStorage.setItem('ecohuella_user', JSON.stringify({
    _id: user._id, name: user.name, email: user.email, avatar: user.avatar,
  }));
}

function clearSession() {
  currentUser = null;
  sessionStorage.removeItem('ecohuella_token');
  sessionStorage.removeItem('ecohuella_user');
}

function loadSession() {
  const token = sessionStorage.getItem('ecohuella_token');
  const raw   = sessionStorage.getItem('ecohuella_user');
  if (!token || !raw) return null;
  try {
    const user = JSON.parse(raw);
    currentUser = { ...user, token };
    return currentUser;
  } catch {
    return null;
  }
}

// ============================================================
// PERSISTENCIA DE SESIÓN
// ============================================================

(async function checkSession() {
  const user = loadSession();
  if (!user) return;
  try {
    await fetchAndSetState();
    loginScreen.style.display = 'none';
    appWrapper.style.display  = 'flex';
    document.body.classList.remove('logged-out');
    updateSidebarUser(user);
    renderDashboard();
    renderHabitsToday();
    updateHabitCards();
  } catch {
    clearSession();
  }
})();

// ============================================================
// ESTADO DESDE EL BACKEND
// ============================================================

async function fetchAndSetState() {
  const data = await apiFetch('/logs');
  const logs = Array.isArray(data) ? data : (data.logs || []);

  const newState = {
    logs: [], streak: 0, lastLogDate: null,
    treesTotal: 0, co2Total: 0, totalLogs: 0,
    bikeKm: 0, recycleDays: 0, veganMeals: 0, solarKwh: 0,
    unlockedBadges: data.unlockedBadges || [],
    challenges:     data.challenges     || {},
  };

  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(l => {
    const date = l.date?.split('T')[0] || l.date;
    newState.logs.push({ date, habitId: l.habitId, value: l.value, co2: l.co2 });
    newState.co2Total   = +(newState.co2Total   + l.co2).toFixed(3);
    newState.treesTotal = +(newState.treesTotal + l.co2 / 21).toFixed(3);
    newState.totalLogs += 1;

    if (l.habitId === 'bike')    newState.bikeKm      = +((newState.bikeKm     || 0) + l.value).toFixed(2);
    if (l.habitId === 'recycle') newState.recycleDays  =  (newState.recycleDays || 0) + 1;
    if (l.habitId === 'vegan')   newState.veganMeals   =  (newState.veganMeals  || 0) + l.value;
    if (l.habitId === 'solar')   newState.solarKwh     =  (newState.solarKwh    || 0) + l.value;
  });

  newState.streak = calcStreak(newState.logs);
  state = newState;
}

function calcStreak(logs) {
  const days = [...new Set(logs.map(l => l.date))].sort();
  if (!days.length) return 0;
  let streak = 1;
  for (let i = days.length - 1; i > 0; i--) {
    const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  const diffToday = (new Date(todayStr()) - new Date(days[days.length - 1])) / 86400000;
  return diffToday <= 1 ? streak : 0;
}

// ============================================================
// VALIDADORES
// ============================================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

const BLOCKED_DOMAINS = ['example.com', 'test.com', 'fake.com', 'noemail.com', 'noexiste.xyz'];
function isAllowedEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return !BLOCKED_DOMAINS.includes(domain);
}

function getPasswordStrength(pass) {
  let score = 0;
  if (pass.length >= 6)          score++;
  if (pass.length >= 10)         score++;
  if (/[A-Z]/.test(pass))        score++;
  if (/[0-9]/.test(pass))        score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score <= 1) return { label: 'Muy débil',  color: '#e74c3c', pct: '20%'  };
  if (score === 2) return { label: 'Débil',      color: '#e67e22', pct: '40%'  };
  if (score === 3) return { label: 'Regular',    color: '#f1c40f', pct: '60%'  };
  if (score === 4) return { label: 'Fuerte',     color: '#27ae60', pct: '80%'  };
  return                  { label: 'Muy fuerte', color: '#16a085', pct: '100%' };
}

// ============================================================
// AUTH TABS
// ============================================================

const tabLogin     = document.getElementById('tabLogin');
const tabSignup    = document.getElementById('tabSignup');
const tabIndicator = document.getElementById('tabIndicator');
const panelLogin   = document.getElementById('panelLogin');
const panelSignup  = document.getElementById('panelSignup');

function switchToLogin() {
  tabLogin.classList.add('active');
  tabSignup.classList.remove('active');
  tabIndicator.classList.remove('right');
  panelLogin.classList.add('active');
  panelSignup.classList.remove('active');
}

function switchToSignup() {
  tabSignup.classList.add('active');
  tabLogin.classList.remove('active');
  tabIndicator.classList.add('right');
  panelSignup.classList.add('active');
  panelLogin.classList.remove('active');
}

tabLogin.addEventListener('click', switchToLogin);
tabSignup.addEventListener('click', switchToSignup);
document.getElementById('goToSignup').addEventListener('click', e => { e.preventDefault(); switchToSignup(); });
document.getElementById('goToLogin').addEventListener('click',  e => { e.preventDefault(); switchToLogin();  });

// ============================================================
// LOGIN
// ============================================================

const loginEmailInput  = document.getElementById('loginEmailInput');
const loginEmailWrap   = document.getElementById('loginEmailWrap');
const loginEmailStatus = document.getElementById('loginEmailStatus');
const loginEmailError  = document.getElementById('loginEmailError');
const loginPassInput   = document.getElementById('loginPassInput');
const loginPassError   = document.getElementById('loginPassError');
const btnLogin         = document.getElementById('btnLogin');
const btnLoginText     = document.getElementById('btnLoginText');
const btnLoginLoader   = document.getElementById('btnLoginLoader');

loginEmailInput.addEventListener('input', () => {
  const val = loginEmailInput.value.trim();
  loginEmailError.textContent = '';
  if (!val) {
    loginEmailWrap.classList.remove('valid', 'invalid');
    loginEmailStatus.textContent = '';
    return;
  }
  if (!isValidEmail(val) || !isAllowedEmail(val)) {
    loginEmailWrap.classList.remove('valid');
    loginEmailWrap.classList.add('invalid');
    loginEmailStatus.textContent = '✕';
    loginEmailError.textContent  = !isValidEmail(val) ? 'Formato de correo inválido' : 'Dominio no permitido';
  } else {
    loginEmailWrap.classList.remove('invalid');
    loginEmailWrap.classList.add('valid');
    loginEmailStatus.textContent = '✓';
  }
});

document.getElementById('toggleLoginPass').addEventListener('click', () => {
  const hidden = loginPassInput.type === 'password';
  loginPassInput.type = hidden ? 'text' : 'password';
  document.getElementById('toggleLoginPass').textContent = hidden ? '🙈' : '👁';
});

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = loginEmailInput.value.trim().toLowerCase();
  const pass  = loginPassInput.value;
  let hasError = false;

  loginEmailError.textContent = '';
  loginPassError.textContent  = '';

  if (!email || !isValidEmail(email) || !isAllowedEmail(email)) {
    loginEmailError.textContent = 'Ingresa un correo válido';
    hasError = true;
  }
  if (!pass || pass.length < 6) {
    loginPassError.textContent = 'La contraseña debe tener al menos 6 caracteres';
    hasError = true;
  }
  if (hasError) return;

  setLoginLoading(true);
  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
    saveSession({ ...data.user, token: data.token });
    await fetchAndSetState();
    enterApp(currentUser);
  } catch (err) {
    const msg = err.message.toLowerCase();
    if (msg.includes('correo') || msg.includes('usuario') || msg.includes('email') || msg.includes('not found')) {
      loginEmailError.textContent = 'No existe una cuenta con este correo. ¿Quieres registrarte?';
      loginEmailWrap.classList.add('invalid');
    } else {
      loginPassError.textContent = err.message || 'Contraseña incorrecta';
    }
  } finally {
    setLoginLoading(false);
  }
});

function setLoginLoading(on) {
  btnLoginText.style.display   = on ? 'none' : 'inline';
  btnLoginLoader.style.display = on ? 'inline-block' : 'none';
  btnLogin.disabled = on;
}

// ============================================================
// SIGNUP
// ============================================================

const signupNameInput     = document.getElementById('signupNameInput');
const signupNameWrap      = document.getElementById('signupNameWrap');
const signupNameStatus    = document.getElementById('signupNameStatus');
const signupNameError     = document.getElementById('signupNameError');
const signupEmailInput    = document.getElementById('signupEmailInput');
const signupEmailWrap     = document.getElementById('signupEmailWrap');
const signupEmailStatus   = document.getElementById('signupEmailStatus');
const signupEmailError    = document.getElementById('signupEmailError');
const signupPassInput     = document.getElementById('signupPassInput');
const signupPassError     = document.getElementById('signupPassError');
const signupConfirmInput  = document.getElementById('signupConfirmInput');
const signupConfirmWrap   = document.getElementById('signupConfirmWrap');
const signupConfirmStatus = document.getElementById('signupConfirmStatus');
const signupConfirmError  = document.getElementById('signupConfirmError');
const passStrengthFill    = document.getElementById('passStrengthFill');
const passStrengthLabel   = document.getElementById('passStrengthLabel');
const btnSignup           = document.getElementById('btnSignup');
const btnSignupText       = document.getElementById('btnSignupText');
const btnSignupLoader     = document.getElementById('btnSignupLoader');

signupNameInput.addEventListener('input', () => {
  const val = signupNameInput.value.trim();
  if (val.length >= 2) {
    signupNameWrap.classList.remove('invalid');
    signupNameWrap.classList.add('valid');
    signupNameStatus.textContent = '✓';
    signupNameError.textContent  = '';
  } else {
    signupNameWrap.classList.remove('valid');
    signupNameWrap.classList.add('invalid');
    signupNameStatus.textContent = '✕';
  }
});

signupEmailInput.addEventListener('input', () => {
  const val = signupEmailInput.value.trim();
  signupEmailError.textContent = '';
  if (!val) {
    signupEmailWrap.classList.remove('valid', 'invalid');
    signupEmailStatus.textContent = '';
    return;
  }
  if (!isValidEmail(val) || !isAllowedEmail(val)) {
    signupEmailWrap.classList.remove('valid');
    signupEmailWrap.classList.add('invalid');
    signupEmailStatus.textContent = '✕';
    signupEmailError.textContent  = !isValidEmail(val) ? 'Formato inválido' : 'Dominio no permitido';
  } else {
    signupEmailWrap.classList.remove('invalid');
    signupEmailWrap.classList.add('valid');
    signupEmailStatus.textContent = '✓';
  }
});

signupPassInput.addEventListener('input', () => {
  const val = signupPassInput.value;
  if (!val) {
    passStrengthFill.style.width  = '0%';
    passStrengthLabel.textContent = '';
    return;
  }
  const s = getPasswordStrength(val);
  passStrengthFill.style.width      = s.pct;
  passStrengthFill.style.background = s.color;
  passStrengthLabel.textContent     = s.label;
  passStrengthLabel.style.color     = s.color;
  checkConfirmMatch();
});

signupConfirmInput.addEventListener('input', checkConfirmMatch);

function checkConfirmMatch() {
  const pass    = signupPassInput.value;
  const confirm = signupConfirmInput.value;
  if (!confirm) {
    signupConfirmWrap.classList.remove('valid', 'invalid');
    signupConfirmStatus.textContent = '';
    return;
  }
  if (pass === confirm) {
    signupConfirmWrap.classList.remove('invalid');
    signupConfirmWrap.classList.add('valid');
    signupConfirmStatus.textContent = '✓';
    signupConfirmError.textContent  = '';
  } else {
    signupConfirmWrap.classList.remove('valid');
    signupConfirmWrap.classList.add('invalid');
    signupConfirmStatus.textContent = '✕';
  }
}

document.getElementById('toggleSignupPass').addEventListener('click', () => {
  const hidden = signupPassInput.type === 'password';
  signupPassInput.type = hidden ? 'text' : 'password';
  document.getElementById('toggleSignupPass').textContent = hidden ? '🙈' : '👁';
});

document.getElementById('signupForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name    = signupNameInput.value.trim();
  const email   = signupEmailInput.value.trim().toLowerCase();
  const pass    = signupPassInput.value;
  const confirm = signupConfirmInput.value;
  const terms   = document.getElementById('acceptTerms').checked;
  let hasError  = false;

  [signupNameError, signupEmailError, signupPassError, signupConfirmError]
    .forEach(el => el.textContent = '');
  document.getElementById('termsError').textContent = '';

  if (!name || name.length < 2) {
    signupNameError.textContent = 'Ingresa tu nombre (mínimo 2 caracteres)';
    hasError = true;
  }
  if (!email || !isValidEmail(email) || !isAllowedEmail(email)) {
    signupEmailError.textContent = 'Ingresa un correo válido';
    hasError = true;
  }
  if (!pass || pass.length < 6) {
    signupPassError.textContent = 'La contraseña debe tener al menos 6 caracteres';
    hasError = true;
  }
  if (pass !== confirm) {
    signupConfirmError.textContent = 'Las contraseñas no coinciden';
    hasError = true;
  }
  if (!terms) {
    document.getElementById('termsError').textContent = 'Debes aceptar los términos para continuar';
    hasError = true;
  }
  if (hasError) return;

  const avatars = ['🌱', '🌿', '🌲', '🍃', '🌾', '🌻'];
  const avatar  = avatars[Math.floor(Math.random() * avatars.length)];

  setSignupLoading(true);
  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: pass, avatar }),
    });
    saveSession({ ...data.user, token: data.token });
    await fetchAndSetState();
    showToast(`🎉 ¡Bienvenido, ${name}! Tu cuenta ha sido creada`);
    enterApp(currentUser);
  } catch (err) {
    const msg = err.message.toLowerCase();
    if (msg.includes('correo') || msg.includes('email') || msg.includes('existe') || msg.includes('duplicate')) {
      signupEmailError.textContent = 'Este correo ya está registrado';
    } else {
      signupEmailError.textContent = err.message;
    }
  } finally {
    setSignupLoading(false);
  }
});

function setSignupLoading(on) {
  btnSignupText.style.display   = on ? 'none' : 'inline';
  btnSignupLoader.style.display = on ? 'inline-block' : 'none';
  btnSignup.disabled = on;
}

// ============================================================
// GOOGLE (pendiente de integrar OAuth real)
// ============================================================

/*[document.getElementById('googleBtnLogin'), document.getElementById('googleBtnSignup')]
  .forEach(btn => btn.addEventListener('click', () => {
    showToast('🔐 Google OAuth no está configurado todavía.');
  }));
*/
document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('googleBtnLogin');

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            window.location.href = 'http://localhost:5000/api/auth/google';
        });
    }
});
// ============================================================
// ENTRAR / SALIR
// ============================================================

const loginScreen = document.getElementById('loginScreen');
const appWrapper  = document.getElementById('appWrapper');

function enterApp(user) {
  updateSidebarUser(user);
  loginScreen.classList.add('hidden');
  document.body.classList.remove('logged-out');
  appWrapper.style.display = 'flex';

  setTimeout(() => {
    loginScreen.style.display = 'none';
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById('dashboard').classList.add('active');
    document.querySelector('[data-section="dashboard"]').classList.add('active');
    renderDashboard();
    renderHabitsToday();
    updateHabitCards();
  }, 500);
}

function updateSidebarUser(user) {
  const avatarEl = document.getElementById('sidebarAvatar');
  const nameEl   = document.getElementById('sidebarName');
  const emailEl  = document.getElementById('sidebarEmail');
  if (avatarEl) avatarEl.textContent = user.avatar || '🌱';
  if (nameEl)   nameEl.textContent   = user.name;
  if (emailEl)  emailEl.textContent  = user.email;
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearSession();
  state = {
    logs: [], streak: 0, lastLogDate: null,
    treesTotal: 0, co2Total: 0, totalLogs: 0,
    bikeKm: 0, recycleDays: 0, veganMeals: 0, solarKwh: 0,
    unlockedBadges: [], challenges: {},
  };
  appWrapper.style.display  = 'none';
  loginScreen.style.display = '';
  document.body.classList.add('logged-out');
  setTimeout(() => loginScreen.classList.remove('hidden'), 20);

  loginEmailInput.value        = '';
  loginPassInput.value         = '';
  loginEmailError.textContent  = '';
  loginPassError.textContent   = '';
  loginEmailWrap.classList.remove('valid', 'invalid');
  loginEmailStatus.textContent = '';
  switchToLogin();
});

// ============================================================
// NAVEGACIÓN
// ============================================================

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.dataset.section;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    link.classList.add('active');
    document.getElementById(target).classList.add('active');
    if (target === 'dashboard') renderDashboard();
  });
});

// ============================================================
// DASHBOARD
// ============================================================

function renderDashboard() {
  updateImpactBanner();
  renderForest();
  renderWeeklyChart();
  renderCategoryChart();
  setDateLabel();
  renderSavingsWidget();
}

function setDateLabel() {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString('es-ES', opts);
}

function updateImpactBanner() {
  const today    = todayStr();
  const co2Today = state.logs.filter(l => l.date === today).reduce((s, l) => s + l.co2, 0);
  const co2Week  = state.logs.filter(l => l.date >= weekAgoStr()).reduce((s, l) => s + l.co2, 0);
  animateNumber('treesPlanted', +(co2Today / 21).toFixed(1));
  animateNumber('co2Saved',     +co2Week.toFixed(1));
  animateNumber('streakDays',   state.streak);
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step  = target / 40;
  const tick  = () => {
    current = Math.min(current + step, target);
    el.textContent = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ---- GRÁFICAS ----

let weeklyChartInstance   = null;
let categoryChartInstance = null;

function renderWeeklyChart() {
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) return;
  const { labels, thisWeek, lastWeek } = getWeeklyData();
  if (weeklyChartInstance) weeklyChartInstance.destroy();
  weeklyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Esta semana',   data: thisWeek, backgroundColor: 'rgba(74,124,47,.75)',   borderRadius: 8, borderSkipped: false },
        { label: 'Semana pasada', data: lastWeek, backgroundColor: 'rgba(200,230,160,.45)', borderRadius: 8, borderSkipped: false },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend:  { labels: { font: { family: 'Nunito', size: 12 }, color: '#4a5240' } },
        tooltip: { callbacks: { label: c => ` ${c.raw.toFixed(2)} kg CO₂` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Nunito' }, color: '#8a9280' } },
        y: { grid: { color: 'rgba(200,230,160,.3)' }, ticks: { font: { family: 'Nunito' }, color: '#8a9280', callback: v => v + ' kg' } },
      },
    },
  });
  const sumThis = thisWeek.reduce((a, b) => a + b, 0);
  const sumLast = lastWeek.reduce((a, b) => a + b, 0);
  const trendEl = document.getElementById('weekTrend');
  if (sumLast > 0) {
    const diff = (((sumLast - sumThis) / sumLast) * 100).toFixed(0);
    trendEl.textContent = diff >= 0 ? `↓ ${diff}% vs semana pasada` : `↑ ${Math.abs(diff)}% vs semana pasada`;
    trendEl.className   = 'trend ' + (diff >= 0 ? 'positive' : 'negative');
  }
}

function renderCategoryChart() {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;
  const cats = {};
  state.logs.forEach(l => {
    const h = HABITS.find(h => h.id === l.habitId);
    if (h) cats[h.category] = (cats[h.category] || 0) + l.co2;
  });
  if (categoryChartInstance) categoryChartInstance.destroy();
  const labels = Object.keys(cats).length   ? Object.keys(cats)   : ['Sin datos'];
  const data   = Object.values(cats).length ? Object.values(cats) : [1];
  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#4a7c2f', '#7ab648', '#c4956a', '#8b5e3c', '#c8e6a0', '#e8d5b7'],
        borderWidth: 2, borderColor: '#faf8f3', hoverOffset: 8,
      }],
    },
    options: {
      responsive: true, cutout: '65%',
      plugins: {
        legend:  { position: 'bottom', labels: { font: { family: 'Nunito', size: 11 }, color: '#4a5240', padding: 12 } },
        tooltip: { callbacks: { label: c => ` ${c.raw.toFixed(2)} kg CO₂` } },
      },
    },
  });
}

// ---- BOSQUE ----

function renderForest() {
  const container = document.getElementById('forestContainer');
  if (!container) return;
  container.innerHTML = '';
  const trees     = Math.min(Math.floor(state.treesTotal), 50);
  const sizeClass = state.treesTotal >= 30 ? 'large' : state.treesTotal >= 15 ? 'medium' : 'small';

  for (let i = 0; i < trees; i++) {
    const el = document.createElement('span');
    el.className           = 'tree ' + sizeClass;
    el.textContent         = i % 4 === 0 ? '🌲' : i % 3 === 0 ? '🌳' : '🌿';
    el.style.animationDelay = (i * 60) + 'ms';
    container.appendChild(el);
  }

  document.getElementById('forestProgressFill').style.width = Math.min((state.treesTotal / 50) * 100, 100) + '%';
  document.getElementById('forestLevel').textContent =
    state.treesTotal >= 40 ? '🌴 Selva Madura' :
    state.treesTotal >= 20 ? '🌳 Bosque Denso'  :
    state.treesTotal >= 8  ? '🌿 Bosque Joven'  : '🌱 Semillero';
  document.getElementById('forestCaption').textContent = trees === 0
    ? 'Registra hábitos para que tu bosque virtual crezca 🌱'
    : `Tu bosque tiene ${trees} árboles · Faltan ${Math.max(0, 50 - trees)} para la selva madura`;
}

// ---- HÁBITOS DE HOY ----

function renderHabitsToday() {
  const today     = todayStr();
  const container = document.getElementById('habitsToday');
  if (!container) return;
  const todayLogs = state.logs.filter(l => l.date === today);
  if (!todayLogs.length) {
    container.innerHTML = '<p class="empty-state">Aún no has registrado hábitos hoy. ¡Empieza ahora!</p>';
    return;
  }
  container.innerHTML = '';
  todayLogs.forEach(l => {
    const h = HABITS.find(h => h.id === l.habitId);
    if (!h) return;
    const el = document.createElement('div');
    el.className = 'habit-today-item';
    el.innerHTML = `
      <span class="habit-today-emoji">${h.emoji}</span>
      <div class="habit-today-info">
        <div class="habit-today-name">${h.name}</div>
        <div class="habit-today-val">${l.value} ${h.unit}</div>
      </div>
      <span class="habit-today-co2">≡ ${l.co2.toFixed(2)} kg CO₂</span>
    `;
    container.appendChild(el);
  });
}

// ============================================================
// GRID DE HÁBITOS
// ============================================================

function initHabitsGrid() {
  const grid = document.getElementById('habitsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  HABITS.forEach(h => {
    const card = document.createElement('div');
    card.className = 'habit-card';
    card.id        = 'hcard-' + h.id;
    card.innerHTML = `
      <span class="habit-emoji">${h.emoji}</span>
      <div class="habit-name">${h.name}</div>
      <div class="habit-desc">${h.desc}</div>
      <span class="habit-impact">~${h.co2PerUnit} kg CO₂ / ${h.unit}</span>
    `;
    card.addEventListener('click', () => openModal(h));
    grid.appendChild(card);
  });
  updateHabitCards();
}

function updateHabitCards() {
  const today = todayStr();
  HABITS.forEach(h => {
    const card = document.getElementById('hcard-' + h.id);
    if (!card) return;
    const logged   = state.logs.some(l => l.habitId === h.id && l.date === today);
    const existing = card.querySelector('.habit-logged-badge');
    card.classList.toggle('logged', logged);
    if (logged && !existing) {
      const b = document.createElement('span');
      b.className   = 'habit-logged-badge';
      b.textContent = '✓ Hoy';
      card.appendChild(b);
    } else if (!logged && existing) {
      existing.remove();
    }
  });
}

// ============================================================
// MODAL
// ============================================================

let selectedHabit = null;

function initModal() {
  document.getElementById('logHabitBtn').addEventListener('click', openModalGeneral);
  document.getElementById('modalClose').addEventListener('click',  closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalConfirm').addEventListener('click', confirmLog);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
}

function openModalGeneral() {
  selectedHabit = null;
  buildHabitSelectList();
  document.getElementById('modalInputRow').style.display = 'none';
  document.getElementById('modalOverlay').classList.add('open');
}

function openModal(habit) {
  selectedHabit = habit;
  buildHabitSelectList(habit.id);
  showModalInput(habit);
  document.getElementById('modalOverlay').classList.add('open');
}

function buildHabitSelectList(activeId = null) {
  const list = document.getElementById('habitSelectList');
  list.innerHTML = '';
  HABITS.forEach(h => {
    const item = document.createElement('div');
    item.className = 'habit-select-item' + (h.id === activeId ? ' active' : '');
    item.innerHTML = `<span class="hsi-emoji">${h.emoji}</span><span class="hsi-name">${h.name}</span><span class="hsi-co2">${h.co2PerUnit} kg/u</span>`;
    item.addEventListener('click', () => {
      document.querySelectorAll('.habit-select-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      selectedHabit = h;
      showModalInput(h);
    });
    list.appendChild(item);
  });
}

function showModalInput(habit) {
  document.getElementById('modalInputRow').style.display = 'flex';
  document.getElementById('modalLabel').textContent      = `¿Cuántos ${habit.unit}?`;
  document.getElementById('modalInput').value            = '';
  document.getElementById('modalUnit').textContent       = habit.unit;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  selectedHabit = null;
}

function confirmLog() {
  if (!selectedHabit) { showToast('Selecciona un hábito primero'); return; }
  const val = parseFloat(document.getElementById('modalInput').value);
  if (isNaN(val) || val <= 0) { showToast('Ingresa un valor válido mayor a 0'); return; }
  logHabit(selectedHabit, val);
  closeModal();
}

// ============================================================
// REGISTRAR HÁBITO
// ============================================================

async function logHabit(habit, value) {
  const co2   = +(habit.co2PerUnit * value).toFixed(3);
  const today = todayStr();

  // Actualización optimista
  state.logs.push({ date: today, habitId: habit.id, value, co2 });
  state.co2Total   = +(state.co2Total   + co2).toFixed(3);
  state.totalLogs += 1;
  state.treesTotal = +(state.treesTotal + co2 / 21).toFixed(3);

  if (habit.id === 'bike')    state.bikeKm      = +((state.bikeKm     || 0) + value).toFixed(2);
  if (habit.id === 'recycle') state.recycleDays  =  (state.recycleDays || 0) + 1;
  if (habit.id === 'vegan')   state.veganMeals   =  (state.veganMeals  || 0) + value;
  if (habit.id === 'solar')   state.solarKwh     =  (state.solarKwh    || 0) + value;

  state.streak = calcStreak(state.logs);

  checkBadges();
  renderDashboard();
  renderHabitsToday();
  updateHabitCards();
  showToast(`✓ +${co2.toFixed(2)} kg CO₂ ahorrados · ≈ ${(co2 / 21).toFixed(2)} 🌳`);

  try {
    await apiFetch('/logs', {
      method: 'POST',
      body: JSON.stringify({ habitId: habit.id, name: habit.name, value, unit: habit.unit, co2, date: today }),
    });
  } catch (err) {
    showToast('⚠️ No se pudo guardar en el servidor: ' + err.message);
    // Revertir actualización optimista
    state.logs.pop();
    state.co2Total   = +(state.co2Total   - co2).toFixed(3);
    state.totalLogs -= 1;
    state.treesTotal = +(state.treesTotal - co2 / 21).toFixed(3);
    renderDashboard();
    renderHabitsToday();
    updateHabitCards();
  }
}

// ============================================================
// DESAFÍOS
// ============================================================

function initChallenges() {
  const list = document.getElementById('challengesList');
  if (!list) return;
  list.innerHTML = '';
  CHALLENGES.forEach(ch => {
    const joined = state.challenges[ch.id] || false;
    const pct    = Math.min((ch.co2Collective / ch.target) * 100, 100).toFixed(0);
    const card   = document.createElement('div');
    card.className = 'challenge-card';
    card.innerHTML = `
      <div>
        <div class="challenge-header">
          <div class="challenge-emoji">${ch.emoji}</div>
          <div>
            <div class="challenge-title">${ch.title}</div>
            <div class="challenge-desc">${ch.desc}</div>
          </div>
        </div>
        <div class="challenge-meta">
          <span class="meta-chip">⏱ ${ch.daysLeft} días restantes</span>
          <span class="meta-chip green">👥 ${ch.participants.toLocaleString()} participantes</span>
          <span class="meta-chip accent">📁 ${ch.category}</span>
        </div>
        <button class="btn-join ${joined ? 'joined' : ''}" id="joinBtn-${ch.id}">
          ${joined ? '✓ Unido' : '+ Unirme al Reto'}
        </button>
      </div>
      <div class="challenge-progress-wrap">
        <div class="challenge-prog-label"><span>Impacto colectivo</span><span>${pct}%</span></div>
        <div class="challenge-prog-bar"><div class="challenge-prog-fill" style="width:${pct}%"></div></div>
        <div class="challenge-co2">${ch.co2Collective.toLocaleString()} / ${ch.target.toLocaleString()} kg CO₂</div>
      </div>
    `;
    card.querySelector(`#joinBtn-${ch.id}`).addEventListener('click', async () => {
      const newVal = !state.challenges[ch.id];
      state.challenges[ch.id] = newVal;
      const btn = card.querySelector(`#joinBtn-${ch.id}`);
      btn.textContent = newVal ? '✓ Unido' : '+ Unirme al Reto';
      btn.classList.toggle('joined', newVal);
      if (newVal) showToast(`🎉 ¡Te uniste a "${ch.title}"!`);

      try {
        await apiFetch('/logs/challenges', {
          method: 'PATCH',
          body: JSON.stringify({ challenges: state.challenges }),
        });
      } catch (err) {
        showToast('⚠️ No se pudo sincronizar: ' + err.message);
        state.challenges[ch.id] = !newVal;
        btn.textContent = state.challenges[ch.id] ? '✓ Unido' : '+ Unirme al Reto';
        btn.classList.toggle('joined', state.challenges[ch.id]);
      }
    });
    list.appendChild(card);
  });
}

// ============================================================
// MEDALLAS
// ============================================================

function renderBadges() {
  const grid = document.getElementById('badgesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  BADGES.forEach(b => {
    const unlocked = state.unlockedBadges.includes(b.id);
    const card     = document.createElement('div');
    card.className = 'badge-card ' + (unlocked ? 'unlocked' : 'locked');
    card.innerHTML = `
      <span class="badge-icon">${b.emoji}</span>
      <div class="badge-name">${b.name}</div>
      <div class="badge-desc">${b.desc}</div>
      ${unlocked ? '<span class="badge-unlocked-tag">✓ Ganado</span>' : ''}
    `;
    grid.appendChild(card);
  });
}

async function checkBadges() {
  let newOne = false;
  BADGES.forEach(b => {
    if (!state.unlockedBadges.includes(b.id) && b.condition(state)) {
      state.unlockedBadges.push(b.id);
      newOne = true;
      setTimeout(() => showToast(`🏅 ¡Logro desbloqueado! "${b.name}" ${b.emoji}`), 600);
    }
  });
  if (!newOne) return;

  renderBadges();
  try {
    await apiFetch('/logs/badges', {
      method: 'PATCH',
      body: JSON.stringify({ unlockedBadges: state.unlockedBadges }),
    });
  } catch (err) {
    console.warn('No se pudieron guardar los badges:', err.message);
  }
}

// ============================================================
// ABOUT / CTA
// ============================================================

document.getElementById('aboutToDashboard').addEventListener('click', () => {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelector('[data-section="dashboard"]').classList.add('active');
  document.getElementById('dashboard').classList.add('active');
  renderDashboard();
});

document.getElementById('aboutFromLogin').addEventListener('click', e => {
  e.preventDefault();
  const guestUser = { name: 'Visitante', email: 'visitante@ecohuella.com', avatar: '👁', method: 'guest' };
  currentUser = guestUser;
  enterApp(guestUser);
  setTimeout(() => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelector('[data-section="about"]').classList.add('active');
    document.getElementById('about').classList.add('active');
  }, 150);
});

document.getElementById('forgotLink').addEventListener('click', async e => {
  e.preventDefault();
  const email = loginEmailInput.value.trim();
  if (!isValidEmail(email)) { showToast('Ingresa tu correo primero'); return; }
  try {
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    showToast(`📧 Link de recuperación enviado a ${email}`);
  } catch (err) {
    showToast(err.message || 'No se pudo enviar el correo de recuperación');
  }
});

// ============================================================
// WIDGET DE AHORRO — ExchangeRate-API
// ============================================================

const EXCHANGE_API_KEY    = '52f8eb198b0c7c1d98949f6d';
const PRECIO_GASOLINA_MXN = 22;
const KM_POR_LITRO        = 12;
const CACHE_MS            = 60 * 60 * 1000;

let exchangeRates = null;
let lastFetchTime = null;

async function fetchExchangeRates(force = false) {
  const now = Date.now();
  if (!force && exchangeRates && lastFetchTime && (now - lastFetchTime) < CACHE_MS) {
    return exchangeRates;
  }
  setSavingsStatus('Obteniendo tasas de cambio…', '');
  const res  = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/MXN`);
  if (!res.ok) throw new Error(`Error de API: ${res.status}`);
  const data = await res.json();
  if (data.result !== 'success') throw new Error(data['error-type'] || 'Error desconocido');
  exchangeRates = data.conversion_rates;
  lastFetchTime = now;
  return exchangeRates;
}

function calcSavingsMXN() {
  const today     = todayStr();
  const weekAgo   = weekAgoStr();
  const transport = ['bike', 'walk'];
  const km        = filter => state.logs.filter(filter).reduce((sum, l) => sum + l.value, 0);
  const toMXN     = km => (km / KM_POR_LITRO) * PRECIO_GASOLINA_MXN;
  return {
    today: toMXN(km(l => l.date === today  && transport.includes(l.habitId))),
    week:  toMXN(km(l => l.date >= weekAgo && transport.includes(l.habitId))),
    total: toMXN(km(l => transport.includes(l.habitId))),
  };
}

function formatCurrency(amount, code) {
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: code,
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${code}`;
  }
}

async function renderSavingsWidget(force = false) {
  const select = document.getElementById('savingsCurrency');
  if (!select) return;
  const currency = select.value;
  setRefreshLoading(true);
  try {
    const rates = await fetchExchangeRates(force);
    const rate  = rates[currency];
    if (!rate) throw new Error(`Moneda no encontrada: ${currency}`);

    const mxn     = calcSavingsMXN();
    const convert = v => v * rate;

    document.getElementById('savingToday').textContent = formatCurrency(convert(mxn.today), currency);
    document.getElementById('savingWeek').textContent  = formatCurrency(convert(mxn.week),  currency);
    document.getElementById('savingTotal').textContent = formatCurrency(convert(mxn.total), currency);
    document.getElementById('savingRate').textContent  = `1 MXN = ${rate.toFixed(4)} ${currency}`;

    const rateLabel = document.querySelector('.savings-item.highlight .savings-item-label');
    if (rateLabel) rateLabel.textContent = `🌍 Tasa MXN → ${currency}`;

    const timeStr = new Date(lastFetchTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    setSavingsStatus(`✓ Tasas actualizadas a las ${timeStr}`, 'ok');
  } catch (err) {
    setSavingsStatus(`⚠️ ${err.message}`, 'error');
    console.error('ExchangeRate-API:', err);
  } finally {
    setRefreshLoading(false);
  }
}

function setSavingsStatus(msg, type = '') {
  const el = document.getElementById('savingsStatus');
  if (!el) return;
  el.textContent = msg;
  el.className   = 'savings-status ' + type;
}

function setRefreshLoading(on) {
  const btn = document.getElementById('savingsRefresh');
  if (!btn) return;
  btn.classList.toggle('loading', on);
  btn.disabled = on;
}

// ============================================================
// UTILS
// ============================================================

function todayStr()   { return new Date().toISOString().split('T')[0]; }
function weekAgoStr() { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; }

function getWeeklyData() {
  const labels   = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const days     = [];
  const dayNames = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
    dayNames.push(labels[d.getDay() === 0 ? 6 : d.getDay() - 1]);
  }
  const thisWeek = days.map(date =>
    state.logs.filter(l => l.date === date).reduce((s, l) => s + l.co2, 0)
  );
  const lastWeek = thisWeek.map(v => +(v * (1.08 + Math.random() * 0.25)).toFixed(3));
  return { labels: dayNames, thisWeek, lastWeek };
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initHabitsGrid();
  initChallenges();
  renderBadges();
  initModal();

  const select  = document.getElementById('savingsCurrency');
  const refresh = document.getElementById('savingsRefresh');
  if (select)  select.addEventListener('change', () => renderSavingsWidget(false));
  if (refresh) refresh.addEventListener('click',  () => renderSavingsWidget(true));

  if (currentUser) {
    renderDashboard();
    renderHabitsToday();
  }
});
