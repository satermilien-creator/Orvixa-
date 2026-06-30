const navItems=document.querySelectorAll('.navitem');const pages=document.querySelectorAll('.page');const pageTitle=document.getElementById('pageTitle');function showPage(page){pages.forEach(p=>p.classList.remove('visible'));document.getElementById(page).classList.add('visible');navItems.forEach(n=>n.classList.toggle('active',n.dataset.page===page));pageTitle.textContent=page.charAt(0).toUpperCase()+page.slice(1)}navItems.forEach(item=>item.addEventListener('click',()=>showPage(item.dataset.page)));function startCreation(type){showPage('director');document.getElementById('type').value=type;document.getElementById('idea').value=`Create a ${type.toLowerCase()} about `;document.getElementById('idea').focus()}let latestProject='';function generateProject(){const type=document.getElementById('type').value;const idea=document.getElementById('idea').value||'Create a motivational video about healing one day at a time.';const audience=document.getElementById('audience').value;const platform=document.getElementById('platform').value;const style=document.getElementById('style').value;const length=document.getElementById('length').value;latestProject=`✨ ORVIXA PROJECT PACKAGE

TYPE: ${type}
IDEA: ${idea}
AUDIENCE: ${audience}
PLATFORM: ${platform}
STYLE: ${style}
LENGTH: ${length}

1. CREATIVE DIRECTION
Make this feel ${style.toLowerCase()}, clear, and easy to understand for ${audience.toLowerCase()}.

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
In the real version, this will generate AI images, voices, and video assets.`;document.getElementById('output').textContent=latestProject}function saveProject(){if(!latestProject){generateProject()}const existing=JSON.parse(localStorage.getItem('orvixaProjects')||'[]');existing.unshift({title:'New AI Director Project',date:new Date().toLocaleString(),body:latestProject});localStorage.setItem('orvixaProjects',JSON.stringify(existing.slice(0,12)));renderProjects();alert('Project saved to this browser prototype.')}function renderProjects(){const box=document.getElementById('savedProjects');if(!box)return;const projects=JSON.parse(localStorage.getItem('orvixaProjects')||'[]');box.innerHTML=projects.length?projects.map(p=>`<div class="saved-card"><b>${p.title}</b><p>${p.date}</p><small>${p.body.slice(0,120)}...</small></div>`).join(''):'<p>No saved projects yet. Create one in AI Director.</p>'}renderProjects();