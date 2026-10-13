/**
 * Ultra-Optimized Live Terminal Engine for Expert Impact Section
 * Designed for 60 FPS, Zero Height Shift, and Instant Mobile Load
 */

export function initExpertTerminal() {
  const terminalContainer = document.getElementById('expert-terminal');
  if (!terminalContainer) return;

  const codeOutput = document.getElementById('terminal-code-output');
  const lineNumbers = document.getElementById('terminal-line-numbers');
  const terminalConsole = document.getElementById('terminal-console-output');
  const terminalStatus = document.getElementById('terminal-status-state');
  if (!codeOutput) return;

  // Pre-tokenized code lines to eliminate runtime parsing overhead
  const SCRIPT_TOKENS = [
    { text: '// حل ریشه‌ای مسئله: تبدیل چالش به محصول پایدار\n', type: 'comment' },
    { text: 'async ', type: 'keyword' },
    { text: 'function ', type: 'keyword' },
    { text: 'solveRootChallenge', type: 'func' },
    { text: '(', type: 'plain' },
    { text: 'project', type: 'param' },
    { text: ': Project) {\n', type: 'plain' },
    { text: '  const ', type: 'keyword' },
    { text: 'audit = ', type: 'plain' },
    { text: 'await ', type: 'keyword' },
    { text: 'diagnoseBottlenecks', type: 'func' },
    { text: '(project.core);\n\n', type: 'plain' },
    { text: '  // ۱. حذف کامل لگ و لودینگ زیر ۱ ثانیه\n', type: 'comment' },
    { text: '  await ', type: 'keyword' },
    { text: 'eliminateFriction', type: 'func' },
    { text: '({\n', type: 'plain' },
    { text: '    targetFPS: ', type: 'prop' },
    { text: '60', type: 'number' },
    { text: ',\n    responseTime: ', type: 'plain' },
    { text: '"< 1s"', type: 'string' },
    { text: ',\n    smoothExperience: ', type: 'plain' },
    { text: 'true', type: 'bool' },
    { text: '\n  });\n\n', type: 'plain' },
    { text: '  // ۲. معماری ماژولار، سبک و بدون خطا\n', type: 'comment' },
    { text: '  const ', type: 'keyword' },
    { text: 'optimized = ', type: 'plain' },
    { text: 'refactorToCleanCode', type: 'func' },
    { text: '(audit);\n\n', type: 'plain' },
    { text: '  return ', type: 'keyword' },
    { text: 'deploySustainableGrowth', type: 'func' },
    { text: '({\n', type: 'plain' },
    { text: '    performance: ', type: 'prop' },
    { text: '100', type: 'number' },
    { text: ',\n    scalable: ', type: 'plain' },
    { text: 'true', type: 'bool' },
    { text: '\n  });\n', type: 'plain' },
    { text: '}', type: 'plain' }
  ];

  const fullText = SCRIPT_TOKENS.map(t => t.text).join('');
  const TOTAL_LINES = fullText.split('\n').length;

  let tokenIndex = 0;
  let charIndex = 0;
  let currentSpan = null;
  let activeTimeout = null;
  let isVisible = false;
  let isExecuting = false;

  function updateLineNumbers(currentLineCount) {
    if (!lineNumbers) return;
    let linesHtml = '';
    const safeCount = Math.max(1, Math.min(currentLineCount, TOTAL_LINES));
    for (let i = 1; i <= TOTAL_LINES; i++) {
      const numStr = i < 10 ? '0' + i : String(i);
      const cls = i <= safeCount ? 'num-active' : 'num-idle';
      linesHtml += `<span class="${cls}">${numStr}</span>`;
    }
    lineNumbers.innerHTML = linesHtml;
  }

  function setConsoleStandby() {
    if (!terminalConsole) return;
    terminalConsole.innerHTML = `
      <div class="console-line standby">
        <span class="console-spinner" aria-hidden="true"></span>
        <span>Console: Analysing & refactoring core codebase...</span>
      </div>
      <div class="console-line standby-tag">
        <span>RUNNING</span>
      </div>
    `;
    terminalConsole.classList.add('active');
  }

  function setConsoleSuccess() {
    if (!terminalConsole) return;
    terminalConsole.innerHTML = `
      <div class="console-line success">
        <span class="console-icon">✓</span>
        <span>Build: 0 errors • Code Quality: 100/100</span>
      </div>
      <div class="console-line perf">
        <span class="console-icon">⚡</span>
        <span>60 FPS • 0 Lag</span>
      </div>
    `;
    terminalConsole.classList.add('active');
  }

  // Immediate rendering if device prefers reduced motion (saves battery/CPU)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    let fullHtml = '';
    SCRIPT_TOKENS.forEach(t => {
      if (t.type === 'plain') fullHtml += t.text;
      else fullHtml += `<span class="tk-${t.type}">${t.text}</span>`;
    });
    codeOutput.innerHTML = fullHtml;
    updateLineNumbers(TOTAL_LINES);
    setConsoleSuccess();
    if (terminalStatus) terminalStatus.textContent = 'COMPILED';
    return;
  }

  function resetTerminal() {
    tokenIndex = 0;
    charIndex = 0;
    currentSpan = null;
    codeOutput.innerHTML = '';
    setConsoleStandby();
    if (terminalStatus) {
      terminalStatus.textContent = 'TYPING...';
    }
    updateLineNumbers(1);
  }

  function typeNextCharacter() {
    if (!isVisible) return;

    if (tokenIndex >= SCRIPT_TOKENS.length) {
      // Completed typing function - run compilation & result
      finishExecution();
      return;
    }

    const currentToken = SCRIPT_TOKENS[tokenIndex];

    if (!currentSpan) {
      currentSpan = document.createElement('span');
      if (currentToken.type !== 'plain') {
        currentSpan.className = `tk-${currentToken.type}`;
      }
      codeOutput.appendChild(currentSpan);
    }

    // Append next character
    const nextChar = currentToken.text[charIndex];
    currentSpan.textContent += nextChar;
    charIndex++;

    // Update line numbers only when newline character occurs
    if (nextChar === '\n') {
      const lineCount = codeOutput.textContent.split('\n').length;
      updateLineNumbers(lineCount);
    }

    if (charIndex >= currentToken.text.length) {
      // Move to next token
      tokenIndex++;
      charIndex = 0;
      currentSpan = null;
    }

    // Natural typing delay: fast on regular characters, slightly slower on newlines and commas
    let delay = 18;
    if (nextChar === '\n') delay = 85;
    else if (nextChar === ' ' || nextChar === '{' || nextChar === '(') delay = 24;
    else if (Math.random() > 0.88) delay = 34; // subtle human jitter

    activeTimeout = setTimeout(typeNextCharacter, delay);
  }

  function finishExecution() {
    if (terminalStatus) {
      terminalStatus.textContent = 'COMPILED';
    }
    updateLineNumbers(TOTAL_LINES);
    setConsoleSuccess();

    // Wait 4.2 seconds before cleanly looping
    activeTimeout = setTimeout(() => {
      if (isVisible) {
        resetTerminal();
        typeNextCharacter();
      }
    }, 4200);
  }

  // Persian Headline Typewriter on Section Enter
  const titleEl = document.getElementById('expert-text-title');
  const descEl = document.getElementById('expert-text-desc');
  let textTypingStarted = false;

  function runPersianTypewriter() {
    if (!titleEl || !descEl || textTypingStarted) return;
    textTypingStarted = true;

    const titleFull = titleEl.getAttribute('data-text') || titleEl.textContent.trim();
    const descFull = descEl.getAttribute('data-text') || descEl.textContent.trim();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      titleEl.innerHTML = titleFull.replace(/\n/g, '<br />');
      descEl.textContent = descFull;
      return;
    }

    titleEl.textContent = '';
    descEl.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'persian-typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    titleEl.appendChild(cursor);

    let tIndex = 0;
    function stepTitle() {
      if (tIndex < titleFull.length) {
        const char = titleFull[tIndex];
        if (char === '\n') {
          const br = document.createElement('br');
          cursor.before(br);
        } else {
          cursor.insertAdjacentText('beforebegin', char);
        }
        tIndex++;
        const delay = (char === '؛' || char === '،' || char === '.' || char === '!' || char === ',') ? 110 : (char === '\n' ? 140 : 22);
        setTimeout(stepTitle, delay);
      } else {
        setTimeout(() => {
          cursor.remove();
          descEl.appendChild(cursor);
          stepDesc();
        }, 160);
      }
    }

    let dIndex = 0;
    function stepDesc() {
      if (dIndex < descFull.length) {
        cursor.insertAdjacentText('beforebegin', descFull[dIndex]);
        dIndex++;
        const char = descFull[dIndex - 1];
        const delay = (char === '؛' || char === '،' || char === '.' || char === '!' || char === ',') ? 85 : 12;
        setTimeout(stepDesc, delay);
      } else {
        setTimeout(() => {
          cursor.style.opacity = '0';
          setTimeout(() => cursor.remove(), 350);
        }, 1200);
      }
    }

    stepTitle();
  }

  // IntersectionObserver guarantees 0 CPU consumption when out of view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        runPersianTypewriter();
        if (!isExecuting) {
          isExecuting = true;
          resetTerminal();
          typeNextCharacter();
        } else if (!activeTimeout) {
          typeNextCharacter();
        }
      } else {
        if (activeTimeout) {
          clearTimeout(activeTimeout);
          activeTimeout = null;
        }
      }
    });
  }, {
    threshold: 0.15
  });

  observer.observe(terminalContainer);
}

