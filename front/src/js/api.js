/**
 * API Service & Backend Integration Module for AMIN.EZ Portfolio
 * Connects frontend with Django REST Backend (/api/...)
 */

// Base API URL (falls back to relative path for Vite proxy or same-origin)
const API_BASE_URL = window.API_BASE_URL || '/api';

/**
 * Check backend health status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health/`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Django backend health check note:', err.message);
    return null;
  }
}

/**
 * Fetch projects from Django backend
 */
export async function getProjects() {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Could not fetch projects from backend:', err.message);
    return null;
  }
}

/**
 * Send contact message to Django backend
 */
export async function sendContactMessage(payload) {
  const res = await fetch(`${API_BASE_URL}/contact/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw {
      status: res.status,
      data: data
    };
  }
  return data;
}

/**
 * Initialize interactive Contact Form
 */
export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const statusBox = document.getElementById('contactFormStatus');
  const btnOriginalText = submitBtn ? submitBtn.innerHTML : 'ارسال پیام';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const subjectInput = form.querySelector('[name="subject"]');
    const messageInput = form.querySelector('[name="message"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Frontend quick validation
    if (!name || name.length < 2) {
      showStatus('لطفاً نام و نام‌خانوادگی خود را به درستی وارد کنید.', 'error');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('لطفاً یک آدرس ایمیل معتبر وارد کنید.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!message || message.length < 5) {
      showStatus('متن پیام شما باید حداقل شامل ۵ نویسه باشد.', 'error');
      if (messageInput) messageInput.focus();
      return;
    }

    // Set Loading State
    setButtonLoading(true);
    clearStatus();

    try {
      const response = await sendContactMessage({
        name,
        email,
        subject,
        message
      });

      // Success
      showStatus(response.message || 'پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس خواهم گرفت.', 'success');
      form.reset();
    } catch (err) {
      let errMsg = 'متأسفانه در ارسال پیام خطایی رخ داد. لطفاً مجدداً تلاش فرمایید یا مستقیماً ایمیل بزنید.';
      if (err.data && err.data.message) {
        errMsg = err.data.message;
      } else if (err.data && err.data.errors) {
        const firstKey = Object.keys(err.data.errors)[0];
        if (firstKey && err.data.errors[firstKey].length) {
          errMsg = err.data.errors[firstKey][0];
        }
      }
      showStatus(errMsg, 'error');
    } finally {
      setButtonLoading(false);
    }
  });

  function setButtonLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.75';
      submitBtn.style.pointerEvents = 'none';
      submitBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
          <svg style="animation: spin 1s linear infinite; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
          <span>در حال ارسال پیام...</span>
        </span>
      `;
    } else {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.pointerEvents = 'auto';
      submitBtn.innerHTML = btnOriginalText;
    }
  }

  function showStatus(msg, type) {
    if (!statusBox) return;
    statusBox.style.display = 'block';
    statusBox.className = `contact-form-feedback feedback-${type}`;
    statusBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.6rem; justify-content: center;">
        <span>${type === 'success' ? '✓' : '⚠'}</span>
        <span>${msg}</span>
      </div>
    `;

    if (type === 'success') {
      setTimeout(() => {
        statusBox.style.display = 'none';
      }, 7000);
    }
  }

  function clearStatus() {
    if (!statusBox) return;
    statusBox.style.display = 'none';
    statusBox.innerHTML = '';
  }
}
