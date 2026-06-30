(function () {
  const supabaseUrl = window.NEXT_PUBLIC_SUPABASE_URL || window.__NEXT_PUBLIC_SUPABASE_URL__ || 'https://zrmazgfwfkrunximbvzt.supabase.co';
  const supabaseAnonKey = window.NEXT_PUBLIC_SUPABASE_ANON_KEY || window.__NEXT_PUBLIC_SUPABASE_ANON_KEY__ || 'sb_publishable_4GBc62cUulYp7Arsh_N7Gw_D9v4VwOS';

  if (!window.supabase) {
    console.warn('Supabase SDK was not loaded. Make sure the CDN script is available before supabase.js.');
    window.OrvixaSupabase = {
      supabase: null,
      getCurrentUser: async () => ({ user: null, error: null }),
      signUp: async () => ({ data: null, error: new Error('Supabase SDK not loaded.') }),
      signIn: async () => ({ data: null, error: new Error('Supabase SDK not loaded.') }),
      signOut: async () => ({ error: new Error('Supabase SDK not loaded.') }),
      saveProject: async () => ({ data: null, error: new Error('Supabase SDK not loaded.') }),
      loadProjects: async () => ({ data: [], error: null }),
      updateProfile: async () => ({ data: null, error: new Error('Supabase SDK not loaded.') })
    };
    return;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before loading the app.');
  }

  const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });

  async function getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { user: session?.user || null, error };
  }

  async function signUp(email, password, name) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || ''
        }
      }
    });
  }

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    return supabase.auth.signOut();
  }

  async function saveProject(project) {
    const { user, error: userError } = await getCurrentUser();
    if (userError || !user) {
      return { data: null, error: userError || new Error('Please sign in to save projects.') };
    }

    return supabase
      .from('projects')
      .insert([{ user_id: user.id, title: project.title || 'Project', body: project.body || '', created_at: new Date().toISOString() }])
      .select('*')
      .single();
  }

  async function loadProjects() {
    const { user, error: userError } = await getCurrentUser();
    if (userError || !user) {
      return { data: [], error: userError || null };
    }

    return supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
  }

  async function updateProfile(name, email) {
    const updates = { data: { full_name: name || '' } };
    if (email) {
      updates.email = email;
    }
    return supabase.auth.updateUser(updates);
  }

  window.OrvixaSupabase = {
    supabase,
    getCurrentUser,
    signUp,
    signIn,
    signOut,
    saveProject,
    loadProjects,
    updateProfile
  };
})();
