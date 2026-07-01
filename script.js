let currentUser = null;
let currentProjects = [];
let latestProject = "";

function getSupabase() {
  return window.OrvixaSupabase || null;
}

function getUserDisplayName(user) {
  return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Founder";
}

async function demoLogin() {
  const email = document.getElementById("email")?.value || "";
  const password = document.getElementById("password")?.value || "";
  const supabase = getSupabase();

  if (!supabase) {
    alert("Supabase is not loaded.");
    return;
  }

  const { data, error } = await supabase.signIn(email, password);

  if (error) {
    alert(error.message || "Could not sign you in.");
    return;
  }

  currentUser = data?.user || null;
  window.location.href = "app.html";
}

async function demoSignup() {
  const name = document.getElementById("name")?.value || "Founder";
  const email = document.getElementById("email")?.value || "";
  const password = document.getElementById("password")?.value || "";
  const supabase = getSupabase();

  if (!supabase) {
    alert("Supabase is not loaded.");
    return;
  }

  const { data, error } = await supabase.signUp(email, password, name);

  if (error) {
    alert(error.message || "Could not create your account.");
    return;
  }

  if (data?.session) {
    window.location.href = "app.html";
  } else {
    alert("Account created. Please check your email, then sign in.");
    window.location.href = "login.html";
  }
}

async function signup() {
  return demoSignup();
}

async function logout() {
  const supabase = getSupabase();

  if (supabase) {
    await supabase.signOut();
  }

  window.location.href = "index.html";
}

const navItems = document.querySelectorAll(".navitem");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");

function showPage(page) {
  pages.forEach((p) => p.classList.remove("visible"));

  const pageElement = document.getElementById(page);
  if (pageElement) {
    pageElement.classList.add("visible");
  }

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.page === page);
  });

  if (pageTitle) {
    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);
  }

  if (page === "projects") {
    renderProjects();
  }
}

navItems.forEach((item) => {
  if (item.dataset.page) {
    item.addEventListener("click", () => showPage(item.dataset.page));
  }
});

function startCreation(type) {
  showPage("director");

  const typeEl = document.getElementById("type");
  if (typeEl) {
    const hasOption = Array.from(typeEl.options).some((option) => option.value === type);
    typeEl.value = hasOption ? type : "Video";
  }

  const ideaEl = document.getElementById("idea");
  if (ideaEl) {
    ideaEl.value = `Create a ${String(type).toLowerCase()} about healing one day at a time.`;
    ideaEl.focus();
  }
}

function generateProject() {
  const type = document.getElementById("type")?.value || "Video";
  const idea = document.getElementById("idea")?.value || "Create a motivational video about healing one day at a time.";
  const audience = document.getElementById("audience")?.value || "Everyone";
  const platform = document.getElementById("platform")?.value || "Instagram";
  const goal = document.getElementById("goal")?.value || "Inspire";
  const style = document.getElementById("style")?.value || "Cinematic";
  const length = document.getElementById("length")?.value || "30 seconds";
  const language = document.getElementById("language")?.value || "English";

  latestProject = `✨ ORVIXA PROJECT PACKAGE

1. PROJECT TYPE
${type}

2. IDEA
${idea}

3. AUDIENCE
${audience}

4. PLATFORM
${platform}

5. GOAL
${goal}

6. STYLE
${style}

7. LENGTH
${length}

8. LANGUAGE
${language}

9. SCRIPT
Hook: "One idea can become something powerful."
Scene 1: Open with a strong emotional or visual moment.
Scene 2: Introduce the main idea clearly.
Scene 3: Show the transformation, solution, or value.
Scene 4: End with a call-to-action.

10. VISUAL PLAN
- Shot 1: Cinematic opening scene
- Shot 2: Main subject or product moment
- Shot 3: Emotional transformation or result
- Shot 4: Logo or CTA ending

11. CAPTION
Turn your idea into something real. No prompts. Just create with Orvixa.

12. HASHTAGS
#Orvixa #NoPromptsJustCreate #AIContent #CreatorTools #AIVideo #AIImages

13. NEXT STEPS
In the real version, this will generate AI images, voices, and video assets.`;

  const output = document.getElementById("output");
  if (output) {
    output.textContent = latestProject;
  }
}

async function saveProject() {
  if (!latestProject) {
    alert("Generate a project first.");
    return;
  }

  const supabase = getSupabase();
  const type = document.getElementById("type")?.value || "Project";

  if (!supabase) {
    alert("Supabase is not loaded.");
    return;
  }

  const { error } = await supabase.saveProject({
    title: `${type} Project`,
    body: latestProject
  });

  if (error) {
    alert(error.message || "Could not save the project.");
    return;
  }

  await renderProjects();
  updateUsage();
  alert("Project saved.");
}

async function renderProjects() {
  const saved = document.getElementById("savedProjects");
  const recent = document.getElementById("recentProjects");
  const supabase = getSupabase();

  if (!supabase) {
    if (saved) {
      saved.innerHTML = "<p>No saved projects yet. Create one in AI Director.</p>";
    }

    if (recent) {
      recent.innerHTML = '<div class="project">No projects yet <span>New</span></div>';
    }

    return;
  }

  const { data, error } = await supabase.loadProjects();

  if (error) {
    console.error(error);
  }

  currentProjects = data || [];

  const html = currentProjects.length
    ? currentProjects.map((project) => {
        const title = project.title || "Untitled Project";
        const created = project.created_at ? new Date(project.created_at).toLocaleString() : "";
        const preview = (project.body || "").slice(0, 140);

        return (
          '<div class="saved-card">' +
          "<b>" + title + "</b>" +
          "<p>" + created + "</p>" +
          "<small>" + preview + "...</small>" +
          "</div>"
        );
      }).join("")
    : "<p>No saved projects yet. Create one in AI Director.</p>";

  if (saved) {
    saved.innerHTML = html;
  }

  if (recent) {
    recent.innerHTML = currentProjects.length
      ? currentProjects.slice(0, 3).map((project) => {
          const title = project.title || "Untitled Project";
          return '<div class="project">' + title + "<span>Saved</span></div>";
        }).join("")
      : '<div class="project">No projects yet <span>New</span></div>';
  }

  updateUsage();
}

function updateUsage() {
  const usage = document.getElementById("usageText");

  if (!usage) {
    return;
  }

  usage.textContent = `${Math.min(currentProjects.length, 5)} / 5 projects used`;
}

async function saveSettings() {
  const name = document.getElementById("settingName")?.value || "";
  const email = document.getElementById("settingEmail")?.value || "";
  const supabase = getSupabase();

  if (!supabase) {
    alert("Supabase is not loaded.");
    return;
  }

  const { error } = await supabase.updateProfile(name, email);

  if (error) {
    alert(error.message || "Could not save settings.");
    return;
  }

  await loadApp();
  alert("Settings saved.");
}

async function loadApp() {
  const supabase = getSupabase();

  if (supabase) {
    const { user } = await supabase.getCurrentUser();
    currentUser = user || null;

    if (currentUser && (window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("signup.html"))) {
      window.location.href = "app.html";
      return;
    }

    if (!currentUser && window.location.pathname.endsWith("app.html")) {
      window.location.href = "login.html";
      return;
    }

    if (supabase.supabase?.auth?.onAuthStateChange) {
      supabase.supabase.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
      });
    }
  }

  const welcome = document.getElementById("welcomeName");
  const avatar = document.getElementById("avatar");
  const settingName = document.getElementById("settingName");
  const settingEmail = document.getElementById("settingEmail");

  if (welcome) {
    const name = getUserDisplayName(currentUser);
    welcome.textContent = `Welcome back, ${name} 👋`;
  }

  if (avatar) {
    const name = getUserDisplayName(currentUser);
    avatar.textContent = name.charAt(0).toUpperCase();
  }

  if (settingName) {
    settingName.value = getUserDisplayName(currentUser);
  }

  if (settingEmail) {
    settingEmail.value = currentUser?.email || "";
  }

  if (document.getElementById("savedProjects") || document.getElementById("recentProjects")) {
    await renderProjects();
  }
}

function initializeApp() {
  loadApp();
}

window.demoLogin = demoLogin;
window.demoSignup = demoSignup;
window.signup = signup;
window.logout = logout;
window.showPage = showPage;
window.startCreation = startCreation;
window.generateProject = generateProject;
window.saveProject = saveProject;
window.renderProjects = renderProjects;
window.saveSettings = saveSettings;

initializeApp();