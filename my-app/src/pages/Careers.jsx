import React, { useEffect, useMemo, useState } from 'react';

function Careers() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [plan, setPlan] = useState(null);
  const [completed, setCompleted] = useState({});

  const fallbackRoles = useMemo(() => ([
    {
      title: 'Frontend Developer',
      description: 'Build rich, responsive UIs with modern JavaScript frameworks.',
      degreeRequired: 'Any (CS preferred)',
      careerPath: 'Intern → Junior → Mid → Senior → Lead',
      skillsRequired: ['HTML/CSS', 'JavaScript', 'React', 'Git', 'REST APIs', 'Testing']
    },
    {
      title: 'Backend Developer',
      description: 'Design APIs, databases, and services that scale.',
      degreeRequired: 'Any (CS preferred)',
      careerPath: 'Intern → Junior → Mid → Senior → Lead',
      skillsRequired: ['Node.js/Express', 'Databases (SQL/NoSQL)', 'Auth', 'Testing', 'Docker']
    },
    {
      title: 'Full-Stack Developer',
      description: 'Deliver end-to-end features across frontend and backend.',
      degreeRequired: 'Any (CS preferred)',
      careerPath: 'Intern → Junior → Mid → Senior → Lead',
      skillsRequired: ['React', 'Node/Express', 'MongoDB/Postgres', 'Git/GitHub', 'REST/HTTP', 'Testing']
    },
    {
      title: 'Data/ML Engineer',
      description: 'Build data pipelines and ML-backed applications.',
      degreeRequired: 'Any (Math/CS preferred)',
      careerPath: 'Intern → Junior → Mid → Senior → Lead',
      skillsRequired: ['Python', 'Pandas/NumPy', 'SQL', 'Scikit-learn/TF', 'APIs', 'Cloud Basics']
    }
  ]), []);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/careers', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load careers');
        const data = await res.json();
        const mapped = Array.isArray(data) ? data : [];
        setRoles(mapped.length ? mapped : fallbackRoles);
        if (!mapped.length) setError('Using default career set.');
      } catch (e) {
        setRoles(fallbackRoles);
        setError('Could not reach server. Using default career set.');
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, [fallbackRoles]);

  useEffect(() => {
    if (roles.length && !roles.find(r => r.title === targetRole)) {
      // keep custom role; do not overwrite if user typed custom
    }
  }, [roles, targetRole]);

  // Load any saved progress/plan from localStorage when role changes
  useEffect(() => {
    try {
      const safeTitle = (targetRole || '').trim() || 'Custom Role';
      const saved = localStorage.getItem(`career-plan:${safeTitle}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.plan) setPlan(parsed.plan);
        if (parsed?.completed) setCompleted(parsed.completed);
        if (parsed?.selectedSkills) setSelectedSkills(parsed.selectedSkills);
      } else {
        setCompleted({});
      }
    } catch (e) {
      // ignore corrupt storage
    }
  }, [targetRole]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    setSelectedSkills((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setNewSkill('');
  };

  const removeSkill = (skill) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const getSuggestedSkillsFor = (roleName) => {
    const name = (roleName || '').toLowerCase();
    if (name.includes('data') || name.includes('analys')) {
      return ['Excel', 'SQL', 'Python', 'Pandas', 'Data Visualization', 'Statistics'];
    }
    if (name.includes('ml') || name.includes('machine')) {
      return ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow/PyTorch', 'Math/Stats'];
    }
    if (name.includes('front')) {
      return ['HTML/CSS', 'JavaScript', 'React', 'Git', 'REST APIs', 'Testing'];
    }
    if (name.includes('back')) {
      return ['Node.js/Express', 'Databases (SQL/NoSQL)', 'Auth', 'Testing', 'Docker'];
    }
    if (name.includes('full')) {
      return ['React', 'Node/Express', 'MongoDB/Postgres', 'Git/GitHub', 'REST/HTTP', 'Testing'];
    }
    if (name.includes('cloud') || name.includes('devops')) {
      return ['Linux', 'Docker', 'CI/CD', 'AWS Basics', 'IaC (Terraform)', 'Networking'];
    }
    if (name.includes('ar') || name.includes('vr') || name.includes('xr')) {
      return ['Unity/C#', 'Unreal Engine', 'Three.js/WebXR', '3D Math', 'Blender/3D Assets', 'Optimization'];
    }
    return ['Problem Solving', 'Git', 'APIs', 'Testing', 'Documentation'];
  };

  const generatePlan = () => {
    const safeTitle = (targetRole || '').trim() || 'Custom Role';
    const found = roles.find((r) => r.title === safeTitle);
    const role = found || { title: safeTitle, skillsRequired: getSuggestedSkillsFor(safeTitle) };
    const suggested = role.skillsRequired && role.skillsRequired.length ? role.skillsRequired : getSuggestedSkillsFor(safeTitle);
    const core = selectedSkills.length ? Array.from(new Set([...selectedSkills, ...suggested])) : suggested;
    const missing = core.filter((s) => !selectedSkills.includes(s));

    const dayRange = (start, end) => `${start}–${end}`;

    const makeItems = (skills) => skills.map((s) => ({
      title: s,
      action: `Complete 2h tutorial + build 1 mini feature using ${s}`,
      resource: suggestedResource(s)
    }));

    const planObj = {
      role: role.title,
      summary: `60-day plan to land a junior ${role.title} role. Focus on missing skills first, then build and deploy.`,
      segments: [
        {
          label: `Days ${dayRange(1, 14)} — Fundamentals & Setup`,
          tasks: [
            ...makeItems(missing.slice(0, 2).length ? missing.slice(0, 2) : core.slice(0, 2)),
            { title: 'Project Setup', action: 'Create portfolio repo + CI (GitHub Actions) + Prettier/ESLint', resource: { label: 'GitHub Actions Starter', url: 'https://docs.github.com/actions' } },
          ]
        },
        {
          label: `Days ${dayRange(15, 30)} — Build Project #1`,
          tasks: [
            { title: 'CRUD App', action: 'Build a CRUD app with auth and tests', resource: { label: 'Testing Library', url: 'https://testing-library.com/' } },
            { title: 'Deploy', action: 'Deploy to Vercel/Render; add README with screenshots', resource: { label: 'Vercel Docs', url: 'https://vercel.com/docs' } },
          ]
        },
        {
          label: `Days ${dayRange(31, 45)} — Project #2 (Your App Upgrade)`,
          tasks: [
            { title: 'Feature', action: 'Add one advanced feature (search, caching, analytics)', resource: { label: 'OWASP Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/' } },
            { title: 'Metrics', action: 'Add logging, measure perf; create demo video (2–3 min)', resource: { label: 'Lighthouse', url: 'https://developer.chrome.com/docs/lighthouse' } },
          ]
        },
        {
          label: `Days ${dayRange(46, 60)} — Apply & Interview`,
          tasks: [
            { title: 'Resume', action: 'Write role-aligned bullets based on projects with metrics', resource: { label: 'Resume Guide', url: 'https://www.theforage.com/blog/careers/resume-tips' } },
            { title: 'Interview', action: 'Daily 2 LeetCode (or system design notes) + mock interview per week', resource: { label: 'LeetCode', url: 'https://leetcode.com/' } },
          ]
        }
      ]
    };

    setPlan(planObj);
    // reset completion when a new plan is generated
    setCompleted({});
    // persist
    persistPlan(planObj, selectedSkills, {}, role.title);
  };

  const suggestedResource = (skill) => {
    const map = {
      'HTML/CSS': { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
      'JavaScript': { label: 'You Don’t Know JS', url: 'https://github.com/getify/You-Dont-Know-JS' },
      'React': { label: 'React Docs (Beta)', url: 'https://react.dev/learn' },
      'Testing': { label: 'Testing Library', url: 'https://testing-library.com/' },
      'Git': { label: 'Pro Git', url: 'https://git-scm.com/book/en/v2' },
      'REST APIs': { label: 'REST Best Practices', url: 'https://restfulapi.net/' },
      'Node.js/Express': { label: 'Express Guide', url: 'https://expressjs.com/' },
      'Databases (SQL/NoSQL)': { label: 'SQLBolt', url: 'https://sqlbolt.com/' },
      'Auth': { label: 'Auth Patterns', url: 'https://auth0.com/docs' },
      'Docker': { label: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/' },
      'MongoDB/Postgres': { label: 'MongoDB Docs', url: 'https://www.mongodb.com/docs/' },
      'Git/GitHub': { label: 'GitHub Docs', url: 'https://docs.github.com/get-started' },
      'REST/HTTP': { label: 'HTTP Guide', url: 'https://developer.mozilla.org/docs/Web/HTTP' },
      'Python': { label: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/' },
      'Pandas/NumPy': { label: 'Pandas Docs', url: 'https://pandas.pydata.org/docs/' },
      'SQL': { label: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/' },
      'Scikit-learn/TF': { label: 'Scikit-learn', url: 'https://scikit-learn.org/stable/' },
      'APIs': { label: 'FastAPI', url: 'https://fastapi.tiangolo.com/' },
      'Cloud Basics': { label: 'AWS Cloud Practitioner', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' }
    };
    // Extended mappings for custom roles
    const extended = {
      'Excel': { label: 'Microsoft Learn: Excel', url: 'https://learn.microsoft.com/training/browse/?products=excel' },
      'Data Visualization': { label: 'Tableau Training', url: 'https://www.tableau.com/learn/training' },
      'Statistics': { label: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability' },
      'NumPy': { label: 'NumPy Docs', url: 'https://numpy.org/doc/' },
      'TensorFlow/PyTorch': { label: 'TensorFlow Get Started', url: 'https://www.tensorflow.org/get_started' },
      'Linux': { label: 'Linux Journey', url: 'https://linuxjourney.com/' },
      'CI/CD': { label: 'GitHub Actions: Learn', url: 'https://docs.github.com/actions/learn-github-actions' },
      'AWS Basics': { label: 'AWS Cloud Practitioner', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' },
      'IaC (Terraform)': { label: 'Terraform Tutorials', url: 'https://developer.hashicorp.com/terraform/tutorials' },
      'Networking': { label: 'Cloudflare Learning Center', url: 'https://www.cloudflare.com/learning/network-layer/what-is-a-computer-network/' }
    };
    // AR/VR/XR resources
    const xr = {
      'Unity/C#': { label: 'Unity Learn', url: 'https://learn.unity.com/' },
      'Unreal Engine': { label: 'Unreal Online Learning', url: 'https://dev.epicgames.com/community/learning' },
      'Three.js/WebXR': { label: 'Three.js Fundamentals', url: 'https://threejs.org/manual/' },
      '3D Math': { label: '3D Math Primer', url: 'https://gamemath.com/book/intro.html' },
      'Blender/3D Assets': { label: 'Blender Manual', url: 'https://docs.blender.org/manual/en/latest/' },
      'Optimization': { label: 'Unity Optimization Guide', url: 'https://docs.unity3d.com/Manual/BestPracticeGuides.html' }
    };
    return map[skill] || extended[skill] || xr[skill] || { label: 'MDN Search', url: 'https://developer.mozilla.org/search' };
  };

  const persistPlan = (planToSave, skills, completedMap, roleTitleOverride) => {
    try {
      const roleKey = (roleTitleOverride || targetRole || '').trim() || 'Custom Role';
      localStorage.setItem(
        `career-plan:${roleKey}`,
        JSON.stringify({ plan: planToSave, selectedSkills: skills, completed: completedMap })
      );
    } catch (e) {
      // storage may be unavailable; fail silently
    }
  };

  const toggleTaskDone = (segmentIdx, taskIdx) => {
    const key = `${segmentIdx}:${taskIdx}`;
    setCompleted((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      persistPlan(plan, selectedSkills, next, plan?.role);
      return next;
    });
  };

  const exportMarkdown = () => {
    if (!plan) return;
    const lines = [];
    lines.push(`# ${plan.role} — 60-day Roadmap`);
    lines.push('');
    lines.push(plan.summary);
    lines.push('');
    plan.segments.forEach((seg) => {
      lines.push(`## ${seg.label}`);
      seg.tasks.forEach((t) => {
        const res = t.resource ? ` ([${t.resource.label}](${t.resource.url}))` : '';
        lines.push(`- ${t.title}: ${t.action}${res}`);
      });
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.role.replace(/\s+/g, '-')}-roadmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Career Paths</h1>
      <p className="text-gray-600 mb-6">Select a role, mark skills you already have, and generate a 60‑day roadmap.</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Role (type your own)</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {error && <p className="text-xs text-yellow-700 mt-2">{error}</p>}
            <p className="text-xs text-gray-500 mt-2">Tip: You can still click suggestions to add skills quickly.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Skills</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter (e.g., TypeScript)"
                className="flex-1 px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button onClick={addSkill} className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900">Add</button>
            </div>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-indigo-700 hover:text-indigo-900">×</button>
                  </span>
                ))}
              </div>
            )}
            
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={generatePlan}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={loading}
          >
            Generate 60‑Day Roadmap
          </button>
          {plan && (
            <span className="inline-flex items-center gap-3 ml-4">
              <button onClick={exportMarkdown} className="text-indigo-700 hover:underline">Export Markdown</button>
              <button onClick={printPdf} className="text-indigo-700 hover:underline">Print to PDF</button>
            </span>
          )}
        </div>
      </div>

      {plan && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold mb-2">{plan.role} — Roadmap</h2>
            <p className="text-gray-600 mb-4">{plan.summary}</p>
            <div className="space-y-6">
              {plan.segments.map((seg, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{seg.label}</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-800">
                    {seg.tasks.map((t, i) => {
                      const key = `${idx}:${i}`;
                      const done = !!completed[key];
                      return (
                        <li key={i} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => toggleTaskDone(idx, i)}
                            className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <div className={done ? 'line-through text-gray-500' : ''}>
                            <span className="font-medium">{t.title}:</span> {t.action}
                            {t.resource && (
                              <>
                                {' '}
                                <a className="text-indigo-600 hover:underline" href={t.resource.url} target="_blank" rel="noreferrer">
                                  {t.resource.label}
                                </a>
                              </>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Careers;
