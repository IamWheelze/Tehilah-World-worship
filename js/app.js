/* ============================================
   Tehilah World Worship - Main Application JS
   ============================================ */

// ===================== NAVIGATION =====================
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const icon = toggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  // Close menu on link click (mobile)
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      const icon = toggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });

  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ===================== COUNTDOWN TIMER =====================
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  // Target: March 20, 2026 at 15:00 CET (UTC+1)
  const target = new Date('2026-03-20T14:00:00Z'); // 15:00 CET = 14:00 UTC

  function update() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      el.innerHTML = '<div class="countdown-label">The 24-Hour Worship Has Begun — Join us now! 🙏</div>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    el.innerHTML = `
      <div class="countdown-label">Countdown to 24-Hour Worship</div>
      <div class="countdown-unit">
        <span class="countdown-number">${days}</span>
        <span class="countdown-text">Days</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-text">Hours</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-text">Minutes</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-text">Seconds</span>
      </div>
    `;
  }

  update();
  setInterval(update, 1000);
}

// ===================== SCROLL REVEAL =====================
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

// ===================== MEDIA HUB =====================
function initMediaHub() {
  const grid = document.getElementById('media-grid');
  const filtersContainer = document.getElementById('media-filters');
  if (!grid || !filtersContainer) return;

  let activeFilter = 'all';

  function renderMedia(items) {
    if (!items.length) {
      grid.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);grid-column:1/-1;">No media items found.</p>';
      return;
    }

    grid.innerHTML = items.map(item => {
      const platformClass = `tag-${item.platform.toLowerCase()}`;
      const platformIcon = getPlatformIcon(item.platform);

      let thumbHTML = '';
      if (item.platform === 'YouTube' && item.url) {
        const videoId = getYouTubeId(item.url);
        if (videoId) {
          thumbHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen loading="lazy"></iframe>`;
        }
      } else if (item.platform === 'Instagram' && item.url) {
        thumbHTML = `<a href="${escapeAttr(item.url)}" target="_blank" rel="noopener" class="thumb-placeholder">
          <i class="fab fa-instagram"></i>
          <span>View on Instagram</span>
        </a>`;
      } else if (item.platform === 'TikTok' && item.url) {
        thumbHTML = `<a href="${escapeAttr(item.url)}" target="_blank" rel="noopener" class="thumb-placeholder">
          <i class="fab fa-tiktok"></i>
          <span>View on TikTok</span>
        </a>`;
      } else if (item.platform === 'Photo' && item.thumbnail) {
        thumbHTML = `<img src="${escapeAttr(item.thumbnail)}" alt="${escapeAttr(item.title)}" loading="lazy">`;
      } else {
        thumbHTML = `<div class="thumb-placeholder"><i class="${platformIcon}"></i><span>${escapeHTML(item.platform)}</span></div>`;
      }

      return `
        <div class="media-card">
          <div class="media-card-thumb">${thumbHTML}</div>
          <div class="media-card-body">
            <div class="media-card-meta">
              <span class="media-tag ${platformClass}">${escapeHTML(item.platform)}</span>
              <span class="media-tag">${escapeHTML(item.nation)}</span>
              <span class="media-tag">${escapeHTML(item.category)}</span>
            </div>
            <h3>${escapeHTML(item.title)}</h3>
            <div class="media-date">${escapeHTML(item.date)}</div>
            ${item.description ? `<div class="media-desc">${escapeHTML(item.description)}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function filterMedia() {
    const filtered = activeFilter === 'all'
      ? MEDIA_DATA
      : MEDIA_DATA.filter(item => item.category === activeFilter);
    renderMedia(filtered);
  }

  // Filter button click handling
  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    filterMedia();
  });

  // Initial render
  filterMedia();
}

// ===================== FEATURED MEDIA STRIP (Home) =====================
function initFeaturedMedia() {
  const strip = document.getElementById('featured-strip');
  if (!strip || typeof MEDIA_DATA === 'undefined') return;

  const featured = MEDIA_DATA.slice(0, 6);
  strip.innerHTML = featured.map(item => {
    const platformClass = `tag-${item.platform.toLowerCase()}`;
    return `
      <div class="media-card">
        <div class="media-card-thumb">
          <div class="thumb-placeholder">
            <i class="${getPlatformIcon(item.platform)}"></i>
            <span>${escapeHTML(item.platform)}</span>
          </div>
        </div>
        <div class="media-card-body">
          <div class="media-card-meta">
            <span class="media-tag ${platformClass}">${escapeHTML(item.platform)}</span>
            <span class="media-tag">${escapeHTML(item.nation)}</span>
          </div>
          <h3>${escapeHTML(item.title)}</h3>
          <div class="media-date">${escapeHTML(item.date)}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ===================== FORM HANDLING =====================
// Forms use Formspree (https://formspree.io) to deliver submissions to email.
// Sign up free at formspree.io, create two forms, and replace the IDs below.
// After first submission Formspree sends a confirmation email — click it to activate.
const FORMSPREE_CONTACT_URL   = 'https://formspree.io/f/xpwzerkp';   // contact form
const FORMSPREE_VOLUNTEER_URL = 'https://formspree.io/f/xpwzerkp';   // volunteer form (same inbox)

function submitToFormspree(form, url, successText) {
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  const btn = form.querySelector('[type="submit"]');
  const msg = form.querySelector('.form-submit-msg');

  if (btn) btn.disabled = true;

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(res => {
      if (msg) {
        if (res.ok) {
          msg.classList.remove('error');
          msg.classList.add('success');
          msg.textContent = successText;
          form.reset();
        } else {
          msg.classList.remove('success');
          msg.classList.add('error');
          msg.textContent = 'Something went wrong. Please email us directly at joshuaegbodofo0@gmail.com';
        }
      }
    })
    .catch(() => {
      if (msg) {
        msg.classList.remove('success');
        msg.classList.add('error');
        msg.textContent = 'Network error. Please email us at joshuaegbodofo0@gmail.com';
      }
    })
    .finally(() => {
      if (btn) btn.disabled = false;
    });
}

function initVolunteerForm() {
  const form = document.getElementById('volunteer-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitToFormspree(form, FORMSPREE_VOLUNTEER_URL, 'Thank you for volunteering! We will be in touch soon.');
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitToFormspree(form, FORMSPREE_CONTACT_URL, 'Thank you for your message! We will respond soon.');
  });
}

// ===================== HELPERS =====================
function getPlatformIcon(platform) {
  const icons = {
    'YouTube': 'fab fa-youtube',
    'Instagram': 'fab fa-instagram',
    'TikTok': 'fab fa-tiktok',
    'Photo': 'fas fa-camera',
  };
  return icons[platform] || 'fas fa-play-circle';
}

function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCountdown();
  initReveal();
  initMediaHub();
  initFeaturedMedia();
  initVolunteerForm();
  initContactForm();
});
