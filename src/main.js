/**
 * ATTSA (Assam Tea Tribes Students Association)
 * Interactive Application Controller & Interaction Design System
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModals();
  initTimelineFilters();
  initForms();
  initCopyActions();
});

/* ==========================================================================
   1. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const closeMobileBtn = document.getElementById('close-mobile-drawer');
  const navLinks = document.querySelectorAll('header nav a[data-path], #mobile-drawer a[data-path]');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll shadow elevation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md', 'bg-surface/95');
      header.classList.remove('bg-surface/85');
    } else {
      header.classList.remove('shadow-md', 'bg-surface/95');
      header.classList.add('bg-surface/85');
    }
  }, { passive: true });

  // Mobile Drawer Toggle
  function openMobileMenu() {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.remove('translate-x-full');
    mobileBackdrop.classList.remove('hidden');
    setTimeout(() => mobileBackdrop.classList.remove('opacity-0'), 10);
    document.body.style.overflow = 'hidden';
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.add('translate-x-full');
    mobileBackdrop.classList.add('opacity-0');
    setTimeout(() => {
      mobileBackdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  closeMobileBtn?.addEventListener('click', closeMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);

  // Close drawer on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileDrawer?.classList.contains('translate-x-full')) {
      closeMobileMenu();
    }
  });

  // Smooth Navigation Links handling
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileMenu();
        return;
      }

      const targetSection = document.querySelector(href);
      if (targetSection) {
        e.preventDefault();
        closeMobileMenu();
        targetSection.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', href);
      }
    });
  });

  // IntersectionObserver Scrollspy
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const activeClasses = ['bg-primary-container', 'text-on-primary', 'font-semibold', 'rounded-lg', 'shadow-sm'];
    const inactiveClasses = ['text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface-container'];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const path = link.getAttribute('data-path');
            const href = link.getAttribute('href');
            const isMatch = (currentId === 'who-we-are' && (path === 'about' || href === '#who-we-are')) ||
                            (currentId === 'our-history' && (path === 'our-history' || href === '#our-history')) ||
                            (currentId === 'our-agenda' && (path === 'our-agenda' || href === '#our-agenda')) ||
                            (currentId === 'news-activities' && (path === 'news-activities' || href === '#news-activities')) ||
                            (currentId === 'leadership' && (path === 'leadership' || href === '#leadership'));

            if (isMatch) {
              link.classList.remove(...inactiveClasses);
              link.classList.add(...activeClasses);
              link.setAttribute('aria-current', 'page');
            } else if (path !== 'home' && href !== '#top') {
              link.classList.remove(...activeClasses);
              link.classList.add(...inactiveClasses);
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));

    // Monitor Top / Hero section
    window.addEventListener('scroll', () => {
      if (window.scrollY < 200) {
        navLinks.forEach((link) => {
          const path = link.getAttribute('data-path');
          const href = link.getAttribute('href');
          if (path === 'home' || href === '#top' || href === '#') {
            link.classList.remove(...inactiveClasses);
            link.classList.add(...activeClasses);
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove(...activeClasses);
            link.classList.add(...inactiveClasses);
            link.removeAttribute('aria-current');
          }
        });
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   2. ACCESSIBLE MODAL & DIALOG CONTROLLER
   ========================================================================== */
function initModals() {
  const dialogs = document.querySelectorAll('dialog');
  let lastActiveElement = null;

  // Open modal trigger binding
  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal && typeof modal.showModal === 'function') {
        lastActiveElement = btn;
        modal.showModal();
        const contentBox = modal.querySelector('.modal-content-box');
        if (contentBox) {
          contentBox.classList.add('modal-animate-in');
        }
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal trigger binding
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal) {
        modal.close();
      }
    });
  });

  // Modern Dialog Light-Dismiss & Cleanup
  dialogs.forEach((dialog) => {
    // Backdrop click dismiss fallback
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    // On Close cleanup
    dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    });
  });
}

/* ==========================================================================
   3. TIMELINE ERA FILTERING
   ========================================================================== */
function initTimelineFilters() {
  const filterBtns = document.querySelectorAll('.era-filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const era = btn.getAttribute('data-era');

      // Update button active state
      filterBtns.forEach((b) => {
        b.classList.remove('bg-primary', 'text-on-primary', 'font-semibold');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary', 'font-semibold');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

      // Filter timeline items with smooth transition
      timelineItems.forEach((item) => {
        const itemEra = item.getAttribute('data-era');
        if (era === 'all' || itemEra === era) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.25s ease';
            item.style.opacity = '1';
          }, 10);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE FORMS & USER CONFIRMATIONS
   ========================================================================== */
function initForms() {
  // Membership & Advocacy Form
  const membershipForm = document.getElementById('membership-application-form');
  if (membershipForm) {
    membershipForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = membershipForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin mr-2">refresh</span> Registering Member...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        const formView = document.getElementById('membership-form-view');
        const successView = document.getElementById('membership-success-view');
        if (formView && successView) {
          formView.classList.add('hidden');
          successView.classList.remove('hidden');
        }
        showToast('Membership Application Received', 'Your student enrollment has been recorded. Central Executive Committee will verify credentials.', 'verified');
      }, 700);
    });

    const resetMembershipBtn = document.getElementById('reset-membership-form');
    resetMembershipBtn?.addEventListener('click', () => {
      const formView = document.getElementById('membership-form-view');
      const successView = document.getElementById('membership-success-view');
      membershipForm.reset();
      if (formView && successView) {
        successView.classList.add('hidden');
        formView.classList.remove('hidden');
      }
    });
  }

  // Archival Document Submission Form
  const archiveForm = document.getElementById('archival-submission-form');
  if (archiveForm) {
    archiveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = archiveForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin mr-2">refresh</span> Archiving Document...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        const formView = document.getElementById('archive-form-view');
        const successView = document.getElementById('archive-success-view');
        if (formView && successView) {
          formView.classList.add('hidden');
          successView.classList.remove('hidden');
        }
        showToast('Document Cataloged', 'Your submission has been cataloged under Reference ATTSA/ARCH/2025/VERIFIED.', 'history_edu');
      }, 750);
    });

    const resetArchiveBtn = document.getElementById('reset-archive-form');
    resetArchiveBtn?.addEventListener('click', () => {
      const formView = document.getElementById('archive-form-view');
      const successView = document.getElementById('archive-success-view');
      archiveForm.reset();
      if (formView && successView) {
        successView.classList.add('hidden');
        formView.classList.remove('hidden');
      }
    });
  }

  // Leadership Fellowship Application Form
  const fellowshipForm = document.getElementById('fellowship-application-form');
  if (fellowshipForm) {
    fellowshipForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = fellowshipForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin mr-2">refresh</span> Submitting Application...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        const formView = document.getElementById('fellowship-form-view');
        const successView = document.getElementById('fellowship-success-view');
        if (formView && successView) {
          formView.classList.add('hidden');
          successView.classList.remove('hidden');
        }
        showToast('Fellowship Application Submitted', 'Cohort selection committee will review your submission for the 2025 Fellowship.', 'psychology');
      }, 700);
    });

    const resetFellowshipBtn = document.getElementById('reset-fellowship-form');
    resetFellowshipBtn?.addEventListener('click', () => {
      const formView = document.getElementById('fellowship-form-view');
      const successView = document.getElementById('fellowship-success-view');
      fellowshipForm.reset();
      if (formView && successView) {
        successView.classList.add('hidden');
        formView.classList.remove('hidden');
      }
    });
  }

  // Simulated Document Download / Print
  document.querySelectorAll('[data-action="print-document"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Document Prepared', 'Opening official document print preview...', 'print');
      setTimeout(() => window.print(), 300);
    });
  });

  document.querySelectorAll('[data-action="download-document"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const docName = btn.getAttribute('data-doc-name') || 'ATTSA-Official-Resolution.pdf';
      showToast('Download Initiated', `Saving archival document: ${docName}`, 'download_for_offline');
    });
  });
}

/* ==========================================================================
   5. CLIPBOARD & COPY ACTIONS
   ========================================================================== */
function initCopyActions() {
  document.querySelectorAll('[data-copy-text]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Copied to Clipboard', textToCopy, 'content_copy');
        }).catch(() => {
          showToast('Contact Address', textToCopy, 'mail');
        });
      } else {
        showToast('Contact Address', textToCopy, 'mail');
      }
    });
  });
}

/* ==========================================================================
   6. TOAST NOTIFICATION UTILITY
   ========================================================================== */
export function showToast(title, message, icon = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-animate pointer-events-auto flex items-start gap-3 p-4 rounded-lg bg-primary-container text-on-primary shadow-xl border border-secondary/30 backdrop-blur-md';
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="material-symbols-outlined text-tertiary-fixed text-[22px] shrink-0 mt-0.5">${icon}</span>
    <div class="flex-1">
      <h4 class="font-title-md text-[15px] font-semibold text-on-primary leading-tight">${title}</h4>
      <p class="font-body-sm text-[13px] text-on-primary-container mt-0.5 leading-snug">${message}</p>
    </div>
    <button type="button" class="text-on-primary-container hover:text-on-primary shrink-0 transition-colors" aria-label="Close Notification">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  `;

  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  });

  container.appendChild(toast);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    if (toast.isConnected) {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
}
