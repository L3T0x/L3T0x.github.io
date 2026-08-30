const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const desktopQuery = window.matchMedia('(min-width: 981px)');

function closeMenu(returnFocus = false) {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (returnFocus) menuToggle.focus();
}

function openMenu() {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close navigation');
  nav.classList.add('is-open');
  document.body.classList.add('menu-open');
  nav.querySelector('a')?.focus();
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu(); else openMenu();
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  document.addEventListener('click', (event) => {
    if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

let sectionFrame = 0;

function updateActiveSection() {
  sectionFrame = 0;
  if (!observedSections.length) return;

  const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 300);
  const activeSection = observedSections.reduce((current, section) => {
    return section.offsetTop <= marker ? section : current;
  }, observedSections[0]);

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${activeSection.id}`;
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

function scheduleSectionUpdate() {
  if (!sectionFrame) sectionFrame = window.requestAnimationFrame(updateActiveSection);
}

window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
window.addEventListener('resize', scheduleSectionUpdate);
updateActiveSection();

function openEvidenceTarget() {
  if (!window.location.hash) return;
  const target = document.getElementById(window.location.hash.slice(1));
  if (!target) return;

  const parentDetails = target.matches('details') ? target : target.closest('details');
  if (parentDetails && !parentDetails.open) parentDetails.open = true;

  if (parentDetails) {
    window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}

window.addEventListener('hashchange', openEvidenceTarget);
openEvidenceTarget();

const yearNode = document.querySelector('[data-year]');
if (yearNode) yearNode.textContent = new Date().getFullYear();
