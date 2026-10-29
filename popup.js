// popup.js - Settings management and localization

const TRANSLATIONS = {
  en: {
    subtitle: 'Post, thread screenshots & video/GIF recording',
    scaleLabel: 'Clarity / Resolution (Scale)',
    scale1Hint: '600px',
    scale15Name: '1.5x HD',
    scale15Hint: '~900px',
    scale2Name: '2x Ultra HD',
    scale2Hint: '~1200px (Top)',
    scale3Name: '3x 4K',
    scale3Hint: '1080p+ display',
    scaleDesc: 'Applies to screenshots and <b>video recordings</b>. For <b>1366×768</b> monitors, <b>2x</b> is ideal (~1200px, crisp text and clean UI without blur). 3x is designed for FullHD/4K screens.',
    engineLabel: 'Long Post Stitching Engine',
    engineCanvasTitle: 'Built-in Canvas (Recommended)',
    engineCanvasDesc: 'Stitches right inside the browser, instant speed, no Python/FFmpeg required.',
    enginePythonTitle: 'Python + FFmpeg server',
    enginePythonDesc: 'Processing via local script <code>stitcher.py</code> (port 5678).',
    pyChecking: 'Checking Python server...',
    pyBtnCheck: 'Check',
    pyHint: 'Run: <code>python stitcher.py --server</code>',
    pyOnlineFFmpeg: 'Online (Pillow + FFmpeg available)',
    pyOnlinePillow: 'Online (Pillow available)',
    pyOffline: 'Offline (port 5678)',
    contentLabel: 'Screenshot Content',
    hideActionBarText: 'Hide likes and action bar',
    hideActionBarHint: 'Clean screenshot without reply buttons, likes, retweets, and bookmarks counters.',
    videoLabel: 'Video Recording',
    videoFormatText: 'Video Format',
    optMp4: 'MP4 (H.264 / AAC for Telegram)',
    optWebm: 'WebM (VP9 / Opus)',
    recordSubtitlesText: 'Record subtitles on video',
    videoHint: 'MP4 (H.264) is ideal for Telegram (autoplay & looping in chats). When running <code>stitcher.py</code>, converts via FFmpeg without quality loss.',
    quoteCropLabel: 'Quotes (Lower Post)',
    quoteCropDefault: 'Default Quote Height',
    quote100: '100% (Entire)',
    quote75: '75% height',
    quote50: '50% height',
    quoteText: 'Text only (no images)',
    quoteCropHint: 'Crops lower post (quote), trimming huge pictures and freeing space for video. Also adjustable with slider directly in tweet menu.',
    folderLabel: 'Folder & File Saving',
    downloadFolderText: 'Subfolder in "Downloads":',
    alwaysAskPathText: 'Always prompt for folder (Save As)',
    folderHint: 'Files are saved to <code>Downloads/&lt;subfolder&gt;/</code>. The toggle opens standard OS dialog to choose any folder.',
    buttonVisibilityLabel: 'Button Visibility',
    quotesOnlyText: 'Only on opened post if it is a quote',
    buttonVisibilityHint: 'The menu button (<b>This Post</b> / <b>Entire Thread</b>) is added on the opened post page. Not shown in general feed.',
    actionsLabel: 'Screenshot Actions',
    autoCopyText: 'Copy screenshot to clipboard',
    autoDownloadText: 'Automatically save file (PNG / MP4)',
    savedNotice: 'Settings saved'
  },
  ru: {
    subtitle: 'Скриншоты постов, ветки и запись видео/GIF',
    scaleLabel: 'Чёткость / Разрешение (Scale)',
    scale1Hint: '600px',
    scale15Name: '1.5x HD',
    scale15Hint: '~900px',
    scale2Name: '2x Ultra HD',
    scale2Hint: '~1200px (Топ)',
    scale3Name: '3x 4K',
    scale3Hint: '1080p+ экран',
    scaleDesc: 'Применяется к скриншотам и <b>записи видео</b>. Для мониторов <b>1366×768</b> идеален режим <b>2x</b> (~1200px, чёткий текст и интерфейс без мыла). Режим 3x предназначен для экранов FullHD/4K.',
    engineLabel: 'Движок склейки длинных постов',
    engineCanvasTitle: 'Встроенный Canvas (Рекомендуется)',
    engineCanvasDesc: 'Склейка прямо в браузере, нулевая задержка, не требует установки Python/FFmpeg.',
    enginePythonTitle: 'Python + FFmpeg сервер',
    enginePythonDesc: 'Обработка через локальный скрипт <code>stitcher.py</code> (порт 5678).',
    pyChecking: 'Проверка Python-сервера...',
    pyBtnCheck: 'Проверить',
    pyHint: 'Запустите: <code>python stitcher.py --server</code>',
    pyOnlineFFmpeg: 'В сети (Pillow + FFmpeg доступен)',
    pyOnlinePillow: 'В сети (Pillow доступен)',
    pyOffline: 'Офлайн (порт 5678)',
    contentLabel: 'Содержимое скриншота',
    hideActionBarText: 'Скрывать лайки и панель кнопок',
    hideActionBarHint: 'Чистый скриншот без кнопок ответа, счетчиков лайков, ретвитов и закладок.',
    videoLabel: 'Запись видео',
    videoFormatText: 'Формат видео',
    optMp4: 'MP4 (H.264 / AAC для Telegram)',
    optWebm: 'WebM (VP9 / Opus)',
    recordSubtitlesText: 'Записывать субтитры на видео',
    videoHint: 'MP4 (H.264) идеален для Telegram (автовоспроизведение и циклы в чатах). При запуске <code>stitcher.py</code> конвертируется через FFmpeg без потери качества.',
    quoteCropLabel: 'Цитаты (Нижний пост)',
    quoteCropDefault: 'Высота цитаты по умолчанию',
    quote100: '100% (Целиком)',
    quote75: '75% высоты',
    quote50: '50% высоты',
    quoteText: 'До текста (без картинок)',
    quoteCropHint: 'Обрезает нижний пост (цитату), убирая огромные картинки и освобождая место под видео. Также настраивается ползунком прямо в меню твита.',
    folderLabel: 'Папка и сохранение файлов',
    downloadFolderText: 'Подпапка в «Загрузках»:',
    alwaysAskPathText: 'Всегда открывать выбор папки (Save As)',
    folderHint: 'Файлы сохраняются в <code>Загрузки/&lt;подпапка&gt;/</code>. Тумблер открывает стандартное окно Windows для выбора любой папки.',
    buttonVisibilityLabel: 'Отображение кнопки',
    quotesOnlyText: 'Только если открытый пост — цитата',
    buttonVisibilityHint: 'Кнопка с меню (<b>Этот пост</b> / <b>Вся ветка</b>) добавляется только на странице открытого поста. В общей ленте и комментариях посторонних пользователей кнопка не отображается.',
    actionsLabel: 'Действия при скриншоте',
    autoCopyText: 'Копировать скриншот в буфер обмена',
    autoDownloadText: 'Автоматически сохранять файл (PNG / MP4)',
    savedNotice: 'Настройки сохранены'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const scaleRadios = document.querySelectorAll('input[name="scale"]');
  const engineRadios = document.querySelectorAll('input[name="engine"]');
  const quotesOnlyCheckbox = document.getElementById('quotesOnly');
  const hideActionBarCheckbox = document.getElementById('hideActionBar');
  const recordSubtitlesCheckbox = document.getElementById('recordSubtitles');
  const videoFormatSelect = document.getElementById('videoFormat');
  const quoteCropSelect = document.getElementById('quoteCrop');
  const downloadFolderInput = document.getElementById('downloadFolder');
  const alwaysAskSavePathCheckbox = document.getElementById('alwaysAskSavePath');
  const autoCopyCheckbox = document.getElementById('autoCopy');
  const autoDownloadCheckbox = document.getElementById('autoDownload');
  const pythonStatusBox = document.getElementById('python-status-box');
  const pythonDot = document.getElementById('python-dot');
  const pythonStatusText = document.getElementById('python-status-text');
  const btnRecheckPy = document.getElementById('btn-recheck-py');
  const saveIndicator = document.getElementById('save-indicator');
  const langButtons = document.querySelectorAll('.lang-btn');

  const defaultLang = (navigator.language && navigator.language.startsWith('ru')) ? 'ru' : 'en';

  let currentSettings = {
    lang: defaultLang,
    scale: 2,
    engine: 'canvas',
    quotesOnly: false,
    hideActionBar: false,
    recordSubtitles: true,
    quoteCrop: '100',
    videoFormat: 'mp4',
    downloadFolder: 'Twitter_Media',
    alwaysAskSavePath: false,
    autoCopy: true,
    autoDownload: true,
    pythonPort: 5678,
    pythonMethod: 'pillow'
  };

  function applyLanguage(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.ru;
    currentSettings.lang = lang;

    // Update active state on language buttons
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Translate all elements with data-i18n
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        if (dict[key].includes('<') && dict[key].includes('>')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    document.documentElement.lang = lang;
  }

  // Load saved settings
  chrome.storage.local.get(['twScreenshotSettings'], (res) => {
    if (res && res.twScreenshotSettings) {
      currentSettings = { ...currentSettings, ...res.twScreenshotSettings };
    }

    applyLanguage(currentSettings.lang || defaultLang);

    // Apply to UI
    for (const r of scaleRadios) {
      if (Number(r.value) === Number(currentSettings.scale || 2)) r.checked = true;
    }
    for (const r of engineRadios) {
      if (r.value === currentSettings.engine) r.checked = true;
    }
    quotesOnlyCheckbox.checked = !!currentSettings.quotesOnly;
    if (hideActionBarCheckbox) {
      hideActionBarCheckbox.checked = !!currentSettings.hideActionBar;
    }
    if (recordSubtitlesCheckbox) {
      recordSubtitlesCheckbox.checked = currentSettings.recordSubtitles !== false;
    }
    if (videoFormatSelect && currentSettings.videoFormat) {
      videoFormatSelect.value = currentSettings.videoFormat;
    }
    if (quoteCropSelect) {
      quoteCropSelect.value = currentSettings.quoteCrop || '100';
    }
    if (downloadFolderInput && currentSettings.downloadFolder !== undefined) {
      downloadFolderInput.value = currentSettings.downloadFolder;
    }
    if (alwaysAskSavePathCheckbox) {
      alwaysAskSavePathCheckbox.checked = !!currentSettings.alwaysAskSavePath;
    }
    autoCopyCheckbox.checked = !!currentSettings.autoCopy;
    autoDownloadCheckbox.checked = !!currentSettings.autoDownload;

    updatePythonBoxVisibility();
    if (currentSettings.engine === 'python') {
      checkPythonStatus();
    }
  });

  // Language toggle clicks
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      applyLanguage(selectedLang);
      saveSettings();
    });
  });

  function showSaved() {
    saveIndicator.classList.add('visible');
    setTimeout(() => {
      saveIndicator.classList.remove('visible');
    }, 1500);
  }

  function saveSettings() {
    let selectedScale = 2;
    for (const r of scaleRadios) {
      if (r.checked) selectedScale = Number(r.value);
    }

    let selectedEngine = 'canvas';
    for (const r of engineRadios) {
      if (r.checked) selectedEngine = r.value;
    }

    currentSettings.scale = selectedScale;
    currentSettings.engine = selectedEngine;
    currentSettings.quotesOnly = quotesOnlyCheckbox.checked;
    if (hideActionBarCheckbox) {
      currentSettings.hideActionBar = hideActionBarCheckbox.checked;
    }
    if (recordSubtitlesCheckbox) {
      currentSettings.recordSubtitles = recordSubtitlesCheckbox.checked;
    }
    if (videoFormatSelect) {
      currentSettings.videoFormat = videoFormatSelect.value;
    }
    if (quoteCropSelect) {
      currentSettings.quoteCrop = quoteCropSelect.value;
    }
    if (downloadFolderInput) {
      currentSettings.downloadFolder = downloadFolderInput.value.trim();
    }
    if (alwaysAskSavePathCheckbox) {
      currentSettings.alwaysAskSavePath = alwaysAskSavePathCheckbox.checked;
    }
    currentSettings.autoCopy = autoCopyCheckbox.checked;
    currentSettings.autoDownload = autoDownloadCheckbox.checked;

    chrome.storage.local.set({ twScreenshotSettings: currentSettings }, () => {
      showSaved();
      updatePythonBoxVisibility();
      if (currentSettings.engine === 'python') {
        checkPythonStatus();
      }
    });
  }

  function updatePythonBoxVisibility() {
    const isPython = document.querySelector('input[name="engine"]:checked')?.value === 'python';
    if (isPython) {
      pythonStatusBox.classList.remove('hidden');
    } else {
      pythonStatusBox.classList.add('hidden');
    }
  }

  function checkPythonStatus() {
    const lang = currentSettings.lang === 'en' ? 'en' : 'ru';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.ru;

    pythonDot.className = 'status-dot';
    pythonStatusText.textContent = dict.pyChecking;

    chrome.runtime.sendMessage({ action: 'pingPython', port: currentSettings.pythonPort }, (res) => {
      if (res && res.online) {
        pythonDot.className = 'status-dot online';
        pythonStatusText.textContent = res.data?.has_ffmpeg ? dict.pyOnlineFFmpeg : dict.pyOnlinePillow;
      } else {
        pythonDot.className = 'status-dot offline';
        pythonStatusText.textContent = dict.pyOffline;
      }
    });
  }

  // Event Listeners for inputs
  scaleRadios.forEach(r => r.addEventListener('change', saveSettings));
  engineRadios.forEach(r => r.addEventListener('change', saveSettings));
  quotesOnlyCheckbox.addEventListener('change', saveSettings);
  if (hideActionBarCheckbox) {
    hideActionBarCheckbox.addEventListener('change', saveSettings);
  }
  if (recordSubtitlesCheckbox) {
    recordSubtitlesCheckbox.addEventListener('change', saveSettings);
  }
  if (videoFormatSelect) {
    videoFormatSelect.addEventListener('change', saveSettings);
  }
  if (quoteCropSelect) {
    quoteCropSelect.addEventListener('change', saveSettings);
  }
  if (downloadFolderInput) {
    downloadFolderInput.addEventListener('change', saveSettings);
    downloadFolderInput.addEventListener('blur', saveSettings);
  }
  if (alwaysAskSavePathCheckbox) {
    alwaysAskSavePathCheckbox.addEventListener('change', saveSettings);
  }
  autoCopyCheckbox.addEventListener('change', saveSettings);
  autoDownloadCheckbox.addEventListener('change', saveSettings);

  btnRecheckPy.addEventListener('click', checkPythonStatus);
});
