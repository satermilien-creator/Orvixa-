let currentUser = null;
let currentProjects = [];
let latestProject = '';
const DEFAULT_USER = { name: 'Founder', email: 'you@email.com' };

function getSupabase() {
  return window.OrvixaSupabase || null;
}

function getUser() {
  if (!currentUser) {
    return DEFAULT_USER;
  }

  return {
    name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Founder',
    email: currentUser.email || 'you@email.com'
  };
}

function setUser(user) {
  currentUser = { ...(currentUser || {}), ...(user || {}) };
}

async function demoSignup() {
  const name = document.getElementById('name')?.value || 'Founder';
  const email = document.getElementById('email')?.value || 'you@email.com';
  const password = document.getElementById('password')?.value || '';
  const supabase = getSupabase();

  if (!supabase) {
    alert('Supabase is not configured yet.');
    return;
  }

  const { data, error } = await supabase.signUp(email, password, name);
  if (error) {
    alert(error.message || 'Could not create your account.');
    return;
  }

  if (data?.user) {
    setUser(data.user);
  }

  if (data?.session) {
    window.location.href = 'app.html';
  } else {
    alert('Account created. Please check your email to confirm before signing in.');
  }
}

async function demoLogin() {
  const email = document.getElementById('email')?.value || 'you@email.com';
  const password = document.getElementById('password')?.value || '';
  const supabase = getSupabase();

  if (!supabase) {
    alert('Supabase is not configured yet.');
    return;
  }

  const { data, error } = await supabase.signIn(email, password);
  if (error) {
    alert(error.message || 'Could not sign you in.');
    return;
  }

  if (data?.user) {
    setUser(data.user);
    window.location.href = 'app.html';
  }
}

async function logout() {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.signOut();
  }
  window.location.href = 'index.html';
}

const navItems = document.querySelectorAll('.navitem');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');

function showPage(page) {
  pages.forEach((p) => p.classList.remove('visible'));
  const pageEl = document.getElementById(page);
  if (pageEl) {
    pageEl.classList.add('visible');
  }
  navItems.forEach((n) => n.classList.toggle('active', n.dataset.page === page));
  if (pageTitle) {
    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);
  }
  if (page === 'projects') {
    renderProjects();
  }
}

navItems.forEach((item) => {
  if (item.dataset.page) {
    item.addEventListener('click', () => showPage(item.dataset.page));
  }
});

function startCreation(type) {
  showPage('director');
  const typeEl = document.getElementById('type');
  if (typeEl) {
    if ([...typeEl.options].some((o) => o.value === type)) {
      typeEl.value = type;
    } else {
      typeEl.value = 'Video';
    }
  }
  const ideaEl = document.getElementById('idea');
  if (ideaEl) {
    ideaEl.value = `Create a ${type.toLowerCase()} about `;
    ideaEl.focus();
  }
}

function generateProject() {
  const type = document.getElementById('type').value;
  const idea = document.getElementById('idea').value || 'Create a motivational video about healing one day at a time.';
  const audience = document.getElementById('audience').value;
  const platform = document.getElementById('platform').value;
  const goal = document.getElementById('goal').value;
  const style = document.getElementById('style').value;
  const length = document.getElementById('length').value;
  const language = document.getElementById('language').value;
  latestProject = `✨ ORVIXA PROJECT PACKAGE

TYPE: ${type}
IDEA: ${idea}
AUDIENCE: ${audience}
PLATFORM: ${platform}
GOAL: ${goal}
STYLE: ${style}
LENGTH: ${length}
LANGUAGE: ${language}

1. CREATIVE DIRECTION
Create a ${style.toLowerCase()} project that is easy to understand for ${audience.toLowerCase()} and designed to ${goal.toLowerCase()}.

2. SCRIPT
Hook: "One idea can become something powerful."
Scene 1: Open with strong emotional or visual attention.
Scene 2: Show the main message with simple storytelling.
Scene 3: End with a clear call-to-action.

3. VISUAL PLAN
- Shot 1: Cinematic opening scene
- Shot 2: Main subject or product moment
- Shot 3: Emotional transformation or result
- Shot 4: Logo / CTA ending

4. CAPTION
Turn your idea into something real. No prompts. Just create with Orvixa.

5. HASHTAGS
#Orvixa #NoPromptsJustCreate #AIContent #CreatorTools #AIVideo #AIImages

6. NEXT STEPS
In the real version, this will generate AI images, voices, and video assets.`;
  document.getElementById('output').textContent = latestProject;
}

async function saveProject() {
  if (!latestProject) {
    generateProject();
  }

  const supabase = getSupabase();
  const type = document.getElementById('type')?.value || 'Project';

  if (!supabase) {
    alert('Supabase is not configured yet.');
    return;
  }

  const { error } = await supabase.saveProject({
    title: type + ' Project',
    body: latestProject
  });

  if (error) {
    alert(error.message || 'Could not save the project.');
    return;
  }

  await renderProjects();
  updateUsage();
  alert('Project saved.');
}

async function renderProjects() {
  const saved = document.getElementById('savedProjects');
  const recent = document.getElementById('recentProjects');
  const supabase = getSupabase();

  if (!supabase) {
    if (saved) saved.innerHTML = '<p>No saved projects yet. Create one in AI Director.</p>';
    if (recent) recent.innerHTML = '<div class="project">No projects yet <span>New</span></div>';
    return;
  }

  const { data, error } = await supabase.loadProjects();
  if (error) {
    console.error(error);
  }

  currentProjects = data || [];
  const html = currentProjects.length
    ? currentProjects.map((p) => ``<div class="saved-card">
  <b>${p.title}</b>
  <p>${p.created_at ? new Date(p.created_at).toLocaleString() : ''}</p>
  <button onclick="deleteProject(${p.id})">🗑 Delete</button>
</div>` : ''}</p><small>${(p.body || '').slice(0, 120)}...</small></div>`).join('')
    : '<p>No saved projects yet. Create one in AI Director.</p>';

  if (saved) {
    saved.innerHTML = html;
  }

  if (recent) {
    recent.innerHTML = currentProjects.length
      ? currentProjects.slice(0, 3).map((p) => `<div class="project">${p.title}<span>Saved</span></div>`).join('')
      : '<div class="project">No projects yet <span>New</span></div>';
  }

  updateUsage();
}

function updateUsage() {
  const usage = document.getElementById('usageText');
  if (!usage) {
    return;
  }
  usage.textContent = `${Math.min(currentProjects.length, 5)} / 5 projects used`;
}

async function saveSettings() {
  const name = document.getElementById('settingName').value;
  const email = document.getElementById('settingEmail').value;
  const supabase = getSupabase();

  if (!supabase) {
    alert('Supabase is not configured yet.');
    return;
  }

  const { error } = await supabase.updateProfile(name, email);
  if (error) {
    alert(error.message || 'Could not save settings.');
    return;
  }

  setUser({ name, email });
  await loadApp();
  alert('Settings saved.');
}

async function loadApp() {
  const user = getUser();
  const welcome = document.getElementById('welcomeName');
  const avatar = document.getElementById('avatar');
  const sn = document.getElementById('settingName');
  const se = document.getElementById('settingEmail');

  if (welcome) {
    welcome.textContent = `Welcome back, ${user.name || 'Founder'} 👋`;
  }
  if (avatar) {
    avatar.textContent = (user.name || 'F')[0].toUpperCase();
  }
  if (sn) {
    sn.value = user.name || 'Founder';
  }
  if (se) {
    se.value = user.email || 'you@email.com';
  }

  await renderProjects();
  updateUsage();
}

async function initializeApp() {
  const supabase = getSupabase();
  if (!supabase) {
    return;
  }

  const { user } = await supabase.getCurrentUser();
  currentUser = user;

  if (user && (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('signup.html'))) {
    window.location.href = 'app.html';
    return;
  }

  if (!user && window.location.pathname.endsWith('app.html')) {
    window.location.href = 'login.html';
    return;
  }

  if (supabase.supabase?.auth?.onAuthStateChange) {
    supabase.supabase.auth.onAuthStateChange((event, session) => {
      currentUser = session?.user || null;
      if (document.getElementById('welcomeName')) {
        loadApp();
      }
    });
  }

  if (document.getElementById('welcomeName')) {
    await loadApp();
  }
}

initializeApp();
