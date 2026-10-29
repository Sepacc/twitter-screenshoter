// background.js - Service Worker for X/Twitter Post Screenshoter

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureVisibleTab') {
    handleCaptureVisibleTab(sender, sendResponse);
    return true; // Keep message channel open for async response
  }

  if (message.action === 'downloadImage') {
    handleDownloadImage(message, sendResponse);
    return true;
  }

  if (message.action === 'pingPython') {
    checkPythonServer(message.port || 5678, sendResponse);
    return true;
  }

  if (message.action === 'getZoom') {
    const tabId = sender?.tab?.id;
    if (!tabId) {
      sendResponse({ zoom: 1.0 });
      return;
    }
    chrome.tabs.getZoom(tabId, (zoom) => {
      sendResponse({ zoom: zoom || 1.0 });
    });
    return true;
  }

  if (message.action === 'setZoom') {
    const tabId = sender?.tab?.id;
    if (!tabId) {
      sendResponse({ success: false });
      return;
    }
    chrome.tabs.setZoom(tabId, message.zoom, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.action === 'stitchPython') {
    forwardToPythonStitcher(message, sendResponse);
    return true;
  }

  if (message.action === 'convertVideo') {
    forwardToPythonConverter(message, sendResponse);
    return true;
  }
});

async function handleCaptureVisibleTab(sender, sendResponse) {
  try {
    const windowId = sender?.tab?.windowId ?? null;
    const dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
    sendResponse({ success: true, dataUrl });
  } catch (error) {
    console.error('[Screenshoter] captureVisibleTab error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleDownloadImage(message, sendResponse) {
  try {
    let filename = message.filename || 'twitter_media.png';
    const subfolder = (message.subfolder || '').trim().replace(/^[\\\/]+|[\\\/]+$/g, '');
    if (subfolder) {
      filename = `${subfolder}/${filename}`;
    }

    const downloadId = await chrome.downloads.download({
      url: message.dataUrl || message.url,
      filename: filename,
      saveAs: !!message.saveAs
    });
    sendResponse({ success: true, downloadId });
  } catch (error) {
    console.error('[Screenshoter] downloadImage error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function checkPythonServer(port, sendResponse) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(`http://127.0.0.1:${port}/status`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json().catch(() => ({ status: 'ok' }));
      sendResponse({ online: true, data });
    } else {
      sendResponse({ online: false, error: `HTTP ${response.status}` });
    }
  } catch (err) {
    clearTimeout(timeoutId);
    sendResponse({ online: false, error: err.message });
  }
}

async function forwardToPythonStitcher(message, sendResponse) {
  const port = message.port || 5678;
  try {
    const response = await fetch(`http://127.0.0.1:${port}/stitch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slices: message.slices,
        dpr: message.dpr,
        tweetInfo: message.tweetInfo,
        method: message.method || 'pillow'
      })
    });

    if (!response.ok) {
      throw new Error(`Python server error: HTTP ${response.status}`);
    }

    const data = await response.json();
    sendResponse({ success: true, dataUrl: data.dataUrl, filepath: data.filepath });
  } catch (err) {
    console.error('[Screenshoter] Python stitcher error:', err);
    sendResponse({ success: false, error: err.message });
  }
}

async function forwardToPythonConverter(message, sendResponse) {
  const port = message.port || 5678;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for video conversion

  try {
    const response = await fetch(`http://127.0.0.1:${port}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoData: message.videoData,
        filename: message.filename,
        outputFolder: message.outputFolder || ''
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      sendResponse({ success: true, ...data });
    } else {
      const errData = await response.json().catch(() => ({}));
      sendResponse({ success: false, error: errData.error || `HTTP ${response.status}` });
    }
  } catch (err) {
    clearTimeout(timeoutId);
    sendResponse({ success: false, error: err.message });
  }
}
