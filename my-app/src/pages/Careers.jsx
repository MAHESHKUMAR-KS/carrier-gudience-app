import React, { useEffect, useMemo, useState } from 'react';

function Careers() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer / Developer');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [plan, setPlan] = useState(null);
  const [completed, setCompleted] = useState({});

  // Project-defined Target Roles (grouped list, flattened to titles)
  const fallbackRoles = useMemo(() => ([
    // 1. Software & Application Development
    { title: 'Software Engineer / Developer' },
    { title: 'Full Stack Developer' },
    { title: 'Backend Developer' },
    { title: 'Frontend Developer' },
    { title: 'Mobile App Developer (Android/iOS)' },
    { title: 'Desktop Application Developer' },
    { title: 'Performance Engineer' },
    { title: 'Compiler Engineer' },
    { title: 'Application Support Engineer' },
    { title: 'API Developer' },

    // 2. Systems, Hardware & Embedded
    { title: 'System Software Engineer' },
    { title: 'Operating System Developer' },
    { title: 'Embedded Systems Engineer' },
    { title: 'Firmware Engineer' },
    { title: 'Real-Time Systems Engineer' },
    { title: 'Hardware-Software Integration Engineer' },
    { title: 'Device Driver Developer' },
    { title: 'Robotics Software Engineer' },
    { title: 'IoT Developer' },
    { title: 'Edge Computing Engineer' },

    // 3. Data, AI & Machine Learning
    { title: 'Data Engineer' },
    { title: 'Machine Learning Engineer' },
    { title: 'Data Scientist' },
    { title: 'AI/Deep Learning Engineer' },
    { title: 'Computer Vision Engineer' },
    { title: 'Natural Language Processing (NLP) Engineer' },
    { title: 'Reinforcement Learning Engineer' },
    { title: 'Big Data Developer (Hadoop/Spark)' },
    { title: 'Predictive Analytics Specialist' },
    { title: 'Simulation & Modeling Engineer' },

    // 4. Security & Networking
    { title: 'Cybersecurity Analyst / Engineer' },
    { title: 'Ethical Hacker / Penetration Tester' },
    { title: 'Network Engineer' },
    { title: 'Protocol Engineer' },
    { title: 'Cryptography Engineer' },
    { title: 'Blockchain Security Specialist' },
    { title: 'Telecom Software Engineer' },
    { title: 'Security Researcher' },
    { title: 'Cloud Security Engineer' },
    { title: 'Firewall & IDS/IPS Specialist' },

    // 5. Cloud, DevOps & Infrastructure
    { title: 'DevOps Engineer' },
    { title: 'Cloud Engineer (AWS/Azure/GCP)' },
    { title: 'Site Reliability Engineer (SRE)' },
    { title: 'CI/CD Pipeline Engineer' },
    { title: 'Distributed Systems Engineer' },
    { title: 'High-Performance / Parallel Computing Engineer' },
    { title: 'Database Administrator / Engineer' },
    { title: 'Systems Architect' },
    { title: 'Virtualization / Containerization Engineer (Docker/Kubernetes)' },
    { title: 'Cloud-Native Application Developer' },

    // 6. Emerging & Interdisciplinary Roles
    { title: 'Blockchain Developer / Smart Contract Engineer' },
    { title: 'Quantum Computing Researcher' },
    { title: 'AR/VR Developer' },
    { title: 'Augmented Intelligence Engineer' },
    { title: 'Game Developer (Unity/Unreal Engine)' },
    { title: 'Simulation & Scientific Computing Specialist' },
    { title: 'Autonomous Systems Engineer (Self-driving cars, drones)' },
    { title: 'Human-Computer Interaction Engineer' },
    { title: 'Edge AI Developer' },
    { title: 'IoT Security Engineer' },
  ]), []);

  // Use project-defined roles only; bypass API
  useEffect(() => {
    setLoading(true);
    setRoles(fallbackRoles);
    setError('');
    setLoading(false);
  }, [fallbackRoles]);

  // Ensure targetRole is always a valid option from roles
  useEffect(() => {
    if (roles.length && !roles.find(r => r.title === targetRole)) {
      setTargetRole(roles[0].title);
    }
  }, [roles]);

  useEffect(() => {
    if (roles.length && !roles.find(r => r.title === targetRole)) {
      // keep custom role; do not overwrite if user typed custom
    }
  }, [roles, targetRole]);

  // On role change: do NOT auto-load plan. Clear plan; restore progress only.
  useEffect(() => {
    try {
      const safeTitle = (targetRole || '').trim() || 'Custom Role';
      const saved = localStorage.getItem(`career-plan:${safeTitle}`);
      // Always clear any visible plan; require explicit Generate button click
      setPlan(null);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.completed) setCompleted(parsed.completed);
        if (parsed?.selectedSkills) setSelectedSkills(parsed.selectedSkills);
      } else {
        setCompleted({});
      }
    } catch (e) {
      // ignore corrupt storage
      setPlan(null);
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

    // Core categories by keywords
    if (name.includes('frontend')) return ['HTML/CSS', 'JavaScript', 'React', 'Git', 'REST APIs', 'Testing'];
    if (name.includes('backend')) return ['Node.js/Express', 'Databases (SQL/NoSQL)', 'Auth', 'Testing', 'Docker'];
    if (name.includes('full')) return ['React', 'Node/Express', 'MongoDB/Postgres', 'Git/GitHub', 'REST/HTTP', 'Testing'];
    if (name.includes('mobile') || name.includes('android') || name.includes('ios')) return ['Kotlin/Swift', 'Flutter or React Native', 'Mobile UI/UX', 'REST APIs', 'SQLite/Room/CoreData', 'Testing'];
    if (name.includes('desktop')) return ['Electron or .NET/WPF/Qt', 'OS Integration', 'Packaging/Installers', 'Testing', 'CI/CD'];
    if (name.includes('performance')) return ['Profiling (CPU/Memory)', 'Concurrency', 'Caching', 'Asynchronous Patterns', 'Benchmarking'];
    if (name.includes('compiler')) return ['C/C++', 'Compilers (LLVM/Clang)', 'Parsing/Lexing', 'IR/Optimization', 'Code Generation'];
    if (name.includes('support')) return ['Troubleshooting', 'Scripting (Python/Bash)', 'Monitoring/Logging', 'Incident Management', 'Customer Communication'];
    if (name.includes('api')) return ['REST/HTTP', 'OpenAPI/Swagger', 'Auth (OAuth2/JWT)', 'Rate Limiting/Caching', 'Testing (Postman)'];

    // Systems, Hardware & Embedded
    if (name.includes('system software') || name.includes('operating system')) return ['C/C++', 'OS Concepts', 'Memory Management', 'Concurrency', 'Kernel/User Space'];
    if (name.includes('embedded') || name.includes('firmware') || name.includes('real-time')) return ['C/C++', 'RTOS', 'Microcontrollers', 'UART/I2C/SPI', 'Interrupts/Timers'];
    if (name.includes('driver')) return ['C', 'Kernel Modules', 'PCIe/USB/Network Drivers', 'Debugging (GDB)'];
    if (name.includes('robot')) return ['ROS/ROS2', 'C++/Python', 'Sensors/Actuators', 'Localization/Control', 'Simulation (Gazebo)'];
    if (name.includes('iot') && !name.includes('security')) return ['MQTT', 'IoT Platforms (AWS IoT/Azure IoT)', 'Edge Compute', 'Device Provisioning', 'Low-power Networking'];
    if (name.includes('edge computing')) return ['Docker', 'Edge Frameworks', 'Message Queues', 'Streaming (Kafka)'];

    // Data, AI & ML
    if (name.includes('data engineer')) return ['SQL', 'ETL/ELT', 'Airflow', 'Spark', 'Data Modeling', 'Cloud Warehouses (BigQuery/Redshift)'];
    if (name.includes('machine learning') || name.includes('ml engineer')) return ['Python', 'NumPy/Pandas', 'Scikit-learn', 'TensorFlow/PyTorch', 'ML Ops', 'Experiment Tracking'];
    if (name.includes('data scientist')) return ['Statistics', 'Python', 'Pandas', 'Visualization (Matplotlib/Seaborn)', 'ML Fundamentals', 'Communication'];
    if (name.includes('deep learning') || name.includes('ai/')) return ['PyTorch/TensorFlow', 'CNN/RNN/Transformers', 'GPU Basics', 'Data Pipelines'];
    if (name.includes('computer vision')) return ['OpenCV', 'Image Processing', 'CNNs', 'Object Detection', 'Augmentation'];
    if (name.includes('nlp') || name.includes('natural language')) return ['Tokenization', 'Word Embeddings', 'Transformers', 'RAG/LLMs'];
    if (name.includes('reinforcement')) return ['Gymnasium', 'Policy Gradients/DQN', 'Simulation', 'Evaluation'];
    if (name.includes('big data')) return ['Hadoop', 'Spark', 'Kafka', 'Hive', 'Data Lakes'];
    if (name.includes('predictive')) return ['Statistics', 'Feature Engineering', 'Model Evaluation', 'Time Series'];
    if (name.includes('simulation') && name.includes('model')) return ['Simulation Tools', 'Numerical Methods', 'SciPy', 'Visualization'];

    // Security & Networking
    if (name.includes('cybersecurity')) return ['OWASP Top 10', 'Threat Modeling', 'Secure Coding', 'Burp Suite/Nmap', 'SIEM Basics'];
    if (name.includes('penetration') || name.includes('ethical')) return ['Kali Linux', 'Metasploit', 'Recon/Exploitation', 'Reporting'];
    if (name.includes('network engineer')) return ['TCP/IP', 'Routing/Switching', 'Firewalls', 'Monitoring'];
    if (name.includes('protocol')) return ['RFCs', 'Protocol Design', 'State Machines', 'WireShark'];
    if (name.includes('cryptography')) return ['Crypto Primitives', 'Key Management', 'TLS', 'PKI'];
    if (name.includes('blockchain security')) return ['Smart Contract Security', 'Common Vulnerabilities', 'Auditing'];
    if (name.includes('telecom')) return ['5G/4G', 'SIP/VoIP', 'Network Protocols'];
    if (name.includes('security researcher')) return ['Reverse Engineering', 'Exploit Development', 'Sandboxing', 'Responsible Disclosure'];
    if (name.includes('cloud security')) return ['CSPM', 'IAM', 'Network Security Groups', 'Secrets Management'];
    if (name.includes('ids') || name.includes('ips') || name.includes('firewall')) return ['Snort/Suricata', 'Rule Writing', 'Traffic Analysis'];

    // Cloud, DevOps & Infra
    if (name.includes('devops')) return ['Linux', 'Docker', 'CI/CD', 'Kubernetes', 'Terraform', 'Monitoring'];
    if (name.includes('cloud engineer')) return ['AWS/Azure/GCP', 'IAM', 'VPC/Networking', 'Storage/Compute', 'IaC'];
    if (name.includes('reliability') || name.includes('sre')) return ['SLI/SLO/SLA', 'Observability', 'Incident Response', 'Capacity Planning'];
    if (name.includes('pipeline')) return ['Jenkins/GitHub Actions', 'Artifact Repos', 'Testing/Quality Gates'];
    if (name.includes('distributed')) return ['Consistency/Partitioning', 'Messaging (Kafka/RabbitMQ)', 'Caching'];
    if (name.includes('high-performance') || name.includes('parallel')) return ['MPI/OpenMP', 'CUDA', 'Vectorization'];
    if (name.includes('database administrator') || name.includes('dba') || name.includes('database')) return ['PostgreSQL/MySQL', 'Indexing/Query Tuning', 'Replication/Backup', 'Security'];
    if (name.includes('architect')) return ['System Design', 'Scalability', 'Resilience', 'Cost Optimization'];
    if (name.includes('virtualization') || name.includes('containerization') || name.includes('kubernetes')) return ['Docker', 'Kubernetes', 'Helm', 'Service Mesh'];
    if (name.includes('cloud-native')) return ['12-Factor Apps', 'Microservices', 'Observability', 'DevEx'];

    // Emerging & Interdisciplinary
    if (name.includes('blockchain developer') || name.includes('smart contract')) return ['Solidity', 'Web3.js/ethers.js', 'Smart Contract Patterns', 'Testing (Hardhat)'];
    if (name.includes('quantum')) return ['Qiskit', 'Quantum Algorithms', 'Linear Algebra'];
    if (name.includes('ar/') || name.includes('vr') || name.includes('xr') || name.includes('ar/vr')) return ['Unity/C#', 'Unreal Engine', '3D Math', 'Optimization'];
    if (name.includes('augmented intelligence')) return ['Human-in-the-loop', 'Explainable AI', 'Feedback Loops'];
    if (name.includes('game')) return ['Unity/Unreal', 'Game Loops', 'Physics', 'Assets/Pipelines'];
    if (name.includes('autonomous')) return ['Sensors', 'SLAM', 'Path Planning', 'Simulation'];
    if (name.includes('human-computer interaction') || name.includes('hci')) return ['UX Research', 'Prototyping', 'Usability Testing'];
    if (name.includes('edge ai')) return ['ONNX/TensorRT', 'Quantization', 'Deployment on Edge'];
    if (name.includes('iot security')) return ['Secure Provisioning', 'Device Identity', 'TLS/Certificates', 'Firmware Security'];

    // Generic fallback
    if (name.includes('data') || name.includes('analyt')) return ['Excel', 'SQL', 'Python', 'Pandas', 'Data Visualization', 'Statistics'];
    return ['Problem Solving', 'Git', 'APIs', 'Testing', 'Documentation'];
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

  const generatePlan = (roleTitleOverride) => {
    const safeTitle = (roleTitleOverride ?? targetRole ?? '').trim() || 'Custom Role';
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Career Paths</h1>
      <p className="text-gray-600 mb-6">Select a role, mark skills you already have, and generate a 60‑day roadmap.</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
            <select
              value={roles.find(r => r.title === targetRole) ? targetRole : (roles[0]?.title || '')}
              onChange={(e) => setTargetRole(e.target.value)}
              className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
            >
              {roles.map((r) => (
                <option key={r.title} value={r.title}>{r.title}</option>
              ))}
            </select>
            {error && <p className="text-xs text-yellow-700 mt-2">{error}</p>}
            <p className="text-xs text-gray-500 mt-2">Tip: Choose a role from the dropdown, then click Generate to build your 60‑day roadmap.</p>
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

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={() => generatePlan()}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={loading}
          >
            Generate 60‑Day Roadmap
          </button>
          {plan && (
            <span className="inline-flex items-center gap-3">
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
