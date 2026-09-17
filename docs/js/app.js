(function () {
  const SESSION_KEY = "anglarill-demo-session";
  const app = document.getElementById("app");
  const habitState = DEMO.habits.map(function (h) {
    return Object.assign({}, h);
  });

  const icons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/></svg>',
    diary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 9h8M8 13h6"/></svg>',
    plans: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4h8M7 8h10v12H7z"/><path d="M10 12h4M10 16h3"/></svg>',
    habits: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5 9.5 17 19 7"/></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.2"/><path d="M5 19c1.4-3.2 4-5 7-5s5.6 1.8 7 5"/></svg>',
    scale: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 6V5a4 4 0 0 1 8 0v1"/></svg>',
    activity: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h3l2-6 3 10 2-6h6"/></svg>',
  };

  function loggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }

  function setLoggedIn(value) {
    if (value) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function route() {
    const hash = (location.hash || "#/splash").replace("#", "") || "/splash";
    return hash.startsWith("/") ? hash : "/" + hash;
  }

  function go(path) {
    location.hash = path;
  }

  function guarded(path) {
    const publicPaths = ["/splash", "/login", "/register"];
    if (!loggedIn() && publicPaths.indexOf(path) === -1) return "/login";
    if (loggedIn() && path === "/splash") return "/home";
    return path;
  }

  function nav(active) {
    const items = [
      ["home", "Inicio", "/home"],
      ["diary", "Diario", "/diario"],
      ["plans", "Planes", "/planes"],
      ["habits", "Hábitos", "/habitos"],
      ["profile", "Perfil", "/perfil"],
    ];
    return (
      '<nav class="nav">' +
      items
        .map(function (item) {
          const cls = item[0] === active ? "active" : "";
          return (
            '<button class="' +
            cls +
            '" data-go="' +
            item[2] +
            '">' +
            icons[item[0]] +
            item[1] +
            "</button>"
          );
        })
        .join("") +
      "</nav>"
    );
  }

  function ringSvg(pct) {
    const p = Math.max(0, Math.min(100, pct));
    const dash = (p / 100) * 100;
    return (
      '<svg class="ring" viewBox="0 0 36 36">' +
      '<path d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31" fill="none" stroke="#e3ebe8" stroke-width="3.2"/>' +
      '<path d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31" fill="none" stroke="#8bc200" stroke-width="3.2" stroke-dasharray="' +
      dash +
      ' 100" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function weightChart() {
    const pts = DEMO.weightHistory;
    const weights = pts.map(function (p) {
      return p.kg;
    });
    const min = Math.min.apply(null, weights) - 0.2;
    const max = Math.max.apply(null, weights) + 0.2;
    const w = 320;
    const h = 140;
    const coords = pts.map(function (p, i) {
      const x = (i / (pts.length - 1)) * (w - 24) + 12;
      const y = 12 + (1 - (p.kg - min) / (max - min)) * (h - 28);
      return x + "," + y;
    });
    return (
      '<svg class="chart" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" preserveAspectRatio="none">' +
      '<polyline fill="none" stroke="#00574B" stroke-width="3" points="' +
      coords.join(" ") +
      '"/>' +
      coords
        .map(function (c) {
          const xy = c.split(",");
          return '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="4" fill="#8bc200"/>';
        })
        .join("") +
      "</svg>"
    );
  }

  function views() {
    const u = DEMO.user;
    const t = DEMO.today;
    const usedPct = Math.round((t.consumedKcal / u.goalKcal) * 100);

    return {
      "/splash": function () {
        return `
          <section class="view splash">
            <img src="assets/logotipo_anglarill.png" alt="Anglarill Fitness">
            <h1>Anglarill Fitness</h1>
            <p>Nutrición personal, paso a paso.</p>
          </section>`;
      },
      "/login": function () {
        return `
          <section class="view auth">
            <div class="auth-hero">
              <img src="assets/logotipo_anglarill.png" alt="">
              <h1>Bienvenida de nuevo</h1>
              <p>Demo: cualquier email y contraseña entran.</p>
            </div>
            <form class="form" id="login-form">
              <label>Email<input type="email" name="email" value="ana@demo.anglarill" required></label>
              <label>Contraseña<input type="password" name="password" value="demo" required></label>
              <button class="btn btn-primary btn-block" type="submit">Entrar</button>
              <button class="btn btn-ghost btn-block" type="button" data-go="/register">Crear cuenta</button>
            </form>
          </section>`;
      },
      "/register": function () {
        return `
          <section class="view auth">
            <div class="auth-hero">
              <h1>Crear cuenta</h1>
              <p>Registro simulado. No se envía nada a un servidor.</p>
            </div>
            <form class="form" id="login-form">
              <label>Nombre<input type="text" value="Ana Pérez" required></label>
              <label>Email<input type="email" value="ana@demo.anglarill" required></label>
              <label>Contraseña<input type="password" value="demo" required></label>
              <button class="btn btn-primary btn-block" type="submit">Continuar</button>
              <button class="btn btn-ghost btn-block" type="button" data-go="/login">Ya tengo cuenta</button>
            </form>
          </section>`;
      },
      "/home": function () {
        return `
          <section class="view">
            <div class="screen-scroll has-nav">
              <div class="topbar">
                <div>
                  <p class="eyebrow">Hola, ${u.name.split(" ")[0]}</p>
                  <h1>Tu día</h1>
                </div>
                <div class="avatar">${u.initials}</div>
              </div>
              <div class="card kcal-ring">
                ${ringSvg(usedPct)}
                <div>
                  <h2>${t.remainingKcal} kcal</h2>
                  <p class="muted">restantes de ${u.goalKcal}</p>
                  <div class="macros">
                    <span class="chip">P ${t.protein}/${u.protein} g</span>
                    <span class="chip">C ${t.carbs}/${u.carbs} g</span>
                    <span class="chip">G ${t.fat}/${u.fat} g</span>
                  </div>
                </div>
              </div>
              <div class="grid-2">
                <div class="stat"><span>Peso</span><strong>${u.currentWeight} kg</strong></div>
                <div class="stat"><span>Racha hábitos</span><strong>${t.habitStreak} días</strong></div>
              </div>
              <p class="eyebrow" style="margin:16px 0 8px">Atajos</p>
              <div class="grid-2">
                <button class="shortcut" data-go="/peso">${icons.scale} Peso</button>
                <button class="shortcut" data-go="/actividad">${icons.activity} Actividad</button>
              </div>
            </div>
            ${nav("home")}
          </section>`;
      },
      "/peso": function () {
        const rows = DEMO.weightHistory
          .slice()
          .reverse()
          .map(function (p) {
            return "<li><span>" + p.date + "</span><strong>" + p.kg + " kg</strong></li>";
          })
          .join("");
        return `
          <section class="view">
            <div class="screen-scroll has-nav">
              <div class="topbar">
                <h1>Peso</h1>
                <button class="btn btn-ghost" data-go="/home">Volver</button>
              </div>
              <div class="card">
                <p class="muted">Objetivo ${u.targetWeight} kg</p>
                ${weightChart()}
              </div>
              <div class="card">
                <h2>Registros</h2>
                <ul class="list">${rows}</ul>
              </div>
            </div>
            ${nav("home")}
          </section>`;
      },
      "/diario": function () {
        const meals = DEMO.meals
          .map(function (m) {
            return `
              <article class="card meal">
                <h3>${m.name}</h3>
                <p class="muted">${m.items}</p>
                <div class="macros" style="margin-top:8px">
                  <span class="chip">${m.kcal} kcal</span>
                  <span class="chip">P ${m.protein} g</span>
                  <span class="chip">C ${m.carbs} g</span>
                  <span class="chip">G ${m.fat} g</span>
                </div>
              </article>`;
          })
          .join("");
        return `
          <section class="view">
            <div class="screen-scroll has-nav">
              <h1 class="section-title">Diario</h1>
              <p class="muted">${t.consumedKcal} / ${u.goalKcal} kcal</p>
              ${meals}
            </div>
            ${nav("diary")}
          </section>`;
      },
      "/planes": function () {
        const cards = DEMO.plans
          .map(function (p) {
            const items = p.meals
              .map(function (item) {
                return "<li><span>" + item + "</span></li>";
              })
              .join("");
            return `
              <article class="card">
                <p class="eyebrow">${p.day}</p>
                <h2>${p.title}</h2>
                <ul class="list">${items}</ul>
              </article>`;
          })
          .join("");
        return `
          <section class="view">
            <div class="screen-scroll has-nav">
              <h1 class="section-title">Planes</h1>
              ${cards}
            </div>
            ${nav("plans")}
          </section>`;
      },
      "/habitos": function () {
        const list = habitState
          .map(function (h) {
            return `
              <button class="habit${h.done ? " done" : ""}" data-habit="${h.id}">
                <span class="check">${h.done ? "✓" : ""}</span>
                <span><strong>${h.label}</strong><br><span class="muted">${h.detail}</span></span>
              </button>`;
          })
          .join("");
        return `
          <section class="view">
            <div class="screen-scroll has-nav">
              <h1 class="section-title">Hábitos</h1>
              <p class="muted">Los cambios solo viven en esta sesión.</p>
              ${list}
            </div>
            ${nav("habits")}
          </section>`;
      },
      "/actividad": function () {
        const a = DEMO.activity;
        return `
          <section class="view">
            <div class="screen-scroll has-nav">
              <div class="topbar">
                <h1>Actividad</h1>
                <button class="btn btn-ghost" data-go="/home">Volver</button>
              </div>
              <div class="card device">
                <span class="dot"></span>
                <div>
                  <strong>${a.device}</strong>
                  <p class="muted">${a.connected ? "Conectado" : "Sin conexión"}</p>
                </div>
              </div>
              <div class="grid-2">
                <div class="stat">
                  <span>Pasos</span>
                  <strong>${a.steps.toLocaleString("es")}</strong>
                  <span class="muted">meta ${a.stepGoal.toLocaleString("es")}</span>
                </div>
                <div class="stat"><span>Kcal activas</span><strong>${a.activeKcal}</strong></div>
              </div>
              <div class="card"><h2>Sueño</h2><p>${a.sleep}</p></div>
            </div>
            ${nav("home")}
          </section>`;
      },
      "/perfil": function () {
        return `
          <section class="view">
            <div class="screen-scroll has-nav">
              <div class="topbar">
                <h1>Perfil</h1>
                <div class="avatar">${u.initials}</div>
              </div>
              <div class="card">
                <h2>${u.name}</h2>
                <p class="muted">${u.email}</p>
                <div class="profile-row"><span>Altura</span><strong>${u.heightCm} cm</strong></div>
                <div class="profile-row"><span>Peso objetivo</span><strong>${u.targetWeight} kg</strong></div>
                <div class="profile-row"><span>Kcal diarias</span><strong>${u.goalKcal}</strong></div>
                <div class="profile-row"><span>Proteína</span><strong>${u.protein} g</strong></div>
                <div class="profile-row"><span>Carbos</span><strong>${u.carbs} g</strong></div>
                <div class="profile-row"><span>Grasas</span><strong>${u.fat} g</strong></div>
              </div>
              <button class="btn btn-primary btn-block" id="logout">Cerrar sesión</button>
            </div>
            ${nav("profile")}
          </section>`;
      },
    };
  }

  function render() {
    const path = guarded(route());
    if ("#" + path !== location.hash) {
      location.hash = path;
    }
    const map = views();
    const view = map[path] || map["/home"];
    app.innerHTML = view();
    bind();
  }

  function bind() {
    app.querySelectorAll("[data-go]").forEach(function (el) {
      el.addEventListener("click", function () {
        go(el.getAttribute("data-go"));
      });
    });
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        setLoggedIn(true);
        go("/home");
      });
    }
    const logout = document.getElementById("logout");
    if (logout) {
      logout.addEventListener("click", function () {
        setLoggedIn(false);
        go("/login");
      });
    }
    app.querySelectorAll("[data-habit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-habit");
        habitState.forEach(function (h) {
          if (h.id === id) h.done = !h.done;
        });
        render();
      });
    });
  }

  window.addEventListener("hashchange", render);

  if (!location.hash) {
    if (loggedIn()) {
      go("/home");
    } else {
      go("/splash");
      setTimeout(function () {
        if (route() === "/splash") go("/login");
      }, 1500);
    }
  }
  render();
})();
