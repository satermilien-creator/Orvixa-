function getUser(){return JSON.parse(localStorage.getItem('orvixaUser')||'{"name":"Founder","email":"you@email.com"}')}function setUser(user){localStorage.setItem('orvixaUser',JSON.stringify(user))}function demoSignup(){const name=document.getElementById('name')?.value||'Founder';const email=document.getElementById('email')?.value||'you@email.com';setUser({name,email});window.location.href='app.html'}function demoLogin(){const email=document.getElementById('email')?.value||'you@email.com';setUser({name:'Founder',email});window.location.href='app.html'}function logout(){window.location.href='index.html'}const navItems=document.querySelectorAll('.navitem');const pages=document.querySelectorAll('.page');const pageTitle=document.getElementById('pageTitle');function showPage(page){pages.forEach(p=>p.classList.remove('visible'));document.getElementById(page).classList.add('visible');navItems.forEach(n=>n.classList.toggle('active',n.dataset.page===page));pageTitle.textContent=page.charAt(0).toUpperCase()+page.slice(1);if(page==='projects')renderProjects()}navItems.forEach(item=>{if(item.dataset.page)item.addEventListener('click',()=>showPage(item.dataset.page))});function startCreation(type){showPage('director');const typeEl=document.getElementById('type');if([...typeEl.options].some(o=>o.value===type)){typeEl.value=type}else{typeEl.value='Video'}document.getElementById('idea').value=`Create a ${type.toLowerCase()} about `;document.getElementById('idea').focus()}let latestProject='';function generateProject(){const type=document.getElementById('type').value;const idea=document.getElementById('idea').value||'Create a motivational video about healing one day at a time.';const audience=document.getElementById('audience').value;const platform=document.getElementById('platform').value;const goal=document.getElementById('goal').value;const style=document.getElementById('style').value;const length=document.getElementById('length').value;const language=document.getElementById('language').value;latestProject=`✨ ORVIXA PROJECT PACKAGE

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
In the real version, this will generate AI images, voices, and video assets.`;document.getElementById('output').textContent=latestProject}function saveProject(){if(!latestProject){generateProject()}const existing=JSON.parse(localStorage.getItem('orvixaProjects')||'[]');const type=document.getElementById('type')?.value||'Project';existing.unshift({title:type+' Project',date:new Date().toLocaleString(),body:latestProject});localStorage.setItem('orvixaProjects',JSON.stringify(existing.slice(0,12)));renderProjects();updateUsage();alert('Project saved.')}function renderProjects(){const saved=document.getElementById('savedProjects');const recent=document.getElementById('recentProjects');const projects=JSON.parse(localStorage.getItem('orvixaProjects')||'[]');const html=projects.length?projects.map(p=>`<div class="saved-card"><b>${p.title}</b><p>${p.date}</p><small>${p.body.slice(0,120)}...</small></div>`).join(''):'<p>No saved projects yet. Create one in AI Director.</p>';if(saved)saved.innerHTML=html;if(recent)recent.innerHTML=projects.length?projects.slice(0,3).map(p=>`<div class="project">${p.title}<span>Saved</span></div>`).join(''):'<div class="project">No projects yet <span>New</span></div>'}function updateUsage(){const usage=document.getElementById('usageText');if(!usage)return;const projects=JSON.parse(localStorage.getItem('orvixaProjects')||'[]');usage.textContent=`${Math.min(projects.length,5)} / 5 projects used`}function saveSettings(){const name=document.getElementById('settingName').value;const email=document.getElementById('settingEmail').value;setUser({name,email});loadApp();alert('Settings saved.')}function loadApp(){const user=getUser();const welcome=document.getElementById('welcomeName');const avatar=document.getElementById('avatar');const sn=document.getElementById('settingName');const se=document.getElementById('settingEmail');if(welcome)welcome.textContent=`Welcome back, ${user.name||'Founder'} 👋`;if(avatar)avatar.textContent=(user.name||'F')[0].toUpperCase();if(sn)sn.value=user.name||'Founder';if(se)se.value=user.email||'you@email.com';renderProjects();updateUsage()}loadApp();