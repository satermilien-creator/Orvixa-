function openDirector(type){
  document.getElementById('directorPanel').scrollIntoView({behavior:'smooth'});
  document.getElementById('idea').value = `Create a ${type.toLowerCase()} about `;
  document.getElementById('idea').focus();
}

function generate(){
  const idea = document.getElementById('idea').value || "Create a motivational video about healing one day at a time.";
  const platform = document.getElementById('platform').value;
  const audience = document.getElementById('audience').value;
  const style = document.getElementById('style').value;
  const length = document.getElementById('length').value;

  const output = `✨ ORVIXA PROJECT GENERATED

Project Brief:
${idea}

Platform: ${platform}
Audience: ${audience}
Style: ${style}
Length: ${length}

SCRIPT:
Hook: "What if your next chapter starts with one small step?"
Scene 1: Soft cinematic opening with emotional music.
Scene 2: Show transformation, hope, and movement.
Scene 3: End with a powerful call-to-action.

VISUAL PROMPTS:
1. Cinematic close-up, warm light, inspiring mood.
2. Person walking forward, soft glow, hopeful atmosphere.
3. Clean title screen with bold modern text.

CAPTION:
Your healing does not have to happen all at once. One day, one step, one choice at a time. ✨

HASHTAGS:
#Orvixa #NoPromptsJustCreate #AIContent #CreatorTools #HealingJourney

NEXT:
In the real app, this button will connect to AI models to generate the script, images, voice, and video assets.`;

  document.getElementById('output').textContent = output;
}