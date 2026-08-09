const anniversaryDate = new Date('2025-08-18T00:00:00');

    function updateTimer(){
      const now = new Date();

      let years = now.getFullYear() - anniversaryDate.getFullYear();
      let months = now.getMonth() - anniversaryDate.getMonth();
      let days = now.getDate() - anniversaryDate.getDate();

      if (days < 0){
        months--;
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
      }
      if (months < 0){
        years--;
        months += 12;
      }

      // Remaining time today
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        anniversaryDate.getHours(),
        anniversaryDate.getMinutes(),
        anniversaryDate.getSeconds()
      );
      let diff = now - startOfToday;
      if (diff < 0) diff += 24 * 60 * 60 * 1000;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff %= 1000 * 60 * 60;
      const minutes = Math.floor(diff / (1000 * 60));
      diff %= 1000 * 60;
      const seconds = Math.floor(diff / 1000);

      setUnit('years', years);
      setUnit('months', months);
      setUnit('days', days);
      setUnit('hours', hours);
      setUnit('minutes', minutes);
      setUnit('seconds', seconds);
    }

    function setUnit(id, value){
      const el = document.getElementById(id);
      if (el.textContent !== String(value)){
        el.textContent = value;
        el.classList.remove('tick');
        void el.offsetWidth; // restart animation
        el.classList.add('tick');
      }
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // ============ Fairy light bulbs ============
    const bulbRow = document.getElementById('bulbRow');
    const bulbColors = ['#F3B93B', '#DE9323', '#FFE8A3', '#E8A030', '#F6C84C'];
    const positions = [];
    for (let x = 35; x < 1180; x += 60) positions.push(x);

    positions.forEach((x, i) => {
      const y = 16 + Math.sin(i * 0.7) * 18 + 14;
      const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx', x);
      c.setAttribute('cy', y);
      c.setAttribute('r', 4);
      c.setAttribute('fill', bulbColors[i % bulbColors.length]);
      c.classList.add('bulb');
      c.style.animationDelay = (i * 0.15) + 's';
      bulbRow.appendChild(c);
    });

    // ============ Mobile nav toggle (hamburger → X) ============
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });

    // ============ Active section tracking ============
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = navLinks.querySelectorAll('a');

    // Scroll shadow deepener
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });

    const sectionIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => sectionIo.observe(s));

    // ============ Gallery photo → letter modal ============
    const modal = document.getElementById('galleryModal');
    const modalPhoto = document.getElementById('modalPhoto');
    const modalCaption = document.getElementById('modalCaption');
    const modalGreeting = document.getElementById('modalGreeting');
    const modalLetter = document.getElementById('modalLetter');
    const modalCloseBtn = modal.querySelector('.modal-close');

    function openModal(figure){
      const letter = figure.getAttribute('data-letter')
        || 'A little placeholder — come back later once you have the words.';
      const caption = figure.getAttribute('data-caption') || '';

      // Reuse the thumbnail's own <img src> — same photo, same URL, just
      // rendered with object-fit:contain (see CSS) so the full frame shows
      // instead of the cropped square. Nothing photo-specific lives here;
      // every figure just needs one <img class="thumb"> to work.
      const thumbImg = figure.querySelector('img.thumb');
      modalPhoto.innerHTML = '';
      if (thumbImg) {
        const full = document.createElement('img');
        full.src = thumbImg.currentSrc || thumbImg.src;
        full.alt = thumbImg.alt;
        modalPhoto.appendChild(full);
      }

      modalCaption.textContent = caption;

      // Render the letter as paragraphs (split on the ¶ marker)
      modalLetter.innerHTML = '';
      const paras = letter.split('¶').map(p => p.trim()).filter(Boolean);
      paras.forEach(p => {
        const pEl = document.createElement('p');
        pEl.textContent = p;
        modalLetter.appendChild(pEl);
      });

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modalCloseBtn.focus();
    }

    function closeModal(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    const figureEls = document.querySelectorAll('.polaroid');

    figureEls.forEach(f => {
      f.setAttribute('tabindex', '0');
      f.setAttribute('role', 'button');
      f.addEventListener('click', () => openModal(f));
      f.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openModal(f);
        }
      });
    });

    modal.querySelectorAll('[data-close]').forEach(el =>
      el.addEventListener('click', closeModal)
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // ============ Scroll reveal ============
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));

    // ============ Floating warm petals in hero ============
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 14; i++){
      const petal = document.createElement('div');
      petal.classList.add('petal');
      const size = 6 + Math.random() * 8;
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.bottom = '-5%';
      petal.style.animationDuration = (10 + Math.random() * 10) + 's';
      petal.style.animationDelay = (Math.random() * 12) + 's';
      hero.appendChild(petal);
    }