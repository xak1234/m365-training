/* ============================================================
   M365 TRAINING CENTER - Core Application Engine
   Vanilla JS SPA: routing, state, module registration, views
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // 0. CONSTANTS
  // ----------------------------------------------------------
  var STORAGE_KEY = 'M365TrainingState';
  var TOAST_LIMIT = 3;
  var TOAST_DURATION = 3000;
  var QUIZ_AUTO_ADVANCE = 1500;
  var PROGRESS_RING_CIRCUMFERENCE = 2 * Math.PI * 15.5; // ~97.389
  var PASSING_SCORE = 70;

  // ----------------------------------------------------------
  // 1. DEFAULT STATE FACTORY
  // ----------------------------------------------------------
  function defaultState() {
    return {
      modules: {
        users: { completedLessons: [], quizScore: null, simCompleted: false },
        teams: { completedLessons: [], quizScore: null, simCompleted: false },
        sharepoint: { completedLessons: [], quizScore: null, simCompleted: false }
      },
      currentModule: null,
      currentLesson: null,
      currentTab: 'lessons'
    };
  }

  // ----------------------------------------------------------
  // 2. STATE MANAGEMENT
  // ----------------------------------------------------------
  var state = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        // Merge with defaults so new keys are always present
        var base = defaultState();
        Object.keys(base.modules).forEach(function (id) {
          if (!parsed.modules[id]) {
            parsed.modules[id] = base.modules[id];
          } else {
            // Ensure sub-keys exist
            if (!Array.isArray(parsed.modules[id].completedLessons)) {
              parsed.modules[id].completedLessons = [];
            }
            if (parsed.modules[id].quizScore === undefined) {
              parsed.modules[id].quizScore = null;
            }
            if (parsed.modules[id].simCompleted === undefined) {
              parsed.modules[id].simCompleted = false;
            }
          }
        });
        if (parsed.currentTab === undefined) parsed.currentTab = 'lessons';
        return parsed;
      }
    } catch (e) {
      console.warn('[M365App] Failed to load state, resetting.', e);
    }
    return defaultState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('[M365App] Failed to save state.', e);
    }
  }

  // ----------------------------------------------------------
  // 3. MODULE REGISTRY
  // ----------------------------------------------------------
  var modules = {}; // { id: moduleConfig }

  function registerModule(config) {
    if (!config || !config.id) {
      console.error('[M365App] registerModule: config.id is required.');
      return;
    }
    modules[config.id] = config;

    // Ensure state bucket exists
    if (!state.modules[config.id]) {
      state.modules[config.id] = { completedLessons: [], quizScore: null, simCompleted: false };
      saveState();
    }

    // Re-render dashboard if currently visible
    if (getCurrentView() === 'dashboard') {
      renderDashboard();
    }
    // If we are on this module's view, re-render it
    if (getCurrentView() === 'module' && state.currentModule === config.id) {
      renderModuleView(config.id);
    }

    // Update progress ring & stats whenever a module registers
    updateOverallProgressRing();
    updateDashboardStats();
  }

  // ----------------------------------------------------------
  // 4. ROUTER
  // ----------------------------------------------------------
  function navigate(view, params) {
    params = params || {};

    switch (view) {
      case 'dashboard':
        state.currentModule = null;
        state.currentLesson = null;
        state.currentTab = 'lessons';
        break;
      case 'module':
        state.currentModule = params.moduleId || null;
        state.currentLesson = null;
        state.currentTab = params.tab || 'lessons';
        break;
      case 'lesson':
        state.currentModule = params.moduleId || state.currentModule;
        state.currentLesson = params.lessonId || null;
        break;
      case 'settings':
        state.currentModule = null;
        state.currentLesson = null;
        break;
      default:
        view = 'dashboard';
        break;
    }

    saveState();
    updateHash(view, params);
    showView(view, params);
  }

  function updateHash(view, params) {
    var hash = '#' + view;
    if (view === 'module' && (params.moduleId || state.currentModule)) {
      hash += '/' + (params.moduleId || state.currentModule);
    } else if (view === 'lesson' && state.currentModule && state.currentLesson) {
      hash += '/' + state.currentModule + '/' + state.currentLesson;
    }
    // Avoid redundant pushState
    if (window.location.hash !== hash) {
      history.pushState(null, '', hash);
    }
  }

  function parseHash() {
    var hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) return { view: 'dashboard' };
    var parts = hash.split('/');
    var view = parts[0];
    switch (view) {
      case 'module':
        return { view: 'module', params: { moduleId: parts[1] || null } };
      case 'lesson':
        return { view: 'lesson', params: { moduleId: parts[1] || null, lessonId: parts[2] || null } };
      case 'settings':
        return { view: 'settings', params: {} };
      case 'dashboard':
      default:
        return { view: 'dashboard', params: {} };
    }
  }

  function getCurrentView() {
    var sections = document.querySelectorAll('.view');
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].classList.contains('active') && !sections[i].hidden) {
        var id = sections[i].id.replace('view-', '');
        return id;
      }
    }
    return 'dashboard';
  }

  // ----------------------------------------------------------
  // 5. VIEW SWITCHING
  // ----------------------------------------------------------
  function showView(view) {
    var sections = document.querySelectorAll('.view');
    sections.forEach(function (sec) {
      sec.classList.remove('active');
      sec.classList.remove('fade-in');
      sec.hidden = true;
    });

    var target = document.getElementById('view-' + view);
    if (!target) {
      target = document.getElementById('view-dashboard');
      view = 'dashboard';
    }
    target.hidden = false;
    // Force reflow then add class for CSS animation
    void target.offsetWidth;
    target.classList.add('active');
    target.classList.add('fade-in');

    // Scroll to top
    var mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;

    // Render the view
    switch (view) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'module':
        renderModuleView(state.currentModule);
        break;
      case 'lesson':
        renderLessonView(state.currentModule, state.currentLesson);
        break;
      case 'settings':
        break;
    }

    // Update sidebar active
    updateSidebarActive(view);
    updateOverallProgressRing();
  }

  // ----------------------------------------------------------
  // 6. SIDEBAR NAVIGATION
  // ----------------------------------------------------------
  function updateSidebarActive(view) {
    var links = document.querySelectorAll('.sidebar-link');
    links.forEach(function (link) {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      var nav = link.getAttribute('data-nav');
      var mod = link.getAttribute('data-module');

      if (view === 'dashboard' && nav === 'dashboard') {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (view === 'module' && nav === 'module' && mod === state.currentModule) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (view === 'lesson' && nav === 'module' && mod === state.currentModule) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (view === 'settings' && nav === 'settings') {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function bindSidebar() {
    var links = document.querySelectorAll('.sidebar-link');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var nav = this.getAttribute('data-nav');
        var mod = this.getAttribute('data-module');
        if (nav === 'module' && mod) {
          navigate('module', { moduleId: mod });
        } else if (nav === 'settings') {
          navigate('settings');
        } else {
          navigate('dashboard');
        }
      });
    });
  }

  // ----------------------------------------------------------
  // 7. DASHBOARD VIEW
  // ----------------------------------------------------------
  function renderDashboard() {
    // Update each module card progress
    Object.keys(modules).forEach(function (id) {
      var pct = getModuleProgress(id);
      var bar = document.querySelector('.progress-bar-fill[data-progress="' + id + '"]');
      var label = document.querySelector('.progress-label[data-progress-label="' + id + '"]');
      if (bar) bar.style.width = pct + '%';
      if (label) label.textContent = Math.round(pct) + '% complete';
    });

    updateDashboardStats();
    updateOverallProgressRing();
  }

  function updateDashboardStats() {
    var totalLessons = 0;
    var quizzesPassed = 0;
    var simsDone = 0;

    Object.keys(modules).forEach(function (id) {
      var mod = modules[id];
      var ms = state.modules[id];
      if (!ms) return;
      totalLessons += ms.completedLessons.length;
      if (ms.quizScore !== null && ms.quizScore >= PASSING_SCORE) quizzesPassed++;
      if (ms.simCompleted) simsDone++;
    });

    setTextById('stat-lessons-completed', totalLessons);
    setTextById('stat-quizzes-passed', quizzesPassed);
    setTextById('stat-simulations-done', simsDone);
    setTextById('stat-overall-pct', Math.round(getOverallProgress()) + '%');
  }

  // ----------------------------------------------------------
  // 8. PROGRESS CALCULATIONS
  // ----------------------------------------------------------
  function getModuleProgress(moduleId) {
    var mod = modules[moduleId];
    var ms = state.modules[moduleId];
    if (!mod || !ms) return 0;

    var totalLessons = mod.lessons ? mod.lessons.length : 0;
    var hasQuiz = mod.quiz && mod.quiz.length > 0;
    var hasSim = mod.simulation && mod.simulation.tasks && mod.simulation.tasks.length > 0;

    // Denominator: lessons + (quiz? 1 : 0) + (sim? 1 : 0)
    var totalParts = totalLessons + (hasQuiz ? 1 : 0) + (hasSim ? 1 : 0);
    if (totalParts === 0) return 0;

    var completedParts = ms.completedLessons.length;
    if (hasQuiz && ms.quizScore !== null && ms.quizScore >= PASSING_SCORE) completedParts++;
    if (hasSim && ms.simCompleted) completedParts++;

    return (completedParts / totalParts) * 100;
  }

  function getOverallProgress() {
    var ids = Object.keys(modules);
    if (ids.length === 0) return 0;
    var total = 0;
    ids.forEach(function (id) {
      total += getModuleProgress(id);
    });
    return total / ids.length;
  }

  // ----------------------------------------------------------
  // 9. OVERALL PROGRESS RING (SVG)
  // ----------------------------------------------------------
  function updateOverallProgressRing() {
    var pct = getOverallProgress();
    var ring = document.getElementById('overall-progress-ring');
    var label = document.getElementById('overall-progress-pct');
    if (ring) {
      var offset = PROGRESS_RING_CIRCUMFERENCE - (pct / 100) * PROGRESS_RING_CIRCUMFERENCE;
      ring.style.transition = 'stroke-dashoffset 0.6s ease';
      ring.setAttribute('stroke-dasharray', PROGRESS_RING_CIRCUMFERENCE.toFixed(2));
      ring.setAttribute('stroke-dashoffset', offset.toFixed(2));
    }
    if (label) {
      label.textContent = Math.round(pct) + '%';
    }
  }

  // ----------------------------------------------------------
  // 10. MODULE VIEW
  // ----------------------------------------------------------
  function renderModuleView(moduleId) {
    var mod = modules[moduleId];
    if (!mod) {
      navigate('dashboard');
      return;
    }
    var ms = state.modules[moduleId] || { completedLessons: [], quizScore: null, simCompleted: false };

    // Header
    setTextById('module-title', mod.title || 'Module');
    setTextById('module-description', mod.subtitle || '');

    // Module progress bar
    var pct = getModuleProgress(moduleId);
    var bar = document.getElementById('module-progress-bar');
    var barLabel = document.getElementById('module-progress-label');
    if (bar) bar.style.width = pct + '%';
    if (barLabel) barLabel.textContent = Math.round(pct) + '% complete';

    // Activate correct tab
    activateTab(state.currentTab || 'lessons');

    // Render lessons list
    renderLessonList(mod, ms);

    // Render simulation tab
    renderSimulationTab(mod, ms, moduleId);

    // Render quiz tab
    renderQuizTab(mod, ms, moduleId);
  }

  // ----------------------------------------------------------
  // 10a. TAB SWITCHING
  // ----------------------------------------------------------
  function activateTab(tabId) {
    var buttons = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');

    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach(function (panel) {
      var panelTabId = panel.id.replace('tab-', '');
      var isActive = panelTabId === tabId;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });

    state.currentTab = tabId;
  }

  function bindTabs() {
    var buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = this.getAttribute('data-tab');
        activateTab(tab);
        state.currentTab = tab;
        saveState();
      });
    });
  }

  // ----------------------------------------------------------
  // 10b. LESSON LIST
  // ----------------------------------------------------------
  function renderLessonList(mod, ms) {
    var container = document.getElementById('lesson-list');
    if (!container) return;
    container.innerHTML = '';

    if (!mod.lessons || mod.lessons.length === 0) {
      container.innerHTML = '<div class="empty-state"><p class="empty-state-text">No lessons available for this module yet.</p></div>';
      return;
    }

    // Determine first incomplete lesson index for locking
    var firstIncompleteIndex = -1;
    for (var i = 0; i < mod.lessons.length; i++) {
      if (ms.completedLessons.indexOf(mod.lessons[i].id) === -1) {
        firstIncompleteIndex = i;
        break;
      }
    }

    mod.lessons.forEach(function (lesson, index) {
      var isCompleted = ms.completedLessons.indexOf(lesson.id) !== -1;
      // Lessons are locked if they come after the first incomplete lesson
      var isLocked = firstIncompleteIndex !== -1 && index > firstIncompleteIndex;

      var item = document.createElement('div');
      item.className = 'lesson-item' + (isCompleted ? ' completed' : '') + (isLocked ? ' locked' : '');

      // Status icon
      var iconHtml;
      if (isCompleted) {
        iconHtml = '<span class="lesson-status-icon lesson-status-done" aria-label="Completed">' +
          '<svg width="20" height="20" viewBox="0 0 16 16" fill="none"><use href="#icon-check"/></svg>' +
          '</span>';
      } else if (isLocked) {
        iconHtml = '<span class="lesson-status-icon lesson-status-locked" aria-label="Locked">' +
          '<svg width="20" height="20" viewBox="0 0 16 16" fill="none"><use href="#icon-lock"/></svg>' +
          '</span>';
      } else {
        iconHtml = '<span class="lesson-status-icon lesson-status-pending" aria-label="Not started">' +
          '<span class="lesson-status-dot"></span>' +
          '</span>';
      }

      var btnHtml;
      if (isLocked) {
        btnHtml = '<button class="btn btn-sm btn-outline" disabled>Locked</button>';
      } else if (isCompleted) {
        btnHtml = '<button class="btn btn-sm btn-outline" data-start-lesson="' + lesson.id + '">Review</button>';
      } else {
        btnHtml = '<button class="btn btn-sm btn-primary" data-start-lesson="' + lesson.id + '">Start</button>';
      }

      item.innerHTML = iconHtml +
        '<div class="lesson-info">' +
        '<h4 class="lesson-item-title">' + escapeHtml(lesson.title) + '</h4>' +
        '<span class="lesson-meta">' + escapeHtml(lesson.duration || '') +
        (lesson.difficulty ? ' &middot; ' + escapeHtml(lesson.difficulty) : '') +
        '</span>' +
        '</div>' +
        btnHtml;

      container.appendChild(item);
    });

    // Bind start/review buttons
    container.querySelectorAll('[data-start-lesson]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lessonId = this.getAttribute('data-start-lesson');
        navigate('lesson', { moduleId: mod.id, lessonId: lessonId });
      });
    });
  }

  // ----------------------------------------------------------
  // 10c. SIMULATION TAB
  // ----------------------------------------------------------
  function renderSimulationTab(mod, ms, moduleId) {
    var container = document.getElementById('simulation-area');
    if (!container) return;

    if (!mod.simulation || !mod.simulation.render) {
      container.innerHTML =
        '<div class="empty-state">' +
        '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
        '<circle cx="32" cy="32" r="28" fill="#f3f2f1"/>' +
        '<path d="M24 8h16M28 8v20l-12 24a4 4 0 003.5 6h25a4 4 0 003.5-6L36 28V8" stroke="#a19f9d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
        '</svg>' +
        '<p class="empty-state-text">No simulation available for this module yet.</p>' +
        '</div>';
      return;
    }

    container.innerHTML = '';

    // Simulation header
    var header = document.createElement('div');
    header.className = 'simulation-header';
    header.innerHTML =
      '<h3>' + escapeHtml(mod.simulation.title || 'Simulation') + '</h3>' +
      '<p>' + escapeHtml(mod.simulation.description || '') + '</p>';
    container.appendChild(header);

    // Task list overview
    if (mod.simulation.tasks && mod.simulation.tasks.length > 0) {
      var taskList = document.createElement('div');
      taskList.className = 'simulation-tasks';
      mod.simulation.tasks.forEach(function (task) {
        var taskEl = document.createElement('div');
        taskEl.className = 'simulation-task-item';
        taskEl.innerHTML =
          '<span class="simulation-task-points">' + (task.points || 0) + ' pts</span>' +
          '<span class="simulation-task-instruction">' + escapeHtml(task.instruction) + '</span>';
        taskList.appendChild(taskEl);
      });
      container.appendChild(taskList);
    }

    // Render area for the simulation's custom UI
    var simUI = document.createElement('div');
    simUI.className = 'simulation-render-area';
    container.appendChild(simUI);

    try {
      mod.simulation.render(simUI, {
        completeTask: function (taskId) {
          app.toast('Task completed!', 'success');
        },
        completeSim: function () {
          state.modules[moduleId].simCompleted = true;
          saveState();
          app.toast('Simulation completed!', 'success');
          // Refresh module view
          renderModuleView(moduleId);
          updateOverallProgressRing();
          updateDashboardStats();
        }
      });
    } catch (e) {
      console.error('[M365App] Simulation render error:', e);
      simUI.innerHTML = '<p class="error-text">Failed to load simulation.</p>';
    }
  }

  // ----------------------------------------------------------
  // 10d. QUIZ TAB / ENGINE
  // ----------------------------------------------------------
  var quizState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    moduleId: null,
    autoAdvanceTimer: null
  };

  function renderQuizTab(mod, ms, moduleId) {
    var container = document.getElementById('quiz-area');
    if (!container) return;

    if (!mod.quiz || mod.quiz.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
        '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
        '<circle cx="32" cy="32" r="28" fill="#f3f2f1"/>' +
        '<circle cx="32" cy="32" r="18" stroke="#a19f9d" stroke-width="2" fill="none"/>' +
        '<path d="M26 26a6 6 0 119 5.83V36" stroke="#a19f9d" stroke-width="2" stroke-linecap="round" fill="none"/>' +
        '<circle cx="32" cy="42" r="1.5" fill="#a19f9d"/>' +
        '</svg>' +
        '<p class="empty-state-text">No quiz available for this module yet.</p>' +
        '</div>';
      return;
    }

    // Show start screen or previous score
    container.innerHTML = '';
    var wrapper = document.createElement('div');
    wrapper.className = 'quiz-start-screen';

    var hasScore = ms.quizScore !== null;
    var passed = hasScore && ms.quizScore >= PASSING_SCORE;

    var heading = document.createElement('h3');
    heading.textContent = 'Knowledge Quiz';
    wrapper.appendChild(heading);

    var desc = document.createElement('p');
    desc.textContent = mod.quiz.length + ' questions to test your understanding.';
    wrapper.appendChild(desc);

    if (hasScore) {
      var prev = document.createElement('p');
      prev.className = 'quiz-previous-score';
      prev.innerHTML = 'Previous score: <strong>' + ms.quizScore + '%</strong>' +
        (passed ? ' <span class="badge badge-success">Passed</span>' : ' <span class="badge badge-error">Not passed</span>');
      wrapper.appendChild(prev);
    }

    var startBtn = document.createElement('button');
    startBtn.className = 'btn btn-primary';
    startBtn.textContent = hasScore ? 'Retake Quiz' : 'Start Quiz';
    startBtn.addEventListener('click', function () {
      startQuiz(mod.quiz, moduleId);
    });
    wrapper.appendChild(startBtn);

    container.appendChild(wrapper);
  }

  function startQuiz(questions, moduleId) {
    quizState.questions = questions;
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.answers = [];
    quizState.moduleId = moduleId;
    if (quizState.autoAdvanceTimer) {
      clearTimeout(quizState.autoAdvanceTimer);
      quizState.autoAdvanceTimer = null;
    }
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    var container = document.getElementById('quiz-area');
    if (!container) return;
    container.innerHTML = '';

    var q = quizState.questions[quizState.currentIndex];
    if (!q) {
      renderQuizResults();
      return;
    }

    var total = quizState.questions.length;
    var current = quizState.currentIndex + 1;

    // Progress bar
    var progressWrap = document.createElement('div');
    progressWrap.className = 'quiz-progress';
    progressWrap.innerHTML =
      '<div class="quiz-progress-info"><span>Question ' + current + ' of ' + total + '</span></div>' +
      '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + ((current / total) * 100) + '%"></div></div>';
    container.appendChild(progressWrap);

    // Question
    var questionEl = document.createElement('div');
    questionEl.className = 'quiz-question';
    questionEl.innerHTML = '<h3 class="quiz-question-text">' + escapeHtml(q.question) + '</h3>';

    // Options
    var optionsList = document.createElement('div');
    optionsList.className = 'quiz-options';

    q.options.forEach(function (opt, idx) {
      var optBtn = document.createElement('button');
      optBtn.className = 'quiz-option';
      optBtn.setAttribute('data-index', idx);
      optBtn.innerHTML = '<span class="quiz-option-letter">' + String.fromCharCode(65 + idx) + '</span>' +
        '<span class="quiz-option-text">' + escapeHtml(opt) + '</span>';
      optBtn.addEventListener('click', function () {
        handleQuizAnswer(idx);
      });
      optionsList.appendChild(optBtn);
    });

    questionEl.appendChild(optionsList);
    container.appendChild(questionEl);

    // Feedback area (hidden initially)
    var feedback = document.createElement('div');
    feedback.className = 'quiz-feedback';
    feedback.id = 'quiz-feedback';
    feedback.hidden = true;
    container.appendChild(feedback);
  }

  function handleQuizAnswer(selectedIndex) {
    var q = quizState.questions[quizState.currentIndex];
    var isCorrect = selectedIndex === q.correct;

    if (isCorrect) quizState.score++;
    quizState.answers.push({ questionId: q.id, selected: selectedIndex, correct: isCorrect });

    // Disable all option buttons and highlight
    var options = document.querySelectorAll('.quiz-option');
    options.forEach(function (opt) {
      opt.disabled = true;
      var idx = parseInt(opt.getAttribute('data-index'), 10);
      if (idx === q.correct) {
        opt.classList.add('quiz-option-correct');
      }
      if (idx === selectedIndex && !isCorrect) {
        opt.classList.add('quiz-option-incorrect');
      }
    });

    // Show feedback
    var feedback = document.getElementById('quiz-feedback');
    if (feedback) {
      feedback.hidden = false;
      feedback.className = 'quiz-feedback ' + (isCorrect ? 'quiz-feedback-correct' : 'quiz-feedback-incorrect');
      feedback.innerHTML =
        '<p class="quiz-feedback-title">' + (isCorrect ? 'Correct!' : 'Incorrect') + '</p>' +
        '<p class="quiz-feedback-explanation">' + escapeHtml(q.explanation || '') + '</p>';

      // Next button
      var nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-primary btn-sm quiz-next-btn';
      nextBtn.textContent = quizState.currentIndex < quizState.questions.length - 1 ? 'Next Question' : 'See Results';
      nextBtn.addEventListener('click', function () {
        if (quizState.autoAdvanceTimer) {
          clearTimeout(quizState.autoAdvanceTimer);
          quizState.autoAdvanceTimer = null;
        }
        advanceQuiz();
      });
      feedback.appendChild(nextBtn);

      // Auto-advance timer
      quizState.autoAdvanceTimer = setTimeout(function () {
        quizState.autoAdvanceTimer = null;
        advanceQuiz();
      }, QUIZ_AUTO_ADVANCE);
    }
  }

  function advanceQuiz() {
    if (quizState.autoAdvanceTimer) {
      clearTimeout(quizState.autoAdvanceTimer);
      quizState.autoAdvanceTimer = null;
    }
    quizState.currentIndex++;
    if (quizState.currentIndex >= quizState.questions.length) {
      renderQuizResults();
    } else {
      renderQuizQuestion();
    }
  }

  function renderQuizResults() {
    var container = document.getElementById('quiz-area');
    if (!container) return;
    container.innerHTML = '';

    var total = quizState.questions.length;
    var score = quizState.score;
    var pct = Math.round((score / total) * 100);
    var grade = getLetterGrade(pct);
    var passed = pct >= PASSING_SCORE;
    var moduleId = quizState.moduleId;

    // Save score
    if (moduleId && state.modules[moduleId]) {
      state.modules[moduleId].quizScore = pct;
      saveState();
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'quiz-results';

    // Animated score display
    wrapper.innerHTML =
      '<div class="quiz-results-header">' +
      '<h3 class="quiz-results-title">Quiz Complete!</h3>' +
      '</div>' +
      '<div class="quiz-score-display">' +
      '<div class="quiz-score-circle ' + (passed ? 'quiz-score-pass' : 'quiz-score-fail') + '">' +
      '<span class="quiz-score-number" id="quiz-score-animated">0</span>' +
      '<span class="quiz-score-total">/ ' + total + '</span>' +
      '</div>' +
      '<div class="quiz-score-details">' +
      '<span class="quiz-grade">' + grade + '</span>' +
      '<span class="quiz-pct">' + pct + '%</span>' +
      (passed
        ? '<span class="badge badge-success">Passed</span>'
        : '<span class="badge badge-error">Not Passed (need 70%)</span>') +
      '</div>' +
      '</div>';

    // Action buttons
    var actions = document.createElement('div');
    actions.className = 'quiz-results-actions';

    var retakeBtn = document.createElement('button');
    retakeBtn.className = 'btn btn-outline';
    retakeBtn.textContent = 'Retake Quiz';
    retakeBtn.addEventListener('click', function () {
      var mod = modules[moduleId];
      if (mod && mod.quiz) {
        startQuiz(mod.quiz, moduleId);
      }
    });

    var backBtn = document.createElement('button');
    backBtn.className = 'btn btn-primary';
    backBtn.textContent = 'Back to Module';
    backBtn.addEventListener('click', function () {
      activateTab('lessons');
      state.currentTab = 'lessons';
      saveState();
    });

    actions.appendChild(retakeBtn);
    actions.appendChild(backBtn);
    wrapper.appendChild(actions);

    container.appendChild(wrapper);

    // Animated counter
    animateCounter('quiz-score-animated', 0, score, 600);

    // Update progress
    updateOverallProgressRing();
    updateDashboardStats();
  }

  function getLetterGrade(pct) {
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  }

  function animateCounter(elementId, from, to, duration) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var start = null;
    var diff = to - from;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var current = Math.round(from + diff * easeOutCubic(progress));
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ----------------------------------------------------------
  // 11. LESSON VIEW
  // ----------------------------------------------------------
  function renderLessonView(moduleId, lessonId) {
    var mod = modules[moduleId];
    if (!mod || !mod.lessons) {
      navigate('module', { moduleId: moduleId });
      return;
    }

    var lessonIndex = -1;
    var lesson = null;
    for (var i = 0; i < mod.lessons.length; i++) {
      if (mod.lessons[i].id === lessonId) {
        lesson = mod.lessons[i];
        lessonIndex = i;
        break;
      }
    }

    if (!lesson) {
      navigate('module', { moduleId: moduleId });
      return;
    }

    var ms = state.modules[moduleId] || { completedLessons: [] };
    var isCompleted = ms.completedLessons.indexOf(lessonId) !== -1;

    // Header
    setTextById('lesson-title', lesson.title);
    setTextById('lesson-reading-time', lesson.duration || '');
    setTextById('lesson-difficulty', lesson.difficulty || '');

    // Content
    var contentEl = document.getElementById('lesson-content');
    if (contentEl) {
      contentEl.innerHTML = lesson.content || '<p>No content available.</p>';
    }

    // Mark complete button
    var completeBtn = document.getElementById('btn-mark-complete');
    if (completeBtn) {
      if (isCompleted) {
        completeBtn.textContent = 'Completed';
        completeBtn.disabled = true;
        completeBtn.classList.add('btn-completed');
      } else {
        completeBtn.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
          '<path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg> Mark as Complete';
        completeBtn.disabled = false;
        completeBtn.classList.remove('btn-completed');
      }
    }

    // Prev / Next buttons
    var prevBtn = document.getElementById('btn-prev-lesson');
    var nextBtn = document.getElementById('btn-next-lesson');

    if (prevBtn) {
      prevBtn.disabled = lessonIndex <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = lessonIndex >= mod.lessons.length - 1;
    }

    // Back button
    var backBtn = document.getElementById('btn-back-to-module');
    if (backBtn) {
      // Remove old listener by replacing the element
      var newBackBtn = backBtn.cloneNode(true);
      backBtn.parentNode.replaceChild(newBackBtn, backBtn);
      newBackBtn.addEventListener('click', function () {
        navigate('module', { moduleId: moduleId });
      });
    }
  }

  function bindLessonNav() {
    // Mark complete
    document.getElementById('btn-mark-complete').addEventListener('click', function () {
      if (this.disabled) return;
      var moduleId = state.currentModule;
      var lessonId = state.currentLesson;
      if (!moduleId || !lessonId) return;

      var ms = state.modules[moduleId];
      if (!ms) return;

      if (ms.completedLessons.indexOf(lessonId) === -1) {
        ms.completedLessons.push(lessonId);
        saveState();
        app.toast('Lesson marked as complete!', 'success');
      }

      // Update button state
      this.textContent = 'Completed';
      this.disabled = true;
      this.classList.add('btn-completed');

      updateOverallProgressRing();

      // Auto-navigate to next lesson after short delay
      var mod = modules[moduleId];
      if (mod && mod.lessons) {
        var currentIdx = -1;
        for (var i = 0; i < mod.lessons.length; i++) {
          if (mod.lessons[i].id === lessonId) { currentIdx = i; break; }
        }
        if (currentIdx >= 0 && currentIdx < mod.lessons.length - 1) {
          var nextLessonId = mod.lessons[currentIdx + 1].id;
          setTimeout(function () {
            navigate('lesson', { moduleId: moduleId, lessonId: nextLessonId });
          }, 800);
        }
      }
    });

    // Previous lesson
    document.getElementById('btn-prev-lesson').addEventListener('click', function () {
      if (this.disabled) return;
      var mod = modules[state.currentModule];
      if (!mod || !mod.lessons) return;
      var currentIdx = -1;
      for (var i = 0; i < mod.lessons.length; i++) {
        if (mod.lessons[i].id === state.currentLesson) { currentIdx = i; break; }
      }
      if (currentIdx > 0) {
        navigate('lesson', { moduleId: state.currentModule, lessonId: mod.lessons[currentIdx - 1].id });
      }
    });

    // Next lesson
    document.getElementById('btn-next-lesson').addEventListener('click', function () {
      if (this.disabled) return;
      var mod = modules[state.currentModule];
      if (!mod || !mod.lessons) return;
      var currentIdx = -1;
      for (var i = 0; i < mod.lessons.length; i++) {
        if (mod.lessons[i].id === state.currentLesson) { currentIdx = i; break; }
      }
      if (currentIdx >= 0 && currentIdx < mod.lessons.length - 1) {
        navigate('lesson', { moduleId: state.currentModule, lessonId: mod.lessons[currentIdx + 1].id });
      }
    });
  }

  // ----------------------------------------------------------
  // 12. TOAST NOTIFICATIONS
  // ----------------------------------------------------------
  var activeToasts = [];

  function toast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) return;

    // Enforce limit
    while (activeToasts.length >= TOAST_LIMIT) {
      dismissToast(activeToasts[0]);
    }

    var el = document.createElement('div');
    el.className = 'toast toast-' + type;

    // Icon
    var iconSvg = getToastIcon(type);

    el.innerHTML = iconSvg +
      '<span class="toast-message">' + escapeHtml(message) + '</span>' +
      '<button class="toast-close" aria-label="Dismiss">&times;</button>';

    // Close button handler
    el.querySelector('.toast-close').addEventListener('click', function () {
      dismissToast(el);
    });

    container.appendChild(el);
    activeToasts.push(el);

    // Trigger slide-in animation
    void el.offsetWidth;
    el.classList.add('toast-visible');

    // Auto-dismiss
    var timer = setTimeout(function () {
      dismissToast(el);
    }, TOAST_DURATION);

    el._toastTimer = timer;
  }

  function dismissToast(el) {
    if (!el || !el.parentNode) return;
    if (el._toastTimer) clearTimeout(el._toastTimer);

    el.classList.remove('toast-visible');
    el.classList.add('toast-dismissing');

    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      var idx = activeToasts.indexOf(el);
      if (idx !== -1) activeToasts.splice(idx, 1);
    }, 300);
  }

  function getToastIcon(type) {
    switch (type) {
      case 'success':
        return '<svg class="toast-icon" width="20" height="20" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      case 'error':
        return '<svg class="toast-icon" width="20" height="20" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
      case 'warning':
        return '<svg class="toast-icon" width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M8 1l7 13H1L8 1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><line x1="8" y1="6" x2="8" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="12" r="0.75" fill="currentColor"/></svg>';
      default: // info
        return '<svg class="toast-icon" width="20" height="20" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2"/><line x1="8" y1="7" x2="8" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="5" r="0.75" fill="currentColor"/></svg>';
    }
  }

  // ----------------------------------------------------------
  // 13. MODAL
  // ----------------------------------------------------------
  function showModal(options) {
    options = options || {};
    var overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    setTextById('modal-title', options.title || 'Confirm');
    var body = document.getElementById('modal-body');
    if (body) body.innerHTML = options.body || '<p>Are you sure?</p>';

    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');

    var confirmBtn = document.getElementById('modal-confirm');
    var cancelBtn = document.getElementById('modal-cancel');
    var closeBtn = document.getElementById('modal-close');

    function close() {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
    }

    // Clone to remove old handlers
    var newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    newConfirm.textContent = options.confirmText || 'Confirm';
    newConfirm.addEventListener('click', function () {
      close();
      if (options.onConfirm) options.onConfirm();
    });

    var newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
    newCancel.addEventListener('click', close);

    var newClose = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newClose, closeBtn);
    newClose.addEventListener('click', close);

    // Close on overlay click
    overlay.addEventListener('click', function handler(e) {
      if (e.target === overlay) {
        close();
        overlay.removeEventListener('click', handler);
      }
    });
  }

  // ----------------------------------------------------------
  // 14. DASHBOARD CARD & BUTTON BINDINGS
  // ----------------------------------------------------------
  function bindDashboardCards() {
    // Module cards (the article elements)
    document.querySelectorAll('.module-card[data-module]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        // Don't navigate if the button itself was clicked (it has its own handler)
        if (e.target.closest('.module-card-btn')) return;
        var moduleId = this.getAttribute('data-module');
        if (moduleId) navigate('module', { moduleId: moduleId });
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var moduleId = this.getAttribute('data-module');
          if (moduleId) navigate('module', { moduleId: moduleId });
        }
      });
    });

    // "Start Learning" buttons
    document.querySelectorAll('.module-card-btn[data-nav="module"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var moduleId = this.getAttribute('data-module');
        if (moduleId) navigate('module', { moduleId: moduleId });
      });
    });

    // "Back to Dashboard" button in module view
    document.querySelectorAll('.btn-back[data-nav="dashboard"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        navigate('dashboard');
      });
    });

    // Topnav logo
    var logo = document.querySelector('.topnav-logo[data-nav="dashboard"]');
    if (logo) {
      logo.addEventListener('click', function (e) {
        e.preventDefault();
        navigate('dashboard');
      });
    }
  }

  // ----------------------------------------------------------
  // 15. HASH-BASED ROUTING ON LOAD & POPSTATE
  // ----------------------------------------------------------
  function handleHashRoute() {
    var route = parseHash();
    switch (route.view) {
      case 'module':
        if (route.params && route.params.moduleId) {
          state.currentModule = route.params.moduleId;
          saveState();
          showView('module');
        } else {
          showView('dashboard');
        }
        break;
      case 'lesson':
        if (route.params && route.params.moduleId && route.params.lessonId) {
          state.currentModule = route.params.moduleId;
          state.currentLesson = route.params.lessonId;
          saveState();
          showView('lesson');
        } else {
          showView('dashboard');
        }
        break;
      case 'settings':
        showView('settings');
        break;
      default:
        showView('dashboard');
        break;
    }
  }

  // ----------------------------------------------------------
  // 16. UTILITIES
  // ----------------------------------------------------------
  function setTextById(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ----------------------------------------------------------
  // 17. INITIALIZATION
  // ----------------------------------------------------------
  function init() {
    // Bind all static UI
    bindSidebar();
    bindTabs();
    bindDashboardCards();
    bindLessonNav();

    // Handle popstate (browser back/forward)
    window.addEventListener('popstate', function () {
      handleHashRoute();
    });

    // Initial route
    handleHashRoute();
  }

  // ----------------------------------------------------------
  // 18. PUBLIC API — window.M365App
  // ----------------------------------------------------------
  var app = {
    registerModule: registerModule,
    navigate: navigate,
    toast: toast,
    getModuleProgress: getModuleProgress,
    getOverallProgress: getOverallProgress,
    showModal: showModal,

    // Internal — useful for modules
    getState: function () { return state; },
    saveState: saveState,
    updateProgress: function () {
      updateOverallProgressRing();
      updateDashboardStats();
      if (getCurrentView() === 'dashboard') renderDashboard();
    }
  };

  window.M365App = app;

  // ----------------------------------------------------------
  // 19. BOOT
  // ----------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
