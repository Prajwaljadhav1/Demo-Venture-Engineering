const $ = s => document.querySelector(s);
    const $$ = s => [...document.querySelectorAll(s)];
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!rm && document.documentElement.classList.contains('intro-pending')) {
      window.setTimeout(() => {
        document.documentElement.classList.add('intro-revealing');
      }, 700);
    }

    // SVG Line Drawing sequence index setup
    $$('.d').forEach((p, i) => {
      p.setAttribute('pathLength', 1);
      p.style.setProperty('--i', i);
    });

    // Append dynamic blueprint joint connection nodes
    const sv = $('.sv');
    if (sv) {
      for (const x of [100, 200, 300, 400]) {
        for (const y of [290, 200, 120]) {
          const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('cx', x);
          c.setAttribute('cy', y);
          c.setAttribute('r', 5);
          sv.appendChild(c);
        }
      }
    }

    // Sticky Navbar shadow on scroll
    const updateNavScroll = () => document.body.classList.toggle('s', window.scrollY > 30);
    window.addEventListener('scroll', updateNavScroll, { passive: true });
    updateNavScroll();

    // Mobile Navigation Drawer Toggle
    const mobileBtn = $('#mobileMenuBtn');
    const navbar = $('#navbar');
    if (mobileBtn) {
      mobileBtn.onclick = () => {
        const isOpen = navbar.classList.toggle('o');
        mobileBtn.setAttribute('aria-expanded', isOpen);
      };
    }
    $$('nav ul a').forEach(link => link.addEventListener('click', () => navbar.classList.remove('o')));

    // Subtle entrance motion as page sections enter view
    if (!rm && 'IntersectionObserver' in window) {
      const revealTargets = $$('.h .w, .services-page-hero .w, .projects-page-hero .w, .about-page-hero .w, .sc-header, .st-item, .reg-card, .t, .p-card, .fb-card, .faq-item, .service-detail-card, .about-intro-copy, .about-intro-card, .about-pillar, .about-audience-card, .home-cta-card, .services-contact, .projects-contact, .contact-info, .quote-form');
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

      revealTargets.forEach((element, index) => {
        element.classList.add('reveal-on-scroll');
        element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
        revealObserver.observe(element);
      });
    }

    // Bento Card Cursor Follower Glow
    $$('.t').forEach(card => {
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });

    // Theme Toggle (Light / Dark)
    const themeBtn = $('#themeToggle');
    const getInitialTheme = () => {
      const saved = localStorage.getItem('venture_theme');
      if (saved) return saved;
      return 'light';
    };

    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('venture_theme', theme);
    };

    setTheme(getInitialTheme());

    if (themeBtn) {
      themeBtn.onclick = () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
      };
    }

    // Number Counters & Timeline Animation
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        if (el.dataset.n) {
          const target = +el.dataset.n;
          const decimals = el.dataset.d | 0;
          const suffix = el.dataset.x || '';
          const startTime = performance.now();
          const duration = 1400;

          const tick = (now) => {
            const progress = rm ? 1 : Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * ease).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.35 });

    $$('[data-n]').forEach(el => observer.observe(el));

    // Interactive Case Study Filters
    const filterButtons = $$('.f-btn');
    const projectCards = $$('.p-card');

    filterButtons.forEach(btn => {
      btn.onclick = () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      };
    });

    // FAQ Accordion
    $$('.faq-item').forEach(item => {
      item.querySelector('.faq-q').onclick = () => {
        const isActive = item.classList.contains('active');
        $$('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      };
    });

    // Service Deep Dive Data & Modal
    const serviceData = {
      audit: {
        title: "Structural Audit & Stability Certification (Form B)",
        code: "Mandatory as per BMC / PMC / PCMC By-Laws",
        overview: "A structural audit is an overall health and performance checkup of an existing building. We evaluate load-bearing elements, assess environmental degradation, map structural distress, and issue legally binding Form B Stability Certificates.",
        deliverables: [
          "Non-destructive compressive strength profile of concrete columns and beams",
          "Carbonation depth & rebar corrosion vulnerability evaluation",
          "Deflection, structural settlement, and distress crack mapping",
          "Official Structural Stability Certificate (Form B) for Municipal submission",
          "Prioritized remedial repair plan with cost estimates"
        ],
        codes: "IS 456:2000, IS 13311, NBC 2016 Part 6"
      },
      ndt: {
        title: "Non-Destructive Testing (NDT Concrete Investigation)",
        code: "IS 516 & IS 13311 Compliant",
        overview: "Non-destructive testing inspects structural integrity without impairing the performance or serviceability of structural elements. It provides critical data on uniformity, voids, honeycomb defects, and compressive strength.",
        deliverables: [
          "Rebound Hammer test across representative columns/slabs",
          "Ultrasonic Pulse Velocity (UPV) cross-probing for internal cracks & voids",
          "Core cutting and laboratory compression crushing tests (if required)",
          "Cover meter rebar spacing and effective concrete cover determination",
          "Detailed tabular test report with strength graphs"
        ],
        codes: "IS 13311 (Part 1 & 2), IS 516:2018, ACI 228.1R"
      },
      design: {
        title: "Structural Design & Seismic Engineering",
        code: "IS 1893:2016 & IS 13920:2016",
        overview: "Full lifecycle structural engineering for residential towers, commercial complexes, and industrial PEB steel structures. We optimize steel consumption while adhering to ductile detailing and earthquake engineering safety standards.",
        deliverables: [
          "Complete 3D computer modeling and finite element seismic analysis in ETABS / STAAD",
          "Isolated, raft, or pile foundation designs based on soil geotechnical reports",
          "Full set of structural working blueprints ready for site execution",
          "Optimized Bar Bending Schedules (BBS)",
          "Periodic site inspection and bar-checking certification before casting"
        ],
        codes: "IS 456, IS 1893, IS 800 (Steel), IS 13920"
      },
      repair: {
        title: "Repair & Seismic Retrofitting Consultancy",
        code: "IS 15988:2013 Compliant",
        overview: "We identify the root mechanical or chemical trigger behind structural distress (such as chloride attack, carbonation, thermal cracking, or inadequate original detailing) and design targeted strengthening schemes.",
        deliverables: [
          "Reinforced concrete (RC) jacketing design for deficient columns",
          "Carbon Fiber Reinforced Polymer (CFRP) wrapping specifications for shear/flexure",
          "Low-viscosity epoxy injection grouting schedules for crack sealing",
          "Polymer-modified mortar (PMM) and micro-concrete specifications",
          "Technical tender document and contractor selection guidance"
        ],
        codes: "IS 15988:2013, ACI 440.2R (FRP)"
      },
      drafting: {
        title: "CAD Detailing & Bar Bending Schedules",
        code: "IS 13920 Ductile Detailing",
        overview: "Detailed engineering drawings convert engineering calculations into unambiguous site instructions, minimizing contractor errors and steel wastage.",
        deliverables: [
          "CAD reinforcement drawings with clear lap lengths and anchorage notes",
          "Beam-column joint ductile reinforcement detailing",
          "Automated Bar Bending Schedule (BBS) tables with cutting lengths",
          "Structural steel fabrication and connection drawings"
        ],
        codes: "SP 34, IS 13920:2016"
      },
      asbuilt: {
        title: "As-Built Drawing & Laser Surveying",
        code: "Digital Measured Documentation",
        overview: "For historical or aging buildings that lack original structural blueprints, we deploy laser distance meters and total station surveys to draft full as-built plans necessary for renovations or statutory permissions.",
        deliverables: [
          "Full architectural and structural column grid plans",
          "Framing layouts of beams, slabs, and load-bearing walls",
          "Cross-sectional elevation profiles and vertical dimension records",
          "AutoCAD (.DWG) and high-resolution PDF deliverables"
        ],
        codes: "NBC 2016 Survey Guidelines"
      },
      costing: {
        title: "Structural Estimation & BOQ Preparation",
        code: "DSR & Market Rate Analysis",
        overview: "Accurate quantity takeoff and tender documentation so building societies and commercial owners know their repair or construction costs in advance.",
        deliverables: [
          "Item-wise Bill of Quantities (BOQ) with standard civil specifications",
          "Detailed rate analysis based on current District Schedule of Rates (DSR)",
          "Comparative tender evaluation of contractor bids",
          "Stage-wise contractor billing verification"
        ],
        codes: "CPWD / PWD DSR Standards"
      }
    };

    const serviceLabels = {
      audit: 'Structural Audit & Stability Certificate',
      ndt: 'Non-Destructive Testing (NDT)',
      design: 'Structural Design & Analysis',
      repair: 'Repair & Strengthening Consultancy',
      drafting: 'Detailing & Drafting (CAD)',
      asbuilt: 'As-Built Drawing Survey',
      costing: 'Estimation & Costing'
    };
    const requestedService = new URLSearchParams(window.location.search).get('service');
    const messageField = $('#projectNotes');
    if (messageField && serviceLabels[requestedService]) {
      messageField.value = `I'm interested in ${serviceLabels[requestedService]}. `;
    }

    function openServiceModal(key) {
      const data = serviceData[key];
      if (!data) return;
      const html = `
        <span class="eyebrow" style="color: var(--teal);">${data.code}</span>
        <h2 style="font-size: 1.5rem; margin: 8px 0 14px;">${data.title}</h2>
        <p style="color: var(--mut); line-height: 1.6; margin-bottom: 20px;">${data.overview}</p>
        <h4 style="font-size: 1rem; margin-bottom: 10px;">Scope of Deliverables:</h4>
        <ul style="padding-left: 20px; color: var(--mut); line-height: 1.7; margin-bottom: 24px;">
          ${data.deliverables.map(d => `<li>${d}</li>`).join('')}
        </ul>
        <div style="background: var(--bg-alt); padding: 12px 16px; border-radius: 8px; font-size: 0.85rem; color: var(--mut); margin-bottom: 24px;">
          <strong>Applicable Standards:</strong> ${data.codes}
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a class="b sm" href="contact.html?service=${encodeURIComponent(key)}">Request Consultation for this Service</a>
          <button class="b sm o" onclick="closeServiceModal()">Close</button>
        </div>
      `;
      $('#modalContent').innerHTML = html;
      $('#serviceModal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeServiceModal(e) {
      $('#serviceModal').classList.remove('open');
      document.body.style.overflow = '';
    }

    // Form Submission: Auto-generates WhatsApp chat
    function handleFormSubmit(e) {
      e.preventDefault();
      const name = $('#clientName').value.trim();
      const phone = $('#clientPhone').value.trim();
      const notes = $('#projectNotes').value.trim();

      const message = `Hello Venture Civil Services,\n\n${notes}\n\nName: ${name}\nPhone: ${phone}`;
      const whatsappURL = `https://wa.me/919075409197?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
    }
