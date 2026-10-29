// content.js - X/Twitter Post & Thread Screenshoter
// Injected into x.com and twitter.com

(function() {
  'use strict';

  // SVG Icons
  const CAMERA_ICON_SVG = `
    <svg viewBox="0 0 24 24" class="tw-screenshot-icon" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  `;

  const CHEVRON_DOWN_SVG = `
    <svg viewBox="0 0 24 24" class="tw-chevron-icon" aria-hidden="true">
      <path d="M7 10l5 5 5-5z" fill="currentColor"></path>
    </svg>
  `;

  const THREAD_ICON_SVG = `
    <svg viewBox="0 0 24 24" class="tw-menu-svg" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.585 1.157 4.925 3.033 6.643L4 22l4.457-1.486C9.567 20.82 10.761 21 12 21c5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm0 16c-1.077 0-2.112-.178-3.076-.503l-.427-.144-2.487.829.742-2.336-.266-.334C5.467 14.225 4.5 12.802 4.5 11.258 4.5 7.25 7.865 4 12 4s7.5 3.25 7.5 7.258c0 4.009-3.365 7.258-7.5 7.258z"></path>
      <circle cx="8.5" cy="11.5" r="1.5"></circle>
      <circle cx="12" cy="11.5" r="1.5"></circle>
      <circle cx="15.5" cy="11.5" r="1.5"></circle>
    </svg>
  `;

  const VIDEO_ICON_SVG = `
    <svg viewBox="0 0 24 24" class="tw-menu-svg" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" fill="currentColor"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="currentColor"></rect>
    </svg>
  `;

  const STOP_ICON_SVG = `
    <svg class="tw-feather-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="currentColor"></rect>
    </svg>
  `;

  const REC_DOT_ICON_SVG = `
    <svg class="tw-rec-dot-svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  const defaultLang = (navigator.language && navigator.language.startsWith('ru')) ? 'ru' : 'en';

  const I18N = {
    en: {
      btnTooltip: 'Screenshot post or thread',
      menuHeader: 'Take a screenshot',
      thisPost: 'This post',
      thisPostDescQuote: 'Full post with quote',
      thisPostDescNormal: 'Screenshot this post only',
      entireThread: (n) => `Entire thread ${n > 1 ? `(${n})` : ''}`,
      entireThreadDesc: (n) => n > 1 ? `All ${n} thread messages` : 'Message chain',
      recordVideoReplyOnly: 'Record video (Reply only)',
      recordVideoReplyOnlyDesc: (fmt) => `Record only this post in ${fmt}`,
      recordVideoThread: 'Record video (with parent post)',
      recordVideoThreadDesc: (fmt) => `Thread with parent post in ${fmt}`,
      recordVideoGif: 'Record video / GIF',
      recordVideoGifDesc: (fmt) => `Auto-record loop cycle in ${fmt}`,
      recordVideoWithParent: 'Record video (with this comment)',
      recordVideoWithParentDesc: (fmt) => `Parent video + this comment in ${fmt}`,
      parentVideoOnly: 'Parent video only',
      parentVideoOnlyDesc: (fmt) => `Record video from post above in ${fmt}`,
      hideActionsTitle: 'Hide likes & buttons',
      hideActionsDesc: 'Hide reply, retweets, likes, bookmarks row',
      subtitlesTitle: 'Subtitles on video',
      subtitlesDesc: 'Burn player captions into file',
      quoteCropTitle: 'Quote / Lower post',
      cropStepText: 'Text',
      cropStepTextHint: 'Crop to text (no images)',
      cropStep50Hint: '50% quote height',
      cropStep75Hint: '75% quote height',
      cropStep100Hint: '100% (Entire)',
      toastCopied: 'Copied to clipboard!',
      toastExpUpdated: 'Extension was updated',
      toastExpUpdatedSub: 'Please refresh the page (press F5)',
      toastRecAlready: 'Recording in progress',
      toastRecAlreadySub: 'Please wait for current recording to finish',
      toastVidNotFound: 'Video not found',
      toastVidNotFoundSub: 'No playable media in post',
      toastPrepRec: 'Preparing recording...',
      toastRenderingThread: (n) => `Rendering dialog thread (${n} posts)...`,
      toastRenderingHiRes: (s) => `Rendering in high resolution (${s}x)...`,
      toastSnapshot: 'Capturing post layout',
      toastRecording: 'Recording video...',
      toastConvertingMp4: 'Converting to MP4...',
      toastEncodingH264: 'Encoding H.264 for Telegram without quality loss...',
      toastPyOffline: 'Python server offline',
      toastPyOfflineSub: 'Run run_server.bat for MP4. Click "Download" to save WebM.',
      toastMp4Success: (file, dur) => `${file} (${dur.toFixed(1)}s, MP4)`,
      toastMp4Title: 'Video saved!',
      toastWebmSuccess: 'WebM recording completed!',
      toastThreadVideoSuccess: 'Thread video recording completed!',
      toastRecError: 'Recording error',
      toastRecErrorSub: 'Failed to record video',
      btnCopy: 'Copy',
      btnDownload: 'Download',
      btnStop: 'Stop',
      btnClose: 'Close',
      toastThreadPrep: 'Preparing thread...',
      toastThreadScrollTop: 'Scrolling to start of dialog chain',
      toastThreadStitching: 'Stitching entire thread...',
      toastThreadStitchingSub: (n) => `Combining ${n} messages into one image`,
      toastThreadSuccess: 'Entire thread captured!',
      toastSinglePrep: 'Preparing screenshot...',
      toastSingleRenderingHiRes: (s) => `Rendering in high resolution (${s}x)...`,
      toastSingleQuoteText: 'Expanding quote and full text',
      toastSingleAlign: 'Aligning post',
      toastSingleCapturing: 'Capturing post...',
      toastSingleCreatingHiRes: 'Creating high resolution snapshot',
      toastSingleSuccess: 'Screenshot captured!',
      toastSingleCopiedSuccess: 'Screenshot captured and copied!',
      toastSingleError: 'Screenshot error',
      toastSingleErrorSub: 'Failed to capture screenshot',
      viewFull: 'View full size',
      sec: 's',
      mb: 'MB',
      h264Tg: 'H.264 for Telegram',
      toastMp4ThreadReady: 'Thread video (MP4) ready!',
      toastMp4Ready: 'MP4 video ready!',
      toastMp4ConvError: 'MP4 conversion error',
      toastFfmpegCrash: 'FFmpeg failure',
      toastClickDownloadWebm: 'Click "Download" to save WebM.',
      toastConvError: 'Conversion error',
      toastConvErrorSub: 'Could not prepare MP4. Click "Download" to save WebM.',
      toastThreadCapturing: 'Capturing thread',
      toastThreadProcessingMsg: 'Processing message',
      toastThreadCopied: 'Thread copied to clipboard!',
      toastThreadError: 'Thread screenshot error',
      toastThreadErrorSub: 'Failed to capture thread screenshot',
      msgCount: 'posts',
      cropBadgeQuote: 'Quote'
    },
    ru: {
      btnTooltip: 'Скриншот поста или ветки',
      menuHeader: 'Сделать скриншот',
      thisPost: 'Этот пост',
      thisPostDescQuote: 'Пост вместе с цитатой целиком',
      thisPostDescNormal: 'Скриншот только этого сообщения',
      entireThread: (n) => `Вся ветка ${n > 1 ? `(${n})` : ''}`,
      entireThreadDesc: (n) => n > 1 ? `Все ${n} сообщ. ветки целиком` : 'Цепочка сообщений',
      recordVideoReplyOnly: 'Запись видео (только ответ)',
      recordVideoReplyOnlyDesc: (fmt) => `Запись только этого поста в ${fmt}`,
      recordVideoThread: 'Запись видео (с постом выше)',
      recordVideoThreadDesc: (fmt) => `Диалог вместе с родительским постом в ${fmt}`,
      recordVideoGif: 'Запись видео / GIF',
      recordVideoGifDesc: (fmt) => `Авто-запись цикла в ${fmt}`,
      recordVideoWithParent: 'Запись видео (с этим комментарием)',
      recordVideoWithParentDesc: (fmt) => `Родительское видео + этот ответ в ${fmt}`,
      parentVideoOnly: 'Только родительское видео',
      parentVideoOnlyDesc: (fmt) => `Запись видео из поста выше в ${fmt}`,
      hideActionsTitle: 'Без лайков и кнопок',
      hideActionsDesc: 'Скрыть строку лайков, ретвитов, закладок',
      subtitlesTitle: 'Субтитры на видео',
      subtitlesDesc: 'Впечатывать субтитры плеера в файл',
      quoteCropTitle: 'Цитата / нижний пост',
      cropStepText: 'Текст',
      cropStepTextHint: 'Обрезать до текста (без картинок)',
      cropStep50Hint: '50% высоты цитаты',
      cropStep75Hint: '75% высоты цитаты',
      cropStep100Hint: '100% (Целиком)',
      toastCopied: 'Скопировано в буфер!',
      toastExpUpdated: 'Расширение было обновлено',
      toastExpUpdatedSub: 'Пожалуйста, обновите страницу (нажмите F5)',
      toastRecAlready: 'Запись уже идёт',
      toastRecAlreadySub: 'Пожалуйста, дождитесь окончания текущей записи',
      toastVidNotFound: 'Видео не найдено',
      toastVidNotFoundSub: 'В посте нет воспроизводимого медиафайла',
      toastPrepRec: 'Подготовка записи...',
      toastRenderingThread: (n) => `Рендеринг ветки диалога (${n} поста)...`,
      toastRenderingHiRes: (s) => `Рендеринг в высоком разрешении (${s}x)...`,
      toastSnapshot: 'Снимок оформления поста',
      toastRecording: 'Запись видео...',
      toastConvertingMp4: 'Конвертация в MP4...',
      toastEncodingH264: 'Кодирование H.264 для Telegram без потери качества...',
      toastPyOffline: 'Python-сервер офлайн',
      toastPyOfflineSub: 'Запустите run_server.bat для MP4. Нажмите «Скачать», чтобы сохранить WebM.',
      toastMp4Success: (file, dur) => `${file} (${dur.toFixed(1)} сек, MP4)`,
      toastMp4Title: 'Видео сохранено!',
      toastWebmSuccess: 'Запись WebM завершена!',
      toastThreadVideoSuccess: 'Запись видео ветки завершена!',
      toastRecError: 'Ошибка записи',
      toastRecErrorSub: 'Не удалось записать видео',
      btnCopy: 'В буфер',
      btnDownload: 'Скачать',
      btnStop: 'Завершить',
      btnClose: 'Закрыть',
      toastThreadPrep: 'Подготовка ветки...',
      toastThreadScrollTop: 'Переход к началу цепочки диалога',
      toastThreadStitching: 'Склейка всей ветки...',
      toastThreadStitchingSub: (n) => `Объединение ${n} сообщений в одно изображение`,
      toastThreadSuccess: 'Вся ветка сохранена!',
      toastSinglePrep: 'Подготовка скриншота...',
      toastSingleRenderingHiRes: (s) => `Рендеринг в высоком разрешении (${s}x)...`,
      toastSingleQuoteText: 'Раскрываем цитату и полный текст',
      toastSingleAlign: 'Выравниваем пост',
      toastSingleCapturing: 'Захват сообщения...',
      toastSingleCreatingHiRes: 'Создание снимка в высоком разрешении',
      toastSingleSuccess: 'Скриншот успешно готов!',
      toastSingleCopiedSuccess: 'Скриншот готов и скопирован!',
      toastSingleError: 'Ошибка скриншота',
      toastSingleErrorSub: 'Не удалось создать скриншот',
      viewFull: 'Полноразмерный просмотр',
      sec: 'сек',
      mb: 'МБ',
      h264Tg: 'H.264 для Telegram',
      toastMp4ThreadReady: 'Видео с веткой (MP4) готово!',
      toastMp4Ready: 'Видео MP4 готово!',
      toastMp4ConvError: 'Ошибка конвертации в MP4',
      toastFfmpegCrash: 'Сбой FFmpeg',
      toastClickDownloadWebm: 'Нажмите «Скачать», чтобы сохранить WebM.',
      toastConvError: 'Ошибка конвертации',
      toastConvErrorSub: 'Не удалось подготовить MP4. Нажмите «Скачать», чтобы сохранить WebM.',
      toastThreadCapturing: 'Захват ветки',
      toastThreadProcessingMsg: 'Обработка сообщения',
      toastThreadCopied: 'Ветка скопирована в буфер!',
      toastThreadError: 'Ошибка скриншота ветки',
      toastThreadErrorSub: 'Не удалось создать скриншот ветки',
      msgCount: 'сообщ.',
      cropBadgeQuote: 'Цитата'
    }
  };

  function t(key, ...args) {
    const lang = config.lang === 'en' ? 'en' : 'ru';
    const dict = I18N[lang] || I18N.ru;
    const val = dict[key] ?? I18N.ru[key];
    if (typeof val === 'function') return val(...args);
    return val ?? key;
  }

  // Default configuration
  let config = {
    lang: defaultLang,
    scale: 2,             // 1, 1.5, 2 (Ultra HD), or 3 (Super HD)
    engine: 'canvas',     // 'canvas' or 'python'
    quotesOnly: false,    // true to show button only on quote tweets
    hideActionBar: false, // true to hide action bar (likes, retweets, bookmarks, replies)
    recordSubtitles: true, // true to record subtitles if enabled in video player
    quoteCrop: '100',     // '100', '75', '50', or 'text'
    videoFormat: 'mp4',   // 'mp4' (H.264 / AAC for Telegram) or 'webm'
    downloadFolder: 'Twitter_Media', // Subfolder inside Downloads/
    alwaysAskSavePath: false, // Show browser "Save As" file dialog
    autoCopy: true,       // auto-copy PNG to clipboard
    autoDownload: true,   // auto-download PNG file
    pythonPort: 5678,
    pythonMethod: 'pillow' // 'pillow' or 'ffmpeg'
  };

  // Load config from storage
  chrome.storage.local.get(['twScreenshotSettings'], (res) => {
    if (res && res.twScreenshotSettings) {
      config = { ...config, ...res.twScreenshotSettings };
    }
  });

  // Listen for config changes from popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.twScreenshotSettings) {
      config = { ...config, ...changes.twScreenshotSettings.newValue };
      refreshButtonsVisibility();
    }
  });

  // Helper: Sleep
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Check if tweet is a Quote Tweet
  function isQuoteTweet(tweetEl) {
    if (!tweetEl) return false;
    const userNames = tweetEl.querySelectorAll('[data-testid="User-Name"]');
    if (userNames.length > 1) return true;

    const quoteLink = tweetEl.querySelector('div[role="link"] a[href*="/status/"], div[tabindex="0"][role="link"]');
    if (quoteLink) return true;

    const tweetTexts = tweetEl.querySelectorAll('[data-testid="tweetText"]');
    if (tweetTexts.length > 1) return true;

    return false;
  }

  // Find quote tweet card element inside tweetEl
  function findQuoteCard(tweetEl) {
    if (!tweetEl) return null;

    // 1. Look for role="link" container that has User-Name or time
    const roleLinks = tweetEl.querySelectorAll('div[role="link"], div[tabindex="0"][role="link"]');
    for (const rl of roleLinks) {
      if (rl.querySelector('[data-testid="User-Name"]') || rl.querySelector('time') || rl.querySelector('a[href*="/status/"]')) {
        return rl;
      }
    }

    // 2. Find via second User-Name
    const userNames = tweetEl.querySelectorAll('[data-testid="User-Name"]');
    if (userNames.length > 1) {
      let cur = userNames[1];
      while (cur && cur !== tweetEl) {
        const style = window.getComputedStyle(cur);
        const br = parseFloat(style.borderRadius) || 0;
        const bw = parseFloat(style.borderWidth) || 0;
        if (br >= 6 && (bw > 0 || style.borderStyle !== 'none')) {
          return cur;
        }
        if (cur.getAttribute('role') === 'link') {
          return cur;
        }
        cur = cur.parentElement;
      }
      cur = userNames[1];
      while (cur && cur.parentElement && cur.parentElement !== tweetEl) {
        if (cur.parentElement.contains(userNames[0])) {
          return cur;
        }
        cur = cur.parentElement;
      }
      return cur;
    }

    return null;
  }

  // Apply height crop to lower quoted post / reply card ('100', '75', '50', or 'text')
  function applyQuoteCrop(tweetEl, mode = '100') {
    if (!tweetEl || mode === '100') return () => {};
    const quoteCard = findQuoteCard(tweetEl);
    if (!quoteCard) return () => {};

    const restores = [];

    // Save previous styles of quoteCard
    const prevMaxH = quoteCard.style.maxHeight;
    const prevH = quoteCard.style.height;
    const prevOverflow = quoteCard.style.overflow;
    restores.push(() => {
      quoteCard.style.maxHeight = prevMaxH;
      quoteCard.style.height = prevH;
      quoteCard.style.overflow = prevOverflow;
    });

    const naturalH = quoteCard.offsetHeight || 300;

    if (mode === 'text') {
      const tweetText = quoteCard.querySelector('[data-testid="tweetText"]');
      if (tweetText) {
        const cardRect = quoteCard.getBoundingClientRect();
        const textRect = tweetText.getBoundingClientRect();
        const textBottomRel = textRect.bottom - cardRect.top;
        const targetH = Math.max(60, Math.round(textBottomRel + 14));

        // Hide media elements below the text
        const mediaInsideQuote = quoteCard.querySelectorAll(
          '[data-testid="tweetPhoto"], [data-testid="videoPlayer"], [data-testid="videoComponent"], [data-testid="card.wrapper"], [data-testid="tweetPhotoContainer"], [data-testid="tweet-photo"]'
        );
        for (const m of mediaInsideQuote) {
          const prevDisp = m.style.display;
          m.style.setProperty('display', 'none', 'important');
          restores.push(() => { m.style.display = prevDisp; });
        }

        const imgs = quoteCard.querySelectorAll('img');
        for (const img of imgs) {
          if (!img.closest('[data-testid*="Avatar"], [data-testid="User-Name"], [data-testid*="avatar"]')) {
            const prevDisp = img.style.display;
            img.style.setProperty('display', 'none', 'important');
            restores.push(() => { img.style.display = prevDisp; });
          }
        }

        quoteCard.style.setProperty('max-height', `${targetH}px`, 'important');
        quoteCard.style.setProperty('height', `${targetH}px`, 'important');
        quoteCard.style.setProperty('overflow', 'hidden', 'important');
      } else {
        const targetH = Math.max(60, Math.round(naturalH * 0.45));
        quoteCard.style.setProperty('max-height', `${targetH}px`, 'important');
        quoteCard.style.setProperty('height', `${targetH}px`, 'important');
        quoteCard.style.setProperty('overflow', 'hidden', 'important');
      }
    } else if (mode === '50') {
      const targetH = Math.max(60, Math.round(naturalH * 0.5));
      quoteCard.style.setProperty('max-height', `${targetH}px`, 'important');
      quoteCard.style.setProperty('height', `${targetH}px`, 'important');
      quoteCard.style.setProperty('overflow', 'hidden', 'important');
      void quoteCard.offsetHeight;
      void tweetEl.offsetHeight;
    } else if (mode === '75') {
      const targetH = Math.max(80, Math.round(naturalH * 0.75));
      quoteCard.style.setProperty('max-height', `${targetH}px`, 'important');
      quoteCard.style.setProperty('height', `${targetH}px`, 'important');
      quoteCard.style.setProperty('overflow', 'hidden', 'important');
      void quoteCard.offsetHeight;
      void tweetEl.offsetHeight;
    }

    return () => {
      for (const r of restores) {
        try { r(); } catch (e) {}
      }
    };
  }

  // Get author handle of the opened page (e.g. "devyatto" from /devyatto/status/123)
  function getPageAuthorHandle() {
    const match = window.location.pathname.match(/^\/([^\/]+)\/status\//);
    if (match && match[1]) {
      return match[1].toLowerCase().replace(/[@]/g, '');
    }
    return '';
  }

  // Get tweet author handle accurately
  function getAuthorHandle(tweetEl) {
    if (!tweetEl) return '';

    // 1. Check data-testid="User-Name"
    const userNameBlock = tweetEl.querySelector('[data-testid="User-Name"]');
    if (userNameBlock) {
      const link = userNameBlock.querySelector('a[href^="/"]');
      if (link) {
        const href = link.getAttribute('href') || '';
        const part = href.split('/')[1];
        if (part && !['home', 'explore', 'notifications', 'messages', 'i'].includes(part.toLowerCase())) {
          return part.replace(/[@]/g, '').toLowerCase();
        }
      }
      const text = userNameBlock.textContent || '';
      const match = text.match(/@([a-zA-Z0-9_]+)/);
      if (match && match[1]) return match[1].toLowerCase();
    }

    // 2. Avatar link
    const avatarLink = tweetEl.querySelector('div[data-testid^="UserAvatar"] a[href^="/"]');
    if (avatarLink) {
      const parts = (avatarLink.getAttribute('href') || '').split('/');
      if (parts[1]) return parts[1].replace(/[@]/g, '').toLowerCase();
    }

    // 3. Fallback to general user link
    const userLink = tweetEl.querySelector('a[href^="/"][role="link"]');
    if (userLink) {
      const parts = (userLink.getAttribute('href') || '').split('/');
      if (parts[1] && !['status', 'home', 'explore'].includes(parts[1].toLowerCase())) {
        return parts[1].replace(/[@]/g, '').toLowerCase();
      }
    }

    return getPageAuthorHandle();
  }

  // Get author, ID and date for clean naming (<handle>-<tweetId>-<date>)
  function getTweetMeta(tweetEl) {
    let handle = getAuthorHandle(tweetEl) || 'tweet';
    let tweetId = '';
    let dateStr = '';

    try {
      const statusLink = tweetEl.querySelector('a[href*="/status/"]');
      if (statusLink) {
        const m = statusLink.getAttribute('href').match(/\/status\/(\d+)/);
        if (m && m[1]) tweetId = m[1];
      }
      if (!tweetId) {
        const pageStatusMatch = window.location.pathname.match(/\/status\/(\d+)/);
        if (pageStatusMatch && pageStatusMatch[1]) tweetId = pageStatusMatch[1];
      }
    } catch (e) {
      console.warn('[Screenshoter] Error parsing meta:', e);
    }

    if (!tweetId) {
      tweetId = Date.now().toString();
    }

    try {
      const times = Array.from(tweetEl.querySelectorAll('time'));
      const targetTimeEl = times.length > 0 ? times[times.length - 1] : null;
      const dt = targetTimeEl?.getAttribute('datetime');
      if (dt) {
        const d = new Date(dt);
        if (!isNaN(d.getTime())) {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          dateStr = `${y}${m}${day}`;
        }
      }
    } catch (e) {}

    if (!dateStr) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      dateStr = `${y}${m}${day}`;
    }

    return { handle, tweetId, dateStr };
  }

  // Check if a tweet is the target/focal post of the opened URL
  function isTargetFocalTweet(tweetEl, pageStatusId) {
    if (!tweetEl) return false;
    if (isMainOpenedPost(tweetEl)) return true;
    if (pageStatusId) {
      const links = tweetEl.querySelectorAll(`a[href*="/status/${pageStatusId}"]`);
      for (const link of links) {
        const insideQuote = link.closest('div[role="link"], div[tabindex="0"][role="link"]');
        if (!insideQuote || link.querySelector('time') || link.closest('[data-testid="User-Name"]')) {
          return true;
        }
      }
    }
    return false;
  }

  // Count how many tweets are in the conversation thread on the page
  function countThreadTweets() {
    const composer = document.querySelector('[data-testid="inline-reply-composer"]');
    const allTweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
    if (allTweets.length === 0) return 1;

    if (composer) {
      const threadTweets = allTweets.filter(t => !(t.compareDocumentPosition(composer) & Node.DOCUMENT_POSITION_PRECEDING));
      if (threadTweets.length > 0) return threadTweets.length;
    }

    const match = window.location.pathname.match(/\/status\/(\d+)/);
    const pageStatusId = match ? match[1] : null;
    const focalIdx = allTweets.findIndex(t => isTargetFocalTweet(t, pageStatusId));
    if (focalIdx >= 0) return focalIdx + 1;

    return allTweets.length;
  }

  // Automatically expand all "Show more" ("Показать еще") links
  async function expandTruncatedText(tweetEl) {
    const candidateSelectors = [
      '[data-testid="tweet-text-show-more-link"]',
      'button[role="button"]',
      'span'
    ];

    let expanded = false;
    for (const sel of candidateSelectors) {
      const items = tweetEl.querySelectorAll(sel);
      for (const el of items) {
        if (!el || el.closest('.tw-screenshot-btn') || el.closest('.tw-screenshot-menu')) continue;
        const text = (el.innerText || el.textContent || '').trim().toLowerCase();
        if (
          text === 'show more' ||
          text === 'показать еще' ||
          text === 'показать ещё' ||
          text === 'show this thread' ||
          text === 'показать эту ветку'
        ) {
          try {
            el.click();
            expanded = true;
          } catch (e) {}
        }
      }
    }

    if (expanded) {
      await sleep(200);
    }
  }

  // Active Dropdown Menu instance
  let activeMenu = null;
  let activeMenuBtn = null;

  function closeActiveMenu() {
    if (activeMenu) {
      if (activeMenuBtn) activeMenuBtn.classList.remove('tw-menu-open');
      activeMenu.remove();
      activeMenu = null;
      activeMenuBtn = null;
    }
  }

  // Global listeners to close dropdown menu
  document.addEventListener('click', (e) => {
    if (activeMenu && !activeMenu.contains(e.target) && !e.target.closest('.tw-screenshot-btn')) {
      closeActiveMenu();
    }
  }, { capture: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeMenu) {
      closeActiveMenu();
    }
  });

  window.addEventListener('scroll', () => {
    if (activeMenu && !document.body.classList.contains('tw-screenshot-capturing')) {
      closeActiveMenu();
    }
  }, { passive: true });

  // Robust finder for video element belonging strictly to a specific tweet
  function findTweetVideo(tweetEl) {
    if (!tweetEl) return null;

    // 1. Direct query in tweet
    let v = tweetEl.querySelector('video');
    if (v) return v;

    // 2. Query in [data-testid="videoPlayer"] or [data-testid="videoComponent"]
    const player = tweetEl.querySelector('[data-testid="videoPlayer"], [data-testid="videoComponent"]');
    if (player) {
      v = player.querySelector('video');
      if (v) return v;
      if (player.shadowRoot) {
        v = player.shadowRoot.querySelector('video');
        if (v) return v;
      }
    }

    // 3. Search open shadow roots strictly inside tweetEl
    try {
      const allEls = tweetEl.querySelectorAll('*');
      for (const el of allEls) {
        if (el.shadowRoot) {
          const sv = el.shadowRoot.querySelector('video');
          if (sv) return sv;
        }
      }
    } catch (e) {}

    // 4. Bounding box match ONLY within tweetEl bounds (and not belonging to other tweets)
    try {
      const allVideos = document.querySelectorAll('video');
      const tRect = tweetEl.getBoundingClientRect();
      for (const vid of allVideos) {
        const otherTweet = vid.closest('article[data-testid="tweet"]');
        if (otherTweet && otherTweet !== tweetEl) continue;

        const vRect = vid.getBoundingClientRect();
        if (vRect.width > 20 && vRect.height > 20) {
          const vMidX = (vRect.left + vRect.right) / 2;
          const vMidY = (vRect.top + vRect.bottom) / 2;
          if (vMidX >= tRect.left - 15 && vMidX <= tRect.right + 15 &&
              vMidY >= tRect.top - 15 && vMidY <= tRect.bottom + 15) {
            return vid;
          }
        }
      }
    } catch (e) {}

    return null;
  }

  // Ensure video element in tweetEl is mounted and initialized by Twitter's player
  async function ensureTweetVideoMounted(tweetEl) {
    if (!tweetEl) return null;

    let v = findTweetVideo(tweetEl);
    if (v && v.readyState >= 1) return v;

    // Scroll into comfortable view so Twitter's lazy observer initializes the player
    tweetEl.scrollIntoView({ block: 'center', behavior: 'instant' });
    await sleep(150);

    v = findTweetVideo(tweetEl);
    if (v && v.readyState >= 1) return v;

    // If Twitter shows a play button or unmounted video placeholder, click to mount <video>
    const playTrigger = tweetEl.querySelector(
      '[data-testid="playButton"], button[aria-label*="Play"], button[aria-label*="Воспроизвести"], div[aria-label*="Play"], div[aria-label*="Воспроизвести"], [data-testid="videoComponent"] [role="button"], [data-testid="videoPlayer"] [role="button"], [data-testid="videoComponent"], [data-testid="videoPlayer"]'
    );
    if (playTrigger) {
      try {
        playTrigger.click();
      } catch (e) {}

      // Wait up to 1.5s for Twitter's React to mount <video> and load metadata
      for (let i = 0; i < 15; i++) {
        await sleep(100);
        v = findTweetVideo(tweetEl);
        if (v) {
          if (v.readyState >= 1) return v;
          try {
            if (v.paused) await v.play();
          } catch (e2) {}
          if (v.readyState >= 1) return v;
        }
      }
    }

    v = findTweetVideo(tweetEl);
    if (v && v.paused) {
      try {
        await v.play();
      } catch (e) {
        v.muted = true;
        try { await v.play(); } catch (e2) {}
      }
    }
    return v;
  }

  // Check if a tweet contains a video or video player component
  function checkTweetHasVideo(tweetEl) {
    if (!tweetEl) return false;
    if (tweetEl.querySelector('video')) return true;
    if (tweetEl.querySelector('[data-testid="videoPlayer"], [data-testid="videoComponent"], [data-testid="playButton"], button[aria-label*="Play"], button[aria-label*="Воспроизвести"], div[aria-label*="Play"], div[aria-label*="Воспроизвести"]')) {
      return true;
    }
    const mediaContainer = tweetEl.querySelector('div[aria-label*="Embedded video"], div[aria-label*="Вложенное видео"]');
    if (mediaContainer) return true;
    if (findTweetVideo(tweetEl)) return true;
    return false;
  }

  // Find closest ancestor tweet above tweetEl that contains a video
  function findAncestorWithVideo(tweetEl) {
    if (!tweetEl) return null;
    const allTweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
    let targetIdx = allTweets.indexOf(tweetEl);
    if (targetIdx < 0) {
      targetIdx = allTweets.findIndex(t => t === tweetEl || t.contains(tweetEl));
    }
    if (targetIdx <= 0) return null;

    for (let i = targetIdx - 1; i >= 0; i--) {
      if (checkTweetHasVideo(allTweets[i])) {
        return allTweets[i];
      }
    }
    return null;
  }

  // Open Dropdown Menu anchored to the button
  function openScreenshotMenu(btn, tweetEl, isQuote) {
    closeActiveMenu();

    const currentTweet = (btn && btn.closest('article[data-testid="tweet"]')) || tweetEl;
    const allTweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
    let tweetIdx = allTweets.indexOf(currentTweet);
    if (tweetIdx < 0) {
      tweetIdx = allTweets.findIndex(t => t === currentTweet || t.contains(currentTweet));
    }
    const hasParentTweet = tweetIdx > 0;
    const count = countThreadTweets();
    const hasOwnVideo = checkTweetHasVideo(currentTweet);
    const parentVideoTweet = !hasOwnVideo ? findAncestorWithVideo(currentTweet) : null;
    const hasParentVideo = !!parentVideoTweet;
    const hasVideo = hasOwnVideo || hasParentVideo;
    const formatLabel = config.videoFormat === 'webm' ? 'WebM' : 'MP4';

    const menu = document.createElement('div');
    menu.className = 'tw-screenshot-menu';
    menu.setAttribute('role', 'menu');

    let videoItemHtml = '';
    if (hasOwnVideo) {
      if (hasParentTweet) {
        videoItemHtml = `
          <button type="button" class="tw-screenshot-menu-item" id="tw-opt-video">
            <div class="tw-menu-item-icon tw-icon-video">
              ${VIDEO_ICON_SVG}
            </div>
            <div class="tw-menu-item-text">
              <div class="tw-menu-item-title">${t('recordVideoReplyOnly')}</div>
              <div class="tw-menu-item-desc">${t('recordVideoReplyOnlyDesc', formatLabel)}</div>
            </div>
          </button>
          <button type="button" class="tw-screenshot-menu-item" id="tw-opt-video-thread">
            <div class="tw-menu-item-icon tw-icon-video">
              ${VIDEO_ICON_SVG}
            </div>
            <div class="tw-menu-item-text">
              <div class="tw-menu-item-title">${t('recordVideoThread')}</div>
              <div class="tw-menu-item-desc">${t('recordVideoThreadDesc', formatLabel)}</div>
            </div>
          </button>
        `;
      } else {
        videoItemHtml = `
          <button type="button" class="tw-screenshot-menu-item" id="tw-opt-video">
            <div class="tw-menu-item-icon tw-icon-video">
              ${VIDEO_ICON_SVG}
            </div>
            <div class="tw-menu-item-text">
              <div class="tw-menu-item-title">${t('recordVideoGif')}</div>
              <div class="tw-menu-item-desc">${t('recordVideoGifDesc', formatLabel)}</div>
            </div>
          </button>
        `;
      }
    } else if (hasParentVideo) {
      videoItemHtml = `
        <button type="button" class="tw-screenshot-menu-item" id="tw-opt-video-with-parent">
          <div class="tw-menu-item-icon tw-icon-video">
            ${VIDEO_ICON_SVG}
          </div>
          <div class="tw-menu-item-text">
            <div class="tw-menu-item-title">${t('recordVideoWithParent')}</div>
            <div class="tw-menu-item-desc">${t('recordVideoWithParentDesc', formatLabel)}</div>
          </div>
        </button>
        <button type="button" class="tw-screenshot-menu-item" id="tw-opt-video-parent-only">
          <div class="tw-menu-item-icon tw-icon-video">
            ${VIDEO_ICON_SVG}
          </div>
          <div class="tw-menu-item-text">
            <div class="tw-menu-item-title">${t('parentVideoOnly')}</div>
            <div class="tw-menu-item-desc">${t('parentVideoOnlyDesc', formatLabel)}</div>
          </div>
        </button>
      `;
    }

    menu.innerHTML = `
      <div class="tw-screenshot-menu-header">${t('menuHeader')}</div>
      <button type="button" class="tw-screenshot-menu-item" id="tw-opt-single">
        <div class="tw-menu-item-icon">
          ${CAMERA_ICON_SVG}
        </div>
        <div class="tw-menu-item-text">
          <div class="tw-menu-item-title">${t('thisPost')}</div>
          <div class="tw-menu-item-desc">${isQuote ? t('thisPostDescQuote') : t('thisPostDescNormal')}</div>
        </div>
      </button>

      <button type="button" class="tw-screenshot-menu-item" id="tw-opt-thread">
        <div class="tw-menu-item-icon">
          ${THREAD_ICON_SVG}
        </div>
        <div class="tw-menu-item-text">
          <div class="tw-menu-item-title">${t('entireThread', count)}</div>
          <div class="tw-menu-item-desc">${t('entireThreadDesc', count)}</div>
        </div>
      </button>

      ${videoItemHtml}

      <div class="tw-menu-divider"></div>

      <div class="tw-menu-toggle-wrap">
        <label class="tw-menu-checkbox-label">
          <input type="checkbox" id="tw-chk-hide-actions" ${config.hideActionBar ? 'checked' : ''} />
          <span class="tw-menu-checkbox-text">
            <span class="tw-chk-title">${t('hideActionsTitle')}</span>
            <span class="tw-chk-desc">${t('hideActionsDesc')}</span>
          </span>
        </label>
      </div>

      ${hasVideo ? `
      <div class="tw-menu-toggle-wrap">
        <label class="tw-menu-checkbox-label">
          <input type="checkbox" id="tw-chk-subtitles" ${config.recordSubtitles !== false ? 'checked' : ''} />
          <span class="tw-menu-checkbox-text">
            <span class="tw-chk-title">${t('subtitlesTitle')}</span>
            <span class="tw-chk-desc">${t('subtitlesDesc')}</span>
          </span>
        </label>
      </div>
      ` : ''}

      ${isQuote ? `
      <div class="tw-menu-divider"></div>
      <div class="tw-menu-crop-wrap">
        <div class="tw-crop-header">
          <span class="tw-crop-title">${t('quoteCropTitle')}</span>
          <span class="tw-crop-badge" id="tw-crop-badge">100%</span>
        </div>
        <div class="tw-crop-slider-container">
          <input type="range" id="tw-crop-range" min="0" max="3" step="1" value="3" class="tw-crop-range" />
          <div class="tw-crop-ticks-row">
            <span class="tw-crop-tick-mark"></span>
            <span class="tw-crop-tick-mark"></span>
            <span class="tw-crop-tick-mark"></span>
            <span class="tw-crop-tick-mark"></span>
          </div>
          <div class="tw-crop-labels-row">
            <span class="tw-crop-step" data-val="0" title="${t('cropStepTextHint')}">${t('cropStepText')}</span>
            <span class="tw-crop-step" data-val="1" title="${t('cropStep50Hint')}">50%</span>
            <span class="tw-crop-step" data-val="2" title="${t('cropStep75Hint')}">75%</span>
            <span class="tw-crop-step active" data-val="3" title="${t('cropStep100Hint')}">100%</span>
          </div>
        </div>
      </div>
      ` : ''}
    `;

    // Click on Single Tweet option
    menu.querySelector('#tw-opt-single').onclick = (e) => {
      e.stopPropagation();
      closeActiveMenu();
      captureTweet(currentTweet, isQuote);
    };

    // Click on Entire Thread option
    menu.querySelector('#tw-opt-thread').onclick = (e) => {
      e.stopPropagation();
      closeActiveMenu();
      captureThread(currentTweet);
    };

    // Click on Video Recording options
    if (hasOwnVideo) {
      const videoBtn = menu.querySelector('#tw-opt-video');
      if (videoBtn) {
        videoBtn.onclick = (e) => {
          e.stopPropagation();
          closeActiveMenu();
          recordTweetVideo(currentTweet, { withThreadContext: false });
        };
      }
      const videoThreadBtn = menu.querySelector('#tw-opt-video-thread');
      if (videoThreadBtn) {
        videoThreadBtn.onclick = (e) => {
          e.stopPropagation();
          closeActiveMenu();
          recordTweetVideo(currentTweet, { withThreadContext: true });
        };
      }
    } else if (hasParentVideo) {
      const videoWithParentBtn = menu.querySelector('#tw-opt-video-with-parent');
      if (videoWithParentBtn) {
        videoWithParentBtn.onclick = (e) => {
          e.stopPropagation();
          closeActiveMenu();
          recordTweetVideo(currentTweet, { withThreadContext: true, videoSourceTweet: parentVideoTweet });
        };
      }
      const videoParentOnlyBtn = menu.querySelector('#tw-opt-video-parent-only');
      if (videoParentOnlyBtn) {
        videoParentOnlyBtn.onclick = (e) => {
          e.stopPropagation();
          closeActiveMenu();
          recordTweetVideo(parentVideoTweet, { withThreadContext: false });
        };
      }
    }

    // Toggle hideActionBar
    const chk = menu.querySelector('#tw-chk-hide-actions');
    if (chk) {
      chk.onchange = (e) => {
        e.stopPropagation();
        config.hideActionBar = chk.checked;
        chrome.storage.local.set({
          twScreenshotSettings: { ...config, hideActionBar: chk.checked }
        });
      };
    }

    // Toggle subtitles
    if (hasVideo) {
      const chkSub = menu.querySelector('#tw-chk-subtitles');
      if (chkSub) {
        chkSub.onchange = (e) => {
          e.stopPropagation();
          config.recordSubtitles = chkSub.checked;
          chrome.storage.local.set({
            twScreenshotSettings: { ...config, recordSubtitles: chkSub.checked }
          });
        };
      }
    }

    // Toggle crop for quote tweets
    if (isQuote) {
      const cropRange = menu.querySelector('#tw-crop-range');
      const cropBadge = menu.querySelector('#tw-crop-badge');
      const cropSteps = menu.querySelectorAll('.tw-crop-step');

      const CROP_MODES = ['text', '50', '75', '100'];
      const CROP_LABELS = { text: t('cropStepText'), '50': '50%', '75': '75%', '100': '100%' };

      let currentMode = config.quoteCrop || '100';
      let initialIdx = CROP_MODES.indexOf(currentMode);
      if (initialIdx < 0) initialIdx = 3;

      if (cropRange && cropBadge) {
        cropRange.value = initialIdx;
        cropBadge.textContent = CROP_LABELS[currentMode] || '100%';
        cropSteps.forEach((s, idx) => {
          s.classList.toggle('active', idx === initialIdx);
        });

        const applyMode = (idx) => {
          const mode = CROP_MODES[idx] || '100';
          config.quoteCrop = mode;
          chrome.storage.local.set({
            twScreenshotSettings: { ...config, quoteCrop: mode }
          });
          cropRange.value = idx;
          cropBadge.textContent = CROP_LABELS[mode] || '100%';
          cropSteps.forEach((s, i) => {
            s.classList.toggle('active', i === idx);
          });
        };

        cropRange.oninput = (e) => {
          e.stopPropagation();
          applyMode(Number(cropRange.value));
        };

        cropSteps.forEach(step => {
          step.onclick = (e) => {
            e.stopPropagation();
            const val = Number(step.getAttribute('data-val'));
            applyMode(val);
          };
        });
      }
    }

    document.body.appendChild(menu);

    const btnRect = btn.getBoundingClientRect();
    const menuWidth = 270;
    let menuHeight = 210;
    if (hasVideo) menuHeight += 60;
    if (isQuote) menuHeight += 75;

    let left = btnRect.left - 10;
    if (left + menuWidth > window.innerWidth - 16) {
      left = window.innerWidth - menuWidth - 16;
    }
    if (left < 16) left = 16;

    let top = btnRect.bottom + 6;
    if (window.innerHeight - btnRect.bottom < menuHeight + 20 && btnRect.top > menuHeight + 20) {
      top = btnRect.top - menuHeight - 6;
      menu.classList.add('tw-menu-upward');
    }

    menu.style.left = `${Math.round(left)}px`;
    menu.style.top = `${Math.round(top)}px`;

    btn.classList.add('tw-menu-open');
    activeMenu = menu;
    activeMenuBtn = btn;
  }

  // Toast UI management
  let toastContainer = null;
  function getToastContainer() {
    if (!toastContainer || !document.body.contains(toastContainer)) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'tw-screenshot-toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast({ title, subtitle, loading = false, success = false, error = false, thumbUrl = null, videoUrl = null, onDownload = null, onCopy = null, onStop = null, duration = 5000 }) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `tw-screenshot-toast ${success ? 'tw-toast-success' : ''} ${error ? 'tw-toast-error' : ''}`;

    let iconHtml = '';
    if (loading) {
      iconHtml = '<div class="tw-toast-spinner"></div>';
    } else if (videoUrl) {
      iconHtml = `<video src="${videoUrl}" class="tw-toast-thumb" autoplay loop muted playsinline title="Нажмите для просмотра видео"></video>`;
    } else if (thumbUrl) {
      iconHtml = `<img src="${thumbUrl}" class="tw-toast-thumb" alt="Preview" title="Нажмите для просмотра в полный размер" />`;
    }

    let actionsHtml = '';
    if (onStop || onDownload || onCopy) {
      actionsHtml = `
        <div class="tw-toast-actions">
          ${onStop ? `<button class="tw-toast-btn tw-toast-btn-stop" id="tw-btn-stop">${STOP_ICON_SVG}<span>${t('btnStop')}</span></button>` : ''}
          ${onCopy ? `<button class="tw-toast-btn tw-toast-btn-primary" id="tw-btn-copy">${t('btnCopy')}</button>` : ''}
          ${onDownload ? `<button class="tw-toast-btn" id="tw-btn-dl">${t('btnDownload')}</button>` : ''}
        </div>
      `;
    }

    toast.innerHTML = `
      ${iconHtml}
      <div class="tw-toast-content">
        <div class="tw-toast-title">${title}</div>
        ${subtitle ? `<div class="tw-toast-subtitle">${subtitle}</div>` : ''}
        ${actionsHtml}
      </div>
      <button class="tw-toast-close" title="${t('btnClose')}">&times;</button>
    `;

    const closeBtn = toast.querySelector('.tw-toast-close');
    closeBtn.onclick = () => toast.remove();

    if (onStop) {
      const stopBtn = toast.querySelector('#tw-btn-stop');
      if (stopBtn) stopBtn.onclick = onStop;
    }

    if (onCopy) {
      const copyBtn = toast.querySelector('#tw-btn-copy');
      if (copyBtn) copyBtn.onclick = onCopy;
    }

    if (onDownload) {
      const dlBtn = toast.querySelector('#tw-btn-dl');
      if (dlBtn) dlBtn.onclick = onDownload;
    }

    if (thumbUrl) {
      const thumb = toast.querySelector('img.tw-toast-thumb');
      if (thumb) {
        thumb.onclick = () => openModalPreview(thumbUrl);
      }
    } else if (videoUrl) {
      const vThumb = toast.querySelector('video.tw-toast-thumb');
      if (vThumb) {
        vThumb.onclick = () => openModalVideoPreview(videoUrl);
      }
    }

    container.appendChild(toast);

    let timer = null;
    if (duration > 0 && !loading) {
      timer = setTimeout(() => {
        if (document.body.contains(toast)) toast.remove();
      }, duration);
    }

    return {
      update({ title: newTitle, subtitle: newSubtitle, loading: newLoading }) {
        const titleEl = toast.querySelector('.tw-toast-title');
        const subEl = toast.querySelector('.tw-toast-subtitle');
        if (titleEl && newTitle) titleEl.innerHTML = newTitle;
        if (subEl && newSubtitle) subEl.textContent = newSubtitle;
        if (newLoading === false) {
          const spinner = toast.querySelector('.tw-toast-spinner');
          if (spinner) spinner.remove();
        }
      },
      close() {
        if (timer) clearTimeout(timer);
        if (document.body.contains(toast)) toast.remove();
      }
    };
  }

  // Full-size Modal Preview
  function openModalPreview(dataUrl) {
    const overlay = document.createElement('div');
    overlay.className = 'tw-modal-overlay';
    overlay.innerHTML = `
      <div class="tw-modal-card">
        <div class="tw-modal-header">
          <span style="font-weight: 600;">Просмотр скриншота</span>
          <button class="tw-toast-close" style="font-size: 20px;">&times;</button>
        </div>
        <div class="tw-modal-img-wrap">
          <img src="${dataUrl}" class="tw-modal-img" alt="Screenshot" />
        </div>
      </div>
    `;

    overlay.onclick = (e) => {
      if (e.target === overlay || e.target.classList.contains('tw-toast-close')) {
        overlay.remove();
      }
    };
    document.body.appendChild(overlay);
  }

  // Full-size Modal Video Preview
  function openModalVideoPreview(videoUrl) {
    const overlay = document.createElement('div');
    overlay.className = 'tw-modal-overlay';
    overlay.innerHTML = `
      <div class="tw-modal-card">
        <div class="tw-modal-header">
          <span style="font-weight: 600;">Просмотр записи (WebM)</span>
          <button class="tw-toast-close" style="font-size: 20px;">&times;</button>
        </div>
        <div class="tw-modal-img-wrap" style="display: flex; align-items: center; justify-content: center; background: #000;">
          <video src="${videoUrl}" class="tw-modal-video" controls autoplay loop playsinline></video>
        </div>
      </div>
    `;

    overlay.onclick = (e) => {
      if (e.target === overlay || e.target.classList.contains('tw-toast-close')) {
        const vid = overlay.querySelector('video');
        if (vid) vid.pause();
        overlay.remove();
      }
    };
    document.body.appendChild(overlay);
  }

  // Draw rounded rect path safely for canvas clipping
  function drawRoundedRectPath(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Helper to trigger browser download for Data URLs with subfolder & Save As support
  function downloadDataUrl(dataUrl, filename) {
    if (!dataUrl) return;
    try {
      chrome.runtime.sendMessage({
        action: 'downloadImage',
        dataUrl: dataUrl,
        filename: filename,
        subfolder: config.downloadFolder || '',
        saveAs: !!config.alwaysAskSavePath
      }, (res) => {
        if (chrome.runtime.lastError || !res?.success) {
          fallbackDownloadUrl(dataUrl, filename);
        }
      });
    } catch (e) {
      fallbackDownloadUrl(dataUrl, filename);
    }
  }

  // Helper to trigger browser download for Blobs directly via Blob URL
  function downloadBlob(blob, filename) {
    if (!blob) return;
    try {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        // Give plenty of time (120 seconds) for browser to stream blob to disk before revoking
        setTimeout(() => {
          try { URL.revokeObjectURL(blobUrl); } catch (e) {}
        }, 120000);
      }, 1000);
    } catch (e) {
      console.error('[Screenshoter] downloadBlob error:', e);
    }
  }

  function fallbackDownloadUrl(url, filename, revoke = false) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      if (revoke && typeof url === 'string' && url.startsWith('blob:')) {
        setTimeout(() => {
          try { URL.revokeObjectURL(url); } catch (e) {}
        }, 120000);
      }
    }, 1000);
  }

  // Detect and extract active subtitle / closed caption text from video
  function getActiveSubtitleText(videoEl, tweetEl) {
    if (!videoEl) return '';

    // 1. Check videoEl.textTracks (standard HTML5 track API)
    try {
      if (videoEl.textTracks && videoEl.textTracks.length > 0) {
        for (let i = 0; i < videoEl.textTracks.length; i++) {
          const track = videoEl.textTracks[i];
          if (track.activeCues && track.activeCues.length > 0) {
            const cues = [];
            for (let j = 0; j < track.activeCues.length; j++) {
              const cue = track.activeCues[j];
              if (cue && cue.text) {
                const clean = cue.text.replace(/<[^>]+>/g, '').trim();
                if (clean) cues.push(clean);
              }
            }
            if (cues.length > 0) return cues.join('\n');
          }
        }
      }
    } catch (e) {}

    // 2. Check DOM overlay in video container
    try {
      const player = tweetEl ? tweetEl.querySelector('[data-testid="videoPlayer"], [data-testid="videoComponent"]') : null;
      const root = player || videoEl.parentElement;
      if (root) {
        // Query potential subtitle elements
        const candidates = root.querySelectorAll(
          '[data-testid*="caption"], [class*="caption"], [class*="subtitle"], [aria-live], div[style*="background"], span[style*="background"]'
        );
        for (const el of candidates) {
          if (el.closest('[data-testid="videoPlayerControls"], [role="progressbar"], button')) continue;
          const txt = (el.innerText || el.textContent || '').trim();
          if (txt && !txt.match(/^\d+:\d+/) && !txt.includes('/ 0:') && txt.length > 1 && txt.length < 350) {
            return txt;
          }
        }
      }
    } catch (e) {}

    return '';
  }

  // Draw crisp closed captions / subtitles on video frame canvas - matching Twitter's native styling
  function drawSubtitlesOnCanvas(ctx, rawText, vx, vy, vw, vh) {
    if (!rawText) return;

    const rawLines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (rawLines.length === 0) return;

    ctx.save();

    // Font size: approx 3.8% of video height (e.g. 15px on 400px video, 22px on 600px, 30px on 800px)
    const fontSize = Math.max(14, Math.min(36, Math.round(vh * 0.038)));
    // Clean medium weight font matching Twitter's native WebVTT cue rendering
    ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxBoxWidth = Math.max(80, vw - 24);

    // Auto-wrap long lines to fit nicely
    const finalLines = [];
    for (const rawLine of rawLines) {
      if (ctx.measureText(rawLine).width <= maxBoxWidth) {
        finalLines.push(rawLine);
      } else {
        const words = rawLine.split(' ');
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (ctx.measureText(testLine).width <= maxBoxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) finalLines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) finalLines.push(currentLine);
      }
    }

    if (finalLines.length === 0) {
      ctx.restore();
      return;
    }

    // Tight padding and line dimensions matching Twitter's WebVTT cue styling
    const padH = Math.max(4, Math.round(fontSize * 0.28));
    const lineBoxH = Math.round(fontSize * 1.28);
    const lineGap = 2;
    const totalH = finalLines.length * lineBoxH + (finalLines.length - 1) * lineGap;

    // Anchored close to bottom of video (just above control area)
    const bottomMargin = Math.max(10, Math.round(vh * 0.052));
    const startY = vy + vh - bottomMargin - totalH;
    const centerX = vx + vw / 2;

    for (let i = 0; i < finalLines.length; i++) {
      const line = finalLines[i];
      const textW = ctx.measureText(line).width;
      const boxW = Math.round(textW + padH * 2);
      const boxX = Math.round(centerX - boxW / 2);
      const boxY = Math.round(startY + i * (lineBoxH + lineGap));

      // 1. Semi-translucent dark background with crisp right-angle corners
      ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
      ctx.fillRect(boxX, boxY, boxW, lineBoxH);

      // 2. Crisp white text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line, centerX, boxY + lineBoxH / 2);
    }

    ctx.restore();
  }

  // Helper to identify action bar elements (reply, retweet, like, bookmark, share, etc.)
  function isActionBarElement(el) {
    if (!el) return false;
    if (el.closest && el.closest('div[role="group"]')) return true;
    const tid = (el.getAttribute && el.getAttribute('data-testid') || '').toLowerCase();
    if (
      tid.includes('retweet') || tid.includes('unretweet') ||
      tid.includes('reply') || tid.includes('like') || tid.includes('unlike') ||
      tid.includes('bookmark') || tid.includes('share')
    ) {
      return true;
    }
    const aria = (el.getAttribute && el.getAttribute('aria-label') || '').toLowerCase();
    if (
      aria.includes('repost') || aria.includes('retweet') || aria.includes('ретвит') ||
      aria.includes('reply') || aria.includes('ответить') ||
      aria.includes('like') || aria.includes('нравится') ||
      aria.includes('bookmark') || aria.includes('закладк') ||
      aria.includes('share') || aria.includes('поделиться')
    ) {
      return true;
    }
    return false;
  }

  // Helper to remove sticky headers, back button, "Relevant", "View quotes", reply boxes
  function preparePageForCapture(tweetEl) {
    const restores = [];

    const hideEl = (el) => {
      if (!el || el.__tw_hidden) return;
      el.__tw_hidden = true;
      const prevDisplay = el.style.display;
      el.style.setProperty('display', 'none', 'important');
      restores.push(() => {
        delete el.__tw_hidden;
        el.style.display = prevDisplay;
      });
    };

    // 1. Find and hide back button / "<- Post" header
    const backBtns = document.querySelectorAll(
      'button[aria-label="Back"], [data-testid="app-bar-back"], div[aria-label="Back"]'
    );
    for (const btn of backBtns) {
      let parent = btn;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        if (style.position === 'sticky' || style.position === 'fixed' || parent.getAttribute('data-testid') === 'TopNavBar') {
          hideEl(parent);
          break;
        }
        parent = parent.parentElement;
      }
    }

    // 2. Hide any sticky / fixed elements at the top of primaryColumn or body
    const stickyCandidates = document.querySelectorAll(
      'header, header[role="banner"], [data-testid="TopNavBar"], [data-testid="FloatingActionButton"], [data-testid="pill-label"], [data-testid="BottomBar"], [data-testid="sidebarColumn"], [data-testid="primaryColumn"] > div > div'
    );
    for (const el of stickyCandidates) {
      const style = window.getComputedStyle(el);
      if (style.position === 'sticky' || style.position === 'fixed') {
        const r = el.getBoundingClientRect();
        if (r.top <= 15 && r.height > 0 && r.height < 150) {
          hideEl(el);
        }
      }
    }

    // 3. Hide "View quotes" links
    const viewQuotes = document.querySelectorAll('a[href*="/quotes"], [data-testid="view-quotes"]');
    for (const el of viewQuotes) {
      if (tweetEl && tweetEl.contains(el)) continue;
      if (isActionBarElement(el)) continue;
      const container = el.closest('div[style*="flex"], div[class*="r-"]') || el;
      hideEl(container);
    }

    // 4. Hide "Relevant" sorting dropdown and reply composers
    const allSpans = document.querySelectorAll('span, button, a, div[role="button"]');
    for (const item of allSpans) {
      if (tweetEl && tweetEl.contains(item)) continue;
      if (isActionBarElement(item)) continue;
      const t = (item.textContent || '').trim().toLowerCase();
      if (t === 'relevant' || t.startsWith('relevant') || t === 'view quotes' || t === 'сначала актуальные' || t === 'показать цитаты') {
        const block = item.closest('div[style*="flex"], div[class*="r-"]') || item;
        hideEl(block);
      }
    }

    const composers = document.querySelectorAll(
      '[data-testid="inline-reply-composer"], [data-testid="tweetTextarea_0"], [aria-label*="Post text"], [aria-label*="Текст поста"]'
    );
    for (const c of composers) {
      const block = c.closest('div[style*="flex"], div[class*="r-"]') || c;
      hideEl(block);
    }
    const allTextboxes = document.querySelectorAll('div[role="textbox"]');
    for (const tb of allTextboxes) {
      if (!tweetEl.contains(tb)) {
        const composerWrapper = tb.closest('[data-testid*="composer"], div[class*="r-"]') || tb;
        hideEl(composerWrapper);
      }
    }

    // 5. Hide third-party extension badges (e.g. .xt-list-badge, .xt-profile-badge, [data-matched-key])
    const thirdPartyBadges = document.querySelectorAll(
      '.xt-list-badge, [class*="xt-"], [id*="xt-"], [data-matched-key], .xt-profile-badge, [class*="badge-arts-bookmark"]'
    );
    for (const b of thirdPartyBadges) {
      hideEl(b);
    }

    // Hide extra badges inside user name containers (e.g. [In: memes])
    const userNames = document.querySelectorAll('[data-testid="User-Name"]');
    for (const un of userNames) {
      const extraPills = un.querySelectorAll('span[class*="badge"], div[class*="badge"], span[style*="border"], a[style*="border"]');
      for (const p of extraPills) {
        if (!p.querySelector('svg[data-testid="icon-verified"]') && !p.getAttribute('data-testid')?.includes('verified')) {
          hideEl(p);
        }
      }
    }

    // Hide More (...) / Caret menu buttons and any adjacent custom action buttons (e.g. quick block/mute)
    const moreBtns = document.querySelectorAll(
      '[data-testid="caret"], button[aria-label="More"], button[aria-label="Ещё"], button[aria-label="Больше"], button[aria-label*="More actions"], button[aria-label*="Больше действий"]'
    );
    for (const mb of moreBtns) {
      if (isActionBarElement(mb)) continue;
      const btn = mb.closest('button, [role="button"]') || mb;
      if (btn && !isActionBarElement(btn)) {
        hideEl(btn);
        if (btn.parentElement && !isActionBarElement(btn.parentElement)) {
          for (const sib of btn.parentElement.children) {
            if (sib !== btn && !sib.contains(btn) && !btn.contains(sib) && !isActionBarElement(sib)) {
              hideEl(sib);
            }
          }
        }
      }
    }

    // Hide Follow and Subscribe buttons across the page
    const pageFollowBtns = document.querySelectorAll(
      'button[data-testid*="follow"], [data-testid*="-follow"], [data-testid="follow"], [aria-label*="Follow @"], [aria-label*="Читать @"], [aria-label*="Отслеживать @"], button[aria-label="Follow"], button[aria-label="Читать"], button[aria-label="Отслеживать"], button[data-testid*="subscribe"], [data-testid*="-subscribe"], [data-testid*="Subscribe"], [data-testid*="subscription"], [aria-label*="Subscribe"], [aria-label*="subscribe"], [aria-label*="Подписаться"], [aria-label*="подписаться"], [aria-label*="Оформить подписку"], a[href*="/creator-subscriptions"]'
    );
    for (const fb of pageFollowBtns) {
      hideEl(fb);
    }
    const allPageButtons = document.querySelectorAll('article[data-testid="tweet"] button, article[data-testid="tweet"] div[role="button"], article[data-testid="tweet"] a[role="button"]');
    for (const b of allPageButtons) {
      if (isActionBarElement(b)) continue;
      const txt = (b.textContent || '').trim().toLowerCase();
      if (
        txt === 'follow' || txt === 'читать' || txt === 'отслеживать' ||
        txt === 'subscribe' || txt === 'подписаться' || txt === 'оформить подписку' ||
        txt.startsWith('subscribe') || txt.startsWith('подписаться')
      ) {
        hideEl(b);
      }
    }

    // Hide Grok buttons across the page
    const pageGrokBtns = document.querySelectorAll(
      '[data-testid*="grok"], [data-testid*="Grok"], [aria-label*="Grok"], [aria-label*="grok"], [aria-label*="Грок"], a[href*="/i/grok"], button[aria-label*="Ask Grok"], button[aria-label*="Спросить Grok"]'
    );
    for (const gb of pageGrokBtns) {
      const btn = gb.closest('button, [role="button"], a') || gb;
      hideEl(btn);
    }

    return () => {
      for (const r of restores) {
        try { r(); } catch (e) {}
      }
    };
  }

  // Fast and safe image loader using createImageBitmap with Image fallback
  async function loadImage(url) {
    if (!url) throw new Error('Пустой URL изображения');

    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const bitmap = await createImageBitmap(blob);
      return bitmap;
    } catch (e) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => {
          console.error('[Screenshoter] Image load failed:', err);
          reject(new Error('Не удалось загрузить фрагмент изображения'));
        };
        img.src = url;
      });
    }
  }

  // Capture individual tweet element slices onto an HTML5 Canvas
  async function captureSingleTweetCanvas(tweetEl, isQuote) {
    // 1. Expand text
    await expandTruncatedText(tweetEl);

    // 2. Scroll tweet into viewport to ensure it is rendered and measurable
    tweetEl.scrollIntoView({ block: 'start', behavior: 'instant' });
    await sleep(150);

    const localRestores = [];
    const hideLocal = (el) => {
      if (!el || el.__tw_local_hidden) return;
      el.__tw_local_hidden = true;
      const prevDisplay = el.style.display;
      el.style.setProperty('display', 'none', 'important');
      localRestores.push(() => {
        delete el.__tw_local_hidden;
        el.style.display = prevDisplay;
      });
    };

    try {
      // If quote crop is active and post is a quote/has a quote card, apply crop
      if (isQuote && config.quoteCrop && config.quoteCrop !== '100') {
        const restoreCrop = applyQuoteCrop(tweetEl, config.quoteCrop);
        localRestores.push(restoreCrop);
      }

      // If hideActionBar is enabled, hide action bar and engagement counters (retweets, quotes, likes)
      if (config.hideActionBar) {
        const actionBars = tweetEl.querySelectorAll('div[role="group"]');
        for (const ab of actionBars) {
          hideLocal(ab);
        }

        const statLinks = tweetEl.querySelectorAll(
          'a[href*="/retweets"], a[href*="/likes"], a[href*="/quotes"]'
        );
        for (const link of statLinks) {
          const row = link.closest('div[style*="flex"], div[class*="r-"]') || link;
          // Never hide the row containing the post date and views
          if (row.querySelector('time') || row.closest('time')) {
            continue;
          }
          hideLocal(row);
        }
      }

      // Hide Follow and Subscribe buttons (e.g. [Follow] or [Subscribe] in top right header)
      const followBtns = tweetEl.querySelectorAll(
        'button[data-testid*="follow"], [data-testid*="-follow"], [data-testid="follow"], [aria-label*="Follow @"], [aria-label*="Читать @"], [aria-label*="Отслеживать @"], button[aria-label="Follow"], button[aria-label="Читать"], button[aria-label="Отслеживать"], button[data-testid*="subscribe"], [data-testid*="-subscribe"], [data-testid*="Subscribe"], [data-testid*="subscription"], [aria-label*="Subscribe"], [aria-label*="subscribe"], [aria-label*="Подписаться"], [aria-label*="подписаться"], [aria-label*="Оформить подписку"], a[href*="/creator-subscriptions"]'
      );
      for (const fb of followBtns) {
        hideLocal(fb);
      }
      const allButtonsInTweet = tweetEl.querySelectorAll('button, div[role="button"], a[role="button"]');
      for (const b of allButtonsInTweet) {
        if (isActionBarElement(b)) continue;
        const txt = (b.textContent || '').trim().toLowerCase();
        if (
          txt === 'follow' || txt === 'читать' || txt === 'отслеживать' ||
          txt === 'subscribe' || txt === 'подписаться' || txt === 'оформить подписку' ||
          txt.startsWith('subscribe') || txt.startsWith('подписаться')
        ) {
          hideLocal(b);
        }
      }

      // Hide Grok buttons in tweet header or action rows
      const grokBtns = tweetEl.querySelectorAll(
        '[data-testid*="grok"], [data-testid*="Grok"], [aria-label*="Grok"], [aria-label*="grok"], [aria-label*="Грок"], a[href*="/i/grok"], button[aria-label*="Ask Grok"], button[aria-label*="Спросить Grok"]'
      );
      for (const gb of grokBtns) {
        const btn = gb.closest('button, [role="button"], a') || gb;
        hideLocal(btn);
      }

      // Hide third-party badges inside this tweet
      const tweetBadges = tweetEl.querySelectorAll(
        '.xt-list-badge, [class*="xt-"], [id*="xt-"], [data-matched-key], .xt-profile-badge, [class*="badge-arts-bookmark"]'
      );
      for (const b of tweetBadges) {
        hideLocal(b);
      }

      const tweetUserName = tweetEl.querySelector('[data-testid="User-Name"]');
      if (tweetUserName) {
        const extraPills = tweetUserName.querySelectorAll('span[class*="badge"], div[class*="badge"], span[style*="border"], a[style*="border"]');
        for (const p of extraPills) {
          if (!p.querySelector('svg[data-testid="icon-verified"]') && !p.getAttribute('data-testid')?.includes('verified')) {
            hideLocal(p);
          }
        }
      }

      // Hide More (...) / Caret menu buttons and any adjacent custom action buttons (e.g. quick block/mute)
      const tweetMoreBtns = tweetEl.querySelectorAll(
        '[data-testid="caret"], button[aria-label="More"], button[aria-label="Ещё"], button[aria-label="Больше"], button[aria-label*="More actions"], button[aria-label*="Больше действий"]'
      );
      for (const mb of tweetMoreBtns) {
        if (isActionBarElement(mb)) continue;
        const btn = mb.closest('button, [role="button"]') || mb;
        if (btn && !isActionBarElement(btn)) {
          hideLocal(btn);
          if (btn.parentElement && !isActionBarElement(btn.parentElement)) {
            for (const sib of btn.parentElement.children) {
              if (sib !== btn && !sib.contains(btn) && !btn.contains(sib) && !isActionBarElement(sib)) {
                hideLocal(sib);
              }
            }
          }
        }
      }

      const quoteCard = findQuoteCard(tweetEl);
      const rect = tweetEl.getBoundingClientRect();
      const tweetDocTop = window.scrollY + rect.top;

      let bottomY = rect.bottom;

      if (!config.hideActionBar) {
        const actionBars = Array.from(tweetEl.querySelectorAll('div[role="group"]')).filter(
          ab => !ab.__tw_local_hidden && !ab.__tw_hidden && ab.offsetParent !== null && (!quoteCard || !quoteCard.contains(ab))
        );
        if (actionBars.length > 0) {
          const lastAb = actionBars[actionBars.length - 1];
          const abRect = lastAb.getBoundingClientRect();
          bottomY = Math.max(rect.bottom, abRect.bottom + 14);
        }
      } else {
        // When hiding action bar, find the lowest visible content element in the tweet
        // to guarantee neither the quote card, media, text, nor the bottom date/views row is cut off
        let contentBottom = rect.top;

        // Check quote card (quoted tweet / reply card)
        if (quoteCard && !quoteCard.__tw_local_hidden && !quoteCard.__tw_hidden && quoteCard.offsetParent !== null) {
          const qr = quoteCard.getBoundingClientRect();
          contentBottom = Math.max(contentBottom, qr.bottom + 8);
        }

        // Check all time elements (quote time and main tweet date/views row)
        // Skip elements inside quoteCard because quoteCard's bounding rect already bounds it
        const times = tweetEl.querySelectorAll('time');
        for (const tm of times) {
          if (tm.__tw_local_hidden || tm.__tw_hidden || tm.offsetParent === null) continue;
          if (quoteCard && quoteCard.contains(tm)) continue;
          const timeRow = tm.closest('div[style*="flex"], div[class*="r-"]') || tm;
          const tr = timeRow.getBoundingClientRect();
          contentBottom = Math.max(contentBottom, tr.bottom + 8);
        }

        // Check media (videos, images, photo cards, card wrappers)
        // Skip elements inside quoteCard so overflowing unclipped media doesn't inflate height!
        const medias = tweetEl.querySelectorAll('video, img, [data-testid="videoComponent"], [data-testid="tweetPhoto"], [data-testid="card.wrapper"]');
        for (const m of medias) {
          if (m.__tw_local_hidden || m.__tw_hidden || m.offsetParent === null) continue;
          if (quoteCard && quoteCard.contains(m)) continue;
          const mr = m.getBoundingClientRect();
          contentBottom = Math.max(contentBottom, mr.bottom + 8);
        }

        // Check text
        // Skip elements inside quoteCard
        const texts = tweetEl.querySelectorAll('[data-testid="tweetText"]');
        for (const tx of texts) {
          if (tx.__tw_local_hidden || tx.__tw_hidden || tx.offsetParent === null) continue;
          if (quoteCard && quoteCard.contains(tx)) continue;
          const txr = tx.getBoundingClientRect();
          contentBottom = Math.max(contentBottom, txr.bottom + 8);
        }

        if (contentBottom > rect.top + 30) {
          bottomY = contentBottom;
        }
      }

      let totalHeight = Math.round(bottomY - rect.top);
      if (totalHeight <= 0) {
        totalHeight = Math.max(100, Math.round(tweetEl.offsetHeight || 250));
      }

      const totalWidth = Math.max(100, Math.round(rect.width || tweetEl.offsetWidth || 600));
      const viewportHeight = document.documentElement.clientHeight || window.innerHeight;

      const slices = [];
      let capturedUpTo = 0;
      let stepCount = 0;
      let lastTweetOffset = -1;
      const maxSteps = 30;

      while (capturedUpTo < totalHeight - 2 && stepCount < maxSteps) {
        stepCount++;
        const targetScrollY = Math.max(0, tweetDocTop + capturedUpTo);
        window.scrollTo({ top: targetScrollY, behavior: 'instant' });
        await sleep(180);

        const curRect = tweetEl.getBoundingClientRect();
        const currentTweetOffset = Math.max(0, Math.round(-curRect.top));

        if (stepCount > 1 && Math.abs(currentTweetOffset - lastTweetOffset) < 3) {
          break;
        }
        lastTweetOffset = currentTweetOffset;

        const sliceTop = Math.max(0, curRect.top);
        const tweetYInViewport = Math.max(0, Math.round(sliceTop - curRect.top));
        const remainingH = totalHeight - tweetYInViewport;
        const visibleH = Math.min(viewportHeight - sliceTop, remainingH);

        if (visibleH <= 0) break;

        const res = await chrome.runtime.sendMessage({ action: 'captureVisibleTab' });
        if (!res || !res.success || !res.dataUrl) {
          throw new Error(res?.error || 'Не удалось захватить вкладку браузера.');
        }

        slices.push({
          dataUrl: res.dataUrl,
          sliceTop: sliceTop,
          sliceBottom: sliceTop + visibleH,
          visibleH: visibleH,
          rectLeft: curRect.left,
          rectWidth: curRect.width,
          destY: tweetYInViewport
        });

        capturedUpTo = tweetYInViewport + visibleH;
        if (capturedUpTo >= totalHeight - 2) break;
      }

      return await stitchSlicesOnCanvas(slices, totalWidth, totalHeight, tweetEl);
    } finally {
      for (const r of localRestores) {
        try { r(); } catch (e) {}
      }
    }
  }

  // Stitch slices onto an HTML5 Canvas and return the canvas object directly
  async function stitchSlicesOnCanvas(slices, totalWidth, totalHeight, tweetEl) {
    if (!slices || slices.length === 0) {
      throw new Error('Нет фрагментов для склейки');
    }

    const firstImg = await loadImage(slices[0].dataUrl);
    const imgW = firstImg.naturalWidth || firstImg.width;
    const imgH = firstImg.naturalHeight || firstImg.height;
    const viewportW = document.documentElement.clientWidth || window.innerWidth;
    const viewportH = document.documentElement.clientHeight || window.innerHeight;
    const scaleX = imgW / viewportW;
    const scaleY = imgH / viewportH;

    const canvasWidth = Math.max(10, Math.round(totalWidth * scaleX));
    const canvasHeight = Math.max(10, Math.round(totalHeight * scaleY));

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    let bg = window.getComputedStyle(tweetEl).backgroundColor;
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
      const isDark = document.documentElement.style.colorScheme === 'dark' ||
                     document.body.style.backgroundColor === 'rgb(0, 0, 0)';
      bg = isDark ? '#000000' : '#ffffff';
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      const img = (i === 0) ? firstImg : await loadImage(slice.dataUrl);
      const curImgW = img.naturalWidth || img.width;
      const curImgH = img.naturalHeight || img.height;

      const sx = Math.max(0, Math.round(slice.rectLeft * scaleX));
      const sy = Math.max(0, Math.round(slice.sliceTop * scaleY));
      const sw = Math.min(Math.round(slice.rectWidth * scaleX), curImgW - sx);
      const sh = Math.min(Math.round(slice.visibleH * scaleY), curImgH - sy);

      const dx = 0;
      const dy = Math.round(slice.destY * scaleY);
      const dw = Math.min(sw, canvasWidth - dx);
      const dh = Math.min(sh, canvasHeight - dy);

      if (sw > 0 && sh > 0 && dw > 0 && dh > 0) {
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }

    return {
      canvas,
      width: canvasWidth,
      height: canvasHeight
    };
  }

  // Stitch multiple tweet canvases vertically without Base64 overhead
  async function stitchThreadCanvases(tweetResults, sampleTweetEl) {
    if (!tweetResults || tweetResults.length === 0) {
      throw new Error('Нет фрагментов ветки для объединения');
    }

    if (tweetResults.length === 1) {
      const c = tweetResults[0].canvas;
      const dataUrl = c.toDataURL('image/png');
      const blob = await new Promise(r => c.toBlob(r, 'image/png'));
      return { canvas: c, dataUrl, blob, width: c.width, height: c.height };
    }

    let maxWidth = 0;
    for (const tr of tweetResults) {
      if (tr.canvas.width > maxWidth) maxWidth = tr.canvas.width;
    }

    const totalHeight = tweetResults.reduce((sum, tr) => sum + tr.canvas.height, 0);

    const masterCanvas = document.createElement('canvas');
    masterCanvas.width = maxWidth;
    masterCanvas.height = totalHeight;
    const ctx = masterCanvas.getContext('2d');

    // Fill background
    let bg = window.getComputedStyle(sampleTweetEl).backgroundColor;
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
      const isDark = document.documentElement.style.colorScheme === 'dark' ||
                     document.body.style.backgroundColor === 'rgb(0, 0, 0)';
      bg = isDark ? '#000000' : '#ffffff';
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, maxWidth, totalHeight);

    let curY = 0;
    for (let i = 0; i < tweetResults.length; i++) {
      const c = tweetResults[i].canvas;
      const dx = Math.max(0, Math.round((maxWidth - c.width) / 2));
      ctx.drawImage(c, dx, curY);
      curY += c.height;
    }

    const dataUrl = masterCanvas.toDataURL('image/png');
    const blob = await new Promise(r => masterCanvas.toBlob(r, 'image/png'));

    return {
      canvas: masterCanvas,
      dataUrl,
      blob,
      width: maxWidth,
      height: totalHeight
    };
  }

  // Main Screenshot Flow: Single Tweet
  async function captureTweet(tweetEl, isQuote) {
    const meta = getTweetMeta(tweetEl);
    const rawScale = Math.max(1, Number(config.scale) || 2);
    const screenWidth = window.screen.width || 1366;
    const maxSafeScale = Math.max(1, Math.floor((screenWidth / 620) * 10) / 10);
    const scaleFactor = Math.min(rawScale, maxSafeScale);
    let originalZoom = 1.0;

    const progressToast = showToast({
      title: t('toastSinglePrep'),
      subtitle: scaleFactor > 1 ? t('toastSingleRenderingHiRes', scaleFactor) : (isQuote ? t('toastSingleQuoteText') : t('toastSingleAlign')),
      loading: true,
      duration: 0
    });

    const originalScrollY = window.scrollY;
    const originalPaddingBottom = document.body.style.paddingBottom;
    const originalMinHeight = document.body.style.minHeight;
    let restoreElements = null;

    try {
      if (scaleFactor > 1) {
        try {
          const zoomRes = await chrome.runtime.sendMessage({ action: 'getZoom' });
          originalZoom = zoomRes?.zoom || 1.0;
          await chrome.runtime.sendMessage({ action: 'setZoom', zoom: originalZoom * scaleFactor });
          await sleep(220);
        } catch (zErr) {
          console.warn('[Screenshoter] Zoom adjustment failed:', zErr);
        }
      }

      restoreElements = preparePageForCapture(tweetEl);
      document.body.classList.add('tw-screenshot-capturing');

      const viewportHeight = window.innerHeight;
      document.body.style.minHeight = (document.body.scrollHeight + viewportHeight * 2) + 'px';
      document.body.style.paddingBottom = (viewportHeight * 2) + 'px';

      progressToast.update({
        title: t('toastSingleCapturing'),
        subtitle: t('toastSingleCreatingHiRes')
      });

      const canvasResult = await captureSingleTweetCanvas(tweetEl, isQuote);
      const finalCanvas = canvasResult.canvas;
      const finalDataUrl = finalCanvas.toDataURL('image/png');
      const finalBlob = await new Promise(r => finalCanvas.toBlob(r, 'image/png'));
      const finalWidth = canvasResult.width;
      const finalHeight = canvasResult.height;

      progressToast.close();

      const filename = `${meta.handle}-${meta.tweetId}-${meta.dateStr}.png`;

      // Copy to clipboard
      let copied = false;
      if (config.autoCopy && finalBlob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': finalBlob })
          ]);
          copied = true;
        } catch (clipErr) {
          console.warn('[Screenshoter] Clipboard error:', clipErr);
        }
      }

      // Download file
      if (config.autoDownload && finalDataUrl) {
        downloadDataUrl(finalDataUrl, filename);
      }

      showToast({
        title: copied ? t('toastSingleCopiedSuccess') : t('toastSingleSuccess'),
        subtitle: `${finalWidth} × ${finalHeight} px • @${meta.handle}`,
        success: true,
        thumbUrl: finalDataUrl,
        onCopy: async () => {
          if (finalBlob) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': finalBlob })]);
            showToast({ title: t('toastCopied'), duration: 2000 });
          }
        },
        onDownload: () => {
          downloadDataUrl(finalDataUrl, filename);
        },
        duration: 8000
      });

    } catch (err) {
      console.error('[Screenshoter] Capture error:', err);
      progressToast.close();
      const isContextInvalidated = err?.message?.includes('context invalidated') || !chrome.runtime?.id;
      showToast({
        title: isContextInvalidated ? t('toastExpUpdated') : t('toastSingleError'),
        subtitle: isContextInvalidated ? t('toastExpUpdatedSub') : (err.message || t('toastSingleErrorSub')),
        error: true,
        duration: 7000
      });
    } finally {
      if (scaleFactor > 1 && originalZoom) {
        try {
          await chrome.runtime.sendMessage({ action: 'setZoom', zoom: originalZoom });
        } catch (e) {}
      }
      if (restoreElements) {
        try { restoreElements(); } catch (e) {}
      }
      document.body.classList.remove('tw-screenshot-capturing');
      document.body.style.paddingBottom = originalPaddingBottom;
      document.body.style.minHeight = originalMinHeight;
      window.scrollTo({ top: originalScrollY, behavior: 'instant' });
    }
  }

  let isVideoRecordingInProgress = false;

  // Record tweet video / GIF in WebM with automatic loop cycle detection
  async function recordTweetVideo(tweetEl, { withThreadContext = false, videoSourceTweet = null } = {}) {
    if (isVideoRecordingInProgress) {
      showToast({
        title: 'Запись уже идёт',
        subtitle: 'Пожалуйста, дождитесь окончания текущей записи',
        duration: 3000
      });
      return;
    }
    isVideoRecordingInProgress = true;

    const videoTweet = videoSourceTweet || (checkTweetHasVideo(tweetEl) ? tweetEl : findAncestorWithVideo(tweetEl)) || tweetEl;
    const videoEl = await ensureTweetVideoMounted(videoTweet);
    if (!videoEl) {
      isVideoRecordingInProgress = false;
      showToast({
        title: t('toastVidNotFound'),
        subtitle: t('toastVidNotFoundSub'),
        error: true
      });
      return;
    }

    // Pause other videos on the page so their playback/audio does not interfere
    try {
      const allVideos = document.querySelectorAll('video');
      for (const ov of allVideos) {
        if (ov !== videoEl && !ov.paused) {
          try { ov.pause(); } catch (e) {}
        }
      }
    } catch (e) {}

    // Check thread hierarchy
    const allTweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
    let targetIdx = allTweets.indexOf(tweetEl);
    if (targetIdx < 0) {
      targetIdx = allTweets.findIndex(t => t === tweetEl || t.contains(tweetEl));
    }
    const isReply = targetIdx > 0;
    const captureAsThread = (withThreadContext && isReply) || (videoTweet !== tweetEl);

    let threadTweets = [tweetEl];
    if (captureAsThread) {
      const videoIdx = allTweets.indexOf(videoTweet);
      if (videoIdx >= 0 && videoIdx < targetIdx) {
        if (targetIdx - videoIdx <= 3) {
          threadTweets = allTweets.slice(videoIdx, targetIdx + 1);
        } else {
          // In deep threads, keep videoTweet at top and the closest ancestors leading to targetIdx
          threadTweets = [videoTweet, ...allTweets.slice(targetIdx - 2, targetIdx + 1)];
        }
      } else {
        const startIdx = Math.max(0, targetIdx - 3);
        threadTweets = allTweets.slice(startIdx, targetIdx + 1);
      }
    }
    const targetOffsetInThread = threadTweets.indexOf(tweetEl);
    const videoTweetOffsetInThread = threadTweets.indexOf(videoTweet);

    const rawScale = Math.max(1, Number(config.scale) || 2);
    const screenWidth = window.screen.width || 1366;
    const availWidth = Math.min(screenWidth, window.innerWidth || screenWidth);
    const maxSafeScale = Math.max(1, Math.floor((availWidth / 620) * 10) / 10);
    const scaleFactor = Math.min(rawScale, maxSafeScale);
    let originalZoom = 1.0;

    const prepToast = showToast({
      title: t('toastPrepRec'),
      subtitle: captureAsThread
        ? t('toastRenderingThread', threadTweets.length)
        : (scaleFactor > 1 ? t('toastRenderingHiRes', scaleFactor) : t('toastSnapshot')),
      loading: true,
      duration: 0
    });

    let restoreElements = null;
    const controlRestores = [];
    let animFrameId = null;
    let recToast = null;
    let isRecording = false;

    const originalScrollY = window.scrollY;
    const originalPaddingBottom = document.body.style.paddingBottom;
    const originalMinHeight = document.body.style.minHeight;

    try {
      // 1. Wait for video metadata if needed
      if (videoEl.readyState < 1) {
        await new Promise((resolve) => {
          const timer = setTimeout(resolve, 1200);
          videoEl.addEventListener('loadedmetadata', () => {
            clearTimeout(timer);
            resolve();
          }, { once: true });
        });
      }

      // 2. Hide player overlays (play buttons, scrubber bar) before capturing base
      for (const t of threadTweets) {
        const controls = t.querySelectorAll(
          '[data-testid="videoPlayerControls"], [data-testid="videoComponent"] [role="progressbar"], button[aria-label*="Play"], button[aria-label*="Воспроизвести"]'
        );
        for (const c of controls) {
          const prevOp = c.style.opacity;
          c.style.setProperty('opacity', '0', 'important');
          controlRestores.push(() => { c.style.opacity = prevOp; });
        }
      }

      // 3. Temporarily set browser zoom to scaleFactor for crisp high-res UI text & avatars
      if (scaleFactor > 1) {
        try {
          const zoomRes = await chrome.runtime.sendMessage({ action: 'getZoom' });
          originalZoom = zoomRes?.zoom || 1.0;
          await chrome.runtime.sendMessage({ action: 'setZoom', zoom: originalZoom * scaleFactor });
          await sleep(220);
        } catch (zErr) {
          console.warn('[Screenshoter] Zoom adjustment failed:', zErr);
        }
      }

      restoreElements = preparePageForCapture(tweetEl);
      document.body.classList.add('tw-screenshot-capturing');

      const viewportHeight = window.innerHeight;
      document.body.style.minHeight = (document.body.scrollHeight + viewportHeight * 3) + 'px';
      document.body.style.paddingBottom = (viewportHeight * 2) + 'px';

      // 4. Capture static base canvas for tweet / thread in crisp high-res
      let baseCanvas;
      let videoTweetCanvasX = 0;
      let videoTweetCanvasY = 0;
      let videoTweetCanvasWidth = 0;

      if (captureAsThread) {
        const tweetCanvases = [];
        for (let i = 0; i < threadTweets.length; i++) {
          const t = threadTweets[i];
          t.scrollIntoView({ block: 'start', behavior: 'instant' });
          await sleep(150);
          const tRes = await captureSingleTweetCanvas(t, isQuoteTweet(t));
          tweetCanvases.push(tRes);
        }

        const threadStitch = await stitchThreadCanvases(tweetCanvases, tweetEl);
        baseCanvas = threadStitch.canvas;

        const effectiveVideoOffset = videoTweetOffsetInThread >= 0 ? videoTweetOffsetInThread : Math.max(0, targetOffsetInThread);
        let curY = 0;
        for (let i = 0; i < effectiveVideoOffset; i++) {
          curY += tweetCanvases[i].canvas.height;
        }
        videoTweetCanvasY = curY;
        videoTweetCanvasX = Math.max(0, Math.round((baseCanvas.width - tweetCanvases[effectiveVideoOffset].canvas.width) / 2));
        videoTweetCanvasWidth = tweetCanvases[effectiveVideoOffset].canvas.width;
      } else {
        videoTweet.scrollIntoView({ block: 'start', behavior: 'instant' });
        await sleep(100);
        const baseResult = await captureSingleTweetCanvas(videoTweet, isQuoteTweet(videoTweet));
        baseCanvas = baseResult.canvas;
        videoTweetCanvasX = 0;
        videoTweetCanvasY = 0;
        videoTweetCanvasWidth = baseCanvas.width;
      }

      // 5. Restore zoom back to normal for live playback and recording
      document.body.classList.remove('tw-screenshot-capturing');
      document.body.style.minHeight = originalMinHeight;
      document.body.style.paddingBottom = originalPaddingBottom;

      if (scaleFactor > 1) {
        try {
          await chrome.runtime.sendMessage({ action: 'setZoom', zoom: originalZoom });
          await sleep(180);
        } catch (zErr) {}
      }

      // 6. Scroll target video into comfortable view so browser actively decodes frames
      videoTweet.scrollIntoView({ block: 'center', behavior: 'instant' });
      await sleep(100);
      const vRectNow = videoEl.getBoundingClientRect();
      if (vRectNow.bottom > window.innerHeight || vRectNow.top < 0) {
        videoEl.scrollIntoView({ block: 'center', behavior: 'instant' });
        await sleep(80);
      }

      // 7. Calculate relative position of videoEl on baseCanvas
      const hostRect = videoTweet.getBoundingClientRect();
      let videoRect = videoEl.getBoundingClientRect();

      if (videoRect.width < 10 || videoRect.height < 10) {
        const container = videoTweet.querySelector('[data-testid="videoPlayer"], [data-testid="videoComponent"]') || videoEl.parentElement;
        if (container) {
          videoRect = container.getBoundingClientRect();
        }
      }

      const scale = videoTweetCanvasWidth / (hostRect.width || 1);

      const localVx = Math.max(0, Math.round((videoRect.left - hostRect.left) * scale));
      const localVy = Math.max(0, Math.round((videoRect.top - hostRect.top) * scale));
      const localVw = Math.min(videoTweetCanvasWidth - localVx, Math.round(videoRect.width * scale));
      const localVh = Math.round(videoRect.height * scale);

      const vx = videoTweetCanvasX + localVx;
      const vy = videoTweetCanvasY + localVy;
      const vw = localVw;
      const vh = localVh;

      // 8. Border radius of video container
      let borderRadius = 0;
      let cur = videoEl;
      while (cur && cur !== videoTweet) {
        const br = parseFloat(window.getComputedStyle(cur).borderRadius);
        if (br > 0) {
          borderRadius = br;
          break;
        }
        cur = cur.parentElement;
      }
      if (!borderRadius) borderRadius = 14;
      const scaledRadius = Math.round(borderRadius * scale);

      // 9. Setup record canvas with even dimensions and high smoothing quality
      let recW = baseCanvas.width;
      let recH = baseCanvas.height;
      if (recW % 2 !== 0) recW += 1;
      if (recH % 2 !== 0) recH += 1;

      const recordCanvas = document.createElement('canvas');
      recordCanvas.width = recW;
      recordCanvas.height = recH;
      const recCtx = recordCanvas.getContext('2d');
      recCtx.imageSmoothingEnabled = true;
      recCtx.imageSmoothingQuality = 'high';

      // 10. Start video playback from beginning
      const origPaused = videoEl.paused;
      const origMuted = videoEl.muted;
      try {
        videoEl.currentTime = 0;
      } catch (e) {}

      try {
        await videoEl.play();
      } catch (e) {
        videoEl.muted = true;
        try { await videoEl.play(); } catch (e2) {}
      }
      await sleep(100);

      // 9. Determine target cycle duration
      const vDur = videoEl.duration;
      let targetDuration = 10;
      if (Number.isFinite(vDur) && vDur > 0.4) {
        if (vDur < 2.0) {
          targetDuration = vDur * 2; // Short GIF: 2 full loops
        } else if (vDur <= 45) {
          targetDuration = vDur;     // 1 full cycle
        } else {
          targetDuration = 30;       // Safety cap for long videos
        }
      }

      // 10. Setup MediaRecorder with Audio support
      const canvasStream = recordCanvas.captureStream(30);
      let recordStream = canvasStream;

      try {
        const vStream = typeof videoEl.captureStream === 'function'
          ? videoEl.captureStream()
          : (typeof videoEl.mozCaptureStream === 'function' ? videoEl.mozCaptureStream() : null);
        if (vStream) {
          const aTracks = vStream.getAudioTracks();
          if (aTracks && aTracks.length > 0) {
            recordStream = new MediaStream([
              ...canvasStream.getVideoTracks(),
              aTracks[0]
            ]);
          }
        }
      } catch (e) {
        console.log('[Screenshoter] Audio track capture note:', e);
      }

      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp9';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const chunks = [];
      const recOptions = {
        mimeType,
        videoBitsPerSecond: 8000000
      };

      // Force keyframe every 1000ms (1 sec) to eliminate seeking artifacts / macroblock distortion
      try {
        recOptions.videoKeyFrameIntervalDuration = 1000;
      } catch (e) {}

      let recorder;
      try {
        recorder = new MediaRecorder(recordStream, recOptions);
      } catch (e) {
        delete recOptions.videoKeyFrameIntervalDuration;
        recorder = new MediaRecorder(recordStream, recOptions);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      // 11. Start recording & show progress toast with Stop button
      prepToast.close();
      isRecording = true;

      const stopRecording = () => {
        if (!isRecording) return;
        isRecording = false;
        if (animFrameId) cancelAnimationFrame(animFrameId);
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      };

      recToast = showToast({
        title: `${REC_DOT_ICON_SVG}<span>${t('toastRecording')}</span>`,
        subtitle: `0.0 / ${targetDuration.toFixed(1)} ${t('sec')}`,
        loading: true,
        duration: 0,
        onStop: stopRecording
      });

      const startTime = performance.now();
      let lastVTime = -1;
      let lastToastUpdate = 0;

      // 12. Render loop
      function drawFrame() {
        if (!isRecording) return;

        // Draw static crisp base
        recCtx.drawImage(baseCanvas, 0, 0, recW, recH);

        // Draw live video frame clipped with rounded corners
        recCtx.save();
        drawRoundedRectPath(recCtx, vx, vy, vw, vh, scaledRadius);
        recCtx.clip();
        try {
          recCtx.drawImage(videoEl, vx, vy, vw, vh);
        } catch (err) {}

        // Overlay active subtitles / closed captions if present and enabled
        if (config.recordSubtitles !== false) {
          const subText = getActiveSubtitleText(videoEl, videoTweet);
          if (subText) {
            drawSubtitlesOnCanvas(recCtx, subText, vx, vy, vw, vh);
          }
        }

        recCtx.restore();

        const now = performance.now();
        const elapsedSec = (now - startTime) / 1000;

        if (now - lastToastUpdate > 200) {
          lastToastUpdate = now;
          recToast.update({
            title: `${REC_DOT_ICON_SVG}<span>${t('toastRecording')}</span>`,
            subtitle: `${elapsedSec.toFixed(1)} / ${targetDuration.toFixed(1)} ${t('sec')}`
          });
        }

        const curVTime = videoEl.currentTime;
        const loopedBack = (lastVTime > 1.0 && curVTime < 0.3 && elapsedSec >= (vDur ? vDur * 0.9 : 2.0));
        const reachedTarget = elapsedSec >= targetDuration;
        const ended = videoEl.ended;

        if (reachedTarget || ended || loopedBack) {
          stopRecording();
          return;
        }

        lastVTime = curVTime;
        animFrameId = requestAnimationFrame(drawFrame);
      }

      recorder.start(100);
      animFrameId = requestAnimationFrame(drawFrame);

      // 13. Wait for recording to complete (clean native MediaRecorder WebM blob)
      const blob = await new Promise((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: mimeType }));
        };
      });

      if (recToast) recToast.close();

      if (origPaused) {
        try { videoEl.pause(); } catch (e) {}
      }
      videoEl.muted = origMuted;

      // 14. Format handling & MP4 Conversion
      const meta = getTweetMeta(tweetEl);
      const isMp4Preferred = (config.videoFormat || 'mp4') === 'mp4';
      const filePrefix = captureAsThread ? 'reply-' : '';
      const baseFilename = `${filePrefix}${meta.handle}-${meta.tweetId}-${meta.dateStr}`;
      const mp4Filename = `${baseFilename}.mp4`;
      const fallbackWebmFilename = `${baseFilename}.webm`;

      if (isMp4Preferred) {
        const convToast = showToast({
          title: t('toastConvertingMp4'),
          subtitle: t('toastEncodingH264'),
          loading: true,
          duration: 0
        });

        let pyStatus = null;
        try {
          pyStatus = await new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'pingPython', port: config.pythonPort || 5678 }, resolve);
          });
        } catch (e) {}

        if (pyStatus && pyStatus.online && pyStatus.data && pyStatus.data.has_ffmpeg) {
          try {
            // Read recorded WebM blob as base64
            const reader = new FileReader();
            const base64Webm = await new Promise((resolve, reject) => {
              reader.onloadend = () => {
                const res = reader.result || '';
                const commaIdx = res.indexOf(',');
                resolve(commaIdx !== -1 ? res.slice(commaIdx + 1) : res);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });

            const convRes = await new Promise((resolve) => {
              chrome.runtime.sendMessage({
                action: 'convertVideo',
                port: config.pythonPort || 5678,
                videoData: base64Webm,
                filename: mp4Filename,
                outputFolder: ''
              }, resolve);
            });

            if (convRes && convRes.success && convRes.dataUrl) {
              convToast.close();

              if (config.autoDownload) {
                downloadDataUrl(convRes.dataUrl, mp4Filename);
              }

              const sizeMb = ((convRes.size || 0) / (1024 * 1024)).toFixed(2);
              showToast({
                title: captureAsThread ? t('toastMp4ThreadReady') : t('toastMp4Ready'),
                subtitle: `${mp4Filename} (${recW}×${recH}, ${sizeMb} ${t('mb')}, ${t('h264Tg')})`,
                success: true,
                videoUrl: convRes.dataUrl,
                duration: 8000,
                onDownload: () => downloadDataUrl(convRes.dataUrl, mp4Filename)
              });
              return;
            } else {
              console.warn('[Screenshoter] MP4 conversion error:', convRes?.error);
              convToast.close();
              showToast({
                title: t('toastMp4ConvError'),
                subtitle: `${convRes?.error || t('toastFfmpegCrash')}. ${t('toastClickDownloadWebm')}`,
                error: true,
                duration: 8000,
                onDownload: () => downloadBlob(blob, fallbackWebmFilename)
              });
              return;
            }
          } catch (convErr) {
            console.error('[Screenshoter] MP4 conversion exception:', convErr);
            convToast.close();
            showToast({
              title: t('toastConvError'),
              subtitle: t('toastConvErrorSub'),
              error: true,
              duration: 8000,
              onDownload: () => downloadBlob(blob, fallbackWebmFilename)
            });
            return;
          }
        } else {
          convToast.close();
          showToast({
            title: t('toastPyOffline'),
            subtitle: t('toastPyOfflineSub'),
            duration: 8000,
            onDownload: () => downloadBlob(blob, fallbackWebmFilename)
          });
          return;
        }
      }

      // Explicit WebM mode (chosen in extension settings)
      const filename = `${baseFilename}.webm`;
      const videoUrl = URL.createObjectURL(blob);

      if (config.autoDownload) {
        downloadBlob(blob, filename);
      }

      const sizeMb = (blob.size / (1024 * 1024)).toFixed(2);
      showToast({
        title: captureAsThread ? t('toastThreadVideoSuccess') : t('toastWebmSuccess'),
        subtitle: `${filename} (${recW}×${recH}, ${sizeMb} ${t('mb')})`,
        success: true,
        videoUrl: videoUrl,
        duration: 8000,
        onDownload: () => downloadBlob(blob, filename)
      });

    } catch (err) {
      console.error('[Screenshoter] Video recording error:', err);
      if (recToast) recToast.close();
      prepToast.close();
      const isContextInvalidated = err?.message?.includes('context invalidated') || !chrome.runtime?.id;
      showToast({
        title: isContextInvalidated ? t('toastExpUpdated') : t('toastRecError'),
        subtitle: isContextInvalidated ? t('toastExpUpdatedSub') : (err.message || t('toastRecErrorSub')),
        error: true,
        duration: 7000
      });
    } finally {
      isVideoRecordingInProgress = false;
      document.body.classList.remove('tw-screenshot-capturing');
      document.body.style.minHeight = originalMinHeight;
      document.body.style.paddingBottom = originalPaddingBottom;

      if (scaleFactor > 1) {
        try {
          await chrome.runtime.sendMessage({ action: 'setZoom', zoom: originalZoom });
        } catch (zErr) {}
      }

      if (animFrameId) cancelAnimationFrame(animFrameId);
      for (const cr of controlRestores) {
        try { cr(); } catch (e) {}
      }
      if (restoreElements) {
        try { restoreElements(); } catch (e) {}
      }
      window.scrollTo({ top: originalScrollY, behavior: 'instant' });
    }
  }

  // Main Screenshot Flow: Entire Thread
  async function captureThread(originTweetEl) {
    const rawScale = Math.max(1, Number(config.scale) || 2);
    const screenWidth = window.screen.width || 1366;
    const maxSafeScale = Math.max(1, Math.floor((screenWidth / 620) * 10) / 10);
    const scaleFactor = Math.min(rawScale, maxSafeScale);
    let originalZoom = 1.0;

    const match = window.location.pathname.match(/\/status\/(\d+)/);
    const pageStatusId = match ? match[1] : null;

    const progressToast = showToast({
      title: t('toastThreadPrep'),
      subtitle: t('toastThreadScrollTop'),
      loading: true,
      duration: 0
    });

    const originalScrollY = window.scrollY;
    const originalPaddingBottom = document.body.style.paddingBottom;
    const originalMinHeight = document.body.style.minHeight;
    let restoreElements = null;

    try {
      if (scaleFactor > 1) {
        try {
          const zoomRes = await chrome.runtime.sendMessage({ action: 'getZoom' });
          originalZoom = zoomRes?.zoom || 1.0;
          await chrome.runtime.sendMessage({ action: 'setZoom', zoom: originalZoom * scaleFactor });
          await sleep(220);
        } catch (zErr) {
          console.warn('[Screenshoter] Zoom adjustment failed:', zErr);
        }
      }

      restoreElements = preparePageForCapture(originTweetEl);
      document.body.classList.add('tw-screenshot-capturing');

      const viewportHeight = window.innerHeight;
      document.body.style.minHeight = (document.body.scrollHeight + viewportHeight * 5) + 'px';
      document.body.style.paddingBottom = (viewportHeight * 3) + 'px';

      // 1. Scroll to top to ensure the conversation beginning is mounted
      window.scrollTo({ top: 0, behavior: 'instant' });
      await sleep(250);

      const tweetCanvases = [];
      let stepCount = 0;
      const maxSteps = 35;
      let reachedFocal = false;
      let focalAuthor = null;
      let lastCapturedTweet = null;

      while (stepCount < maxSteps) {
        stepCount++;

        // Find tweets in live DOM
        const freshTweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
        if (freshTweets.length === 0) break;

        let currentTweet = null;

        if (!lastCapturedTweet) {
          // Start with the first tweet at top of page (mother post)
          currentTweet = freshTweets[0];
        } else {
          // Find tweet immediately following lastCapturedTweet
          let lastIdx = freshTweets.indexOf(lastCapturedTweet);
          if (lastIdx === -1) {
            lastIdx = freshTweets.findIndex(t => t === lastCapturedTweet || t.contains(lastCapturedTweet));
          }

          if (lastIdx >= 0 && lastIdx + 1 < freshTweets.length) {
            currentTweet = freshTweets[lastIdx + 1];
          } else {
            // Scroll down to let Twitter's virtual scroll mount the next tweet
            const rect = lastCapturedTweet.getBoundingClientRect();
            window.scrollBy({ top: Math.max(200, Math.round(rect.height + 60)), behavior: 'instant' });
            await sleep(200);

            const rechecked = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
            const recheckedIdx = rechecked.indexOf(lastCapturedTweet);
            if (recheckedIdx >= 0 && recheckedIdx + 1 < rechecked.length) {
              currentTweet = rechecked[recheckedIdx + 1];
            } else if (rechecked.length > 0 && rechecked[rechecked.length - 1] !== lastCapturedTweet) {
              currentTweet = rechecked[rechecked.length - 1];
            }
          }
        }

        if (!currentTweet) {
          break; // No more tweets to process
        }

        // Check if this tweet is the focal/target post of the page
        const isFocal = isTargetFocalTweet(currentTweet, pageStatusId) ||
                        (originTweetEl && (currentTweet === originTweetEl || currentTweet.contains(originTweetEl)));

        if (isFocal) {
          reachedFocal = true;
          focalAuthor = getAuthorHandle(currentTweet);
        }

        progressToast.update({
          title: `${t('toastThreadCapturing')} (${tweetCanvases.length + 1})...`,
          subtitle: `${t('toastThreadProcessingMsg')} ${tweetCanvases.length + 1}`
        });

        // Scroll current tweet to top of viewport
        currentTweet.scrollIntoView({ block: 'start', behavior: 'instant' });
        await sleep(150);

        // Capture tweet canvas
        const singleResult = await captureSingleTweetCanvas(currentTweet, isQuoteTweet(currentTweet));
        tweetCanvases.push(singleResult);
        lastCapturedTweet = currentTweet;

        // If we reached focal tweet, check if we should continue (author self-replies)
        if (reachedFocal) {
          await sleep(80);
          const afterTweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
          const curIdx = afterTweets.indexOf(currentTweet);
          let hasContinuation = false;

          if (curIdx >= 0 && curIdx + 1 < afterTweets.length) {
            const nextT = afterTweets[curIdx + 1];
            if (focalAuthor && getAuthorHandle(nextT) === focalAuthor) {
              hasContinuation = true;
            }
          }

          if (!hasContinuation) {
            break; // Finished the thread!
          }
        }
      }

      progressToast.update({
        title: t('toastThreadStitching'),
        subtitle: t('toastThreadStitchingSub', tweetCanvases.length)
      });

      // Direct Canvas stitching
      const finalResult = await stitchThreadCanvases(tweetCanvases, originTweetEl);
      const finalDataUrl = finalResult.dataUrl;
      const finalBlob = finalResult.blob;
      const finalWidth = finalResult.width;
      const finalHeight = finalResult.height;

      progressToast.close();

      const threadDate = (() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${y}${m}${day}`;
      })();
      const threadAuthor = focalAuthor || 'thread';
      const threadStatusId = pageStatusId || Date.now().toString();
      const filename = `thread-${threadAuthor}-${threadStatusId}-${threadDate}.png`;

      // Copy to clipboard
      let copied = false;
      if (config.autoCopy && finalBlob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': finalBlob })
          ]);
          copied = true;
        } catch (clipErr) {
          console.warn('[Screenshoter] Clipboard error:', clipErr);
        }
      }

      // Download file
      if (config.autoDownload && finalDataUrl) {
        downloadDataUrl(finalDataUrl, filename);
      }

      // Success toast
      showToast({
        title: copied ? t('toastThreadCopied') : t('toastThreadSuccess'),
        subtitle: `${finalWidth} × ${finalHeight} px • ${tweetCanvases.length} ${t('msgCount')}`,
        success: true,
        thumbUrl: finalDataUrl,
        onCopy: async () => {
          if (finalBlob) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': finalBlob })]);
            showToast({ title: t('toastCopied'), duration: 2000 });
          }
        },
        onDownload: () => {
          downloadDataUrl(finalDataUrl, filename);
        },
        duration: 8000
      });

    } catch (err) {
      console.error('[Screenshoter] Thread capture error:', err);
      progressToast.close();
      const isContextInvalidated = err?.message?.includes('context invalidated') || !chrome.runtime?.id;
      showToast({
        title: isContextInvalidated ? t('toastExpUpdated') : t('toastThreadError'),
        subtitle: isContextInvalidated ? t('toastExpUpdatedSub') : (err.message || t('toastThreadErrorSub')),
        error: true,
        duration: 7000
      });
    } finally {
      if (scaleFactor > 1 && originalZoom) {
        try {
          await chrome.runtime.sendMessage({ action: 'setZoom', zoom: originalZoom });
        } catch (e) {}
      }
      if (restoreElements) {
        try { restoreElements(); } catch (e) {}
      }
      document.body.classList.remove('tw-screenshot-capturing');
      document.body.style.paddingBottom = originalPaddingBottom;
      document.body.style.minHeight = originalMinHeight;
      window.scrollTo({ top: originalScrollY, behavior: 'instant' });
    }
  }

  // Inject Screenshot Button with Dropdown Menu Trigger
  function injectButtonIntoTweet(tweetEl) {
    if (!tweetEl || tweetEl.querySelector('.tw-screenshot-btn')) return;

    const actionBar = tweetEl.querySelector('div[role="group"]');
    if (!actionBar) return;

    const isQuote = isQuoteTweet(tweetEl);

    if (config.quotesOnly && !isQuote) {
      return;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `tw-screenshot-btn ${isQuote ? 'tw-quote-highlight' : ''}`;
    btn.setAttribute('data-tooltip', t('btnTooltip'));
    btn.setAttribute('aria-label', t('btnTooltip'));

    btn.innerHTML = `
      <div class="tw-screenshot-btn-inner">
        ${CAMERA_ICON_SVG}
        ${CHEVRON_DOWN_SVG}
        ${isQuote ? `<span class="tw-quote-badge" title="${t('cropBadgeQuote')}"></span>` : ''}
      </div>
    `;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        if (!chrome.runtime?.id) {
          showToast({
            title: t('toastExpUpdated'),
            subtitle: t('toastExpUpdatedSub'),
            error: true,
            duration: 6000
          });
          return;
        }
      } catch (err) {
        showToast({
          title: t('toastExpUpdated'),
          subtitle: t('toastExpUpdatedSub'),
          error: true,
          duration: 6000
        });
        return;
      }

      const currentTweet = btn.closest('article[data-testid="tweet"]') || tweetEl;
      if (activeMenu && activeMenuBtn === btn) {
        closeActiveMenu();
      } else {
        openScreenshotMenu(btn, currentTweet, isQuote);
      }
    });

    actionBar.appendChild(btn);
  }

  // Check if a tweet is the focal/main opened post on a /status/ page
  function isMainOpenedPost(tweetEl) {
    const match = window.location.pathname.match(/\/status\/(\d+)/);
    if (!match) return false;

    const currentStatusId = match[1];

    const statusLinks = tweetEl.querySelectorAll('a[href*="/status/"]');
    for (const link of statusLinks) {
      const href = link.getAttribute('href') || '';
      if (href.includes(`/status/${currentStatusId}`)) {
        const insideQuote = link.closest('div[role="link"], div[tabindex="0"][role="link"]');
        if (!insideQuote || link.querySelector('time') || link.closest('[data-testid="User-Name"]')) {
          return true;
        }
      }
    }

    const text = tweetEl.innerText || tweetEl.textContent || '';
    if (text.includes('·') && (text.includes('Views') || text.includes('Просмотр') || /\d+:\d+\s+[AP]M/i.test(text))) {
      return true;
    }

    return false;
  }

  // Check if tweet is eligible for screenshot button:
  // - Only on /status/ page
  // - Must not be in comments below the inline reply composer
  // - NEVER on timeline feed
  function isEligibleForScreenshotButton(tweetEl) {
    if (!window.location.pathname.includes('/status/')) return false;

    const composer = document.querySelector('[data-testid="inline-reply-composer"]');
    if (composer) {
      const pos = tweetEl.compareDocumentPosition(composer);
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) {
        // Tweet is below the composer (comment section)
        return false;
      }
    }

    return true;
  }

  // Scan and inject ONLY into eligible posts on status page
  function scanTweets() {
    if (!window.location.pathname.includes('/status/')) {
      const existing = document.querySelectorAll('.tw-screenshot-btn');
      for (const b of existing) b.remove();
      closeActiveMenu();
      return;
    }

    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    for (const tweet of tweets) {
      if (isEligibleForScreenshotButton(tweet)) {
        injectButtonIntoTweet(tweet);
      } else {
        const btn = tweet.querySelector('.tw-screenshot-btn');
        if (btn) btn.remove();
      }
    }
  }

  function refreshButtonsVisibility() {
    const existingButtons = document.querySelectorAll('.tw-screenshot-btn');
    for (const btn of existingButtons) {
      const tweetEl = btn.closest('article[data-testid="tweet"]');
      if (tweetEl && (!isEligibleForScreenshotButton(tweetEl) || (config.quotesOnly && !isQuoteTweet(tweetEl)))) {
        btn.remove();
      } else {
        btn.setAttribute('data-tooltip', t('btnTooltip'));
        btn.setAttribute('aria-label', t('btnTooltip'));
        const badge = btn.querySelector('.tw-quote-badge');
        if (badge) badge.title = t('cropBadgeQuote');
      }
    }
    scanTweets();
  }

  // Track URL changes for SPA navigation
  let lastObservedUrl = window.location.href;
  window.addEventListener('popstate', () => {
    lastObservedUrl = window.location.href;
    closeActiveMenu();
    const existing = document.querySelectorAll('.tw-screenshot-btn');
    for (const b of existing) b.remove();
    scanTweets();
  });

  // Observe Twitter dynamic feed and page changes
  let scanDebounceTimer = null;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastObservedUrl) {
      lastObservedUrl = window.location.href;
      closeActiveMenu();
      const existing = document.querySelectorAll('.tw-screenshot-btn');
      for (const b of existing) b.remove();
    }

    if (scanDebounceTimer) return;
    scanDebounceTimer = setTimeout(() => {
      scanDebounceTimer = null;
      scanTweets();
    }, 200);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial scan
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanTweets);
  } else {
    scanTweets();
  }

  console.log('[X/Twitter Screenshoter] Content script active with thread & dropdown support.');
})();
