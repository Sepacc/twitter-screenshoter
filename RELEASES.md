# Release Notes / История версий

[English](#english) | [Русский](#русский)

---

<a name="english"></a>
## English

### Version 1.2.2 (2026-11-08)

#### Video & GIF Recording Fixes
* **Vertical Video Aspect Ratio Preservation**:
  * Fixed an issue where vertical and portrait-oriented videos/GIFs were stretched horizontally during recording. The canvas now accurately respects the natural aspect ratio of the media source.
* **Tainted Canvas & CORS Resolution**:
  * Fixed canvas taint errors (`Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data`) when recording tweets containing external media. Video streams and blobs are now fetched via background proxy with dynamic syndication token computation, converting them to data URLs and allowing taint-free recording.
* **Synchronized Playback Alignment**:
  * Resolved video overlap, offset positioning, and clipping artifacts when capturing tweets with parent video or GIF content.

#### Screenshot Bounding & Clean Capture
* **Removal of "Relevant" Dropdown and Reply Box**:
  * Fixed screenshot boundaries so the trailing "Relevant" sorting dropdown, separator line, and inline reply composer ("Post your reply") are cleanly excluded in both action-bar-visible and action-bar-hidden modes.
* **Text Reply Capture Fix (Black Screenshot Resolution)**:
  * Resolved an issue where screenshotting a text reply to an image or media post resulted in a black or empty canvas due to over-aggressive element hiding. The target tweet element and its ancestor tree are now strictly safeguarded.
* **Poll Option Obstruction Fix**:
  * Fixed camera button placement on poll posts where the button previously overlapped voting options. The action bar locator now cleanly differentiates poll choices from tweet action bars.

#### Extension Settings & UI Organization
* **Logical Settings Categorization**:
  * Completely reorganized the popup settings into clear sections: Extension Button, Quick Actions, Screenshot Settings, Video Recording, Tweet Menu & Threads, and File Saving.
  * Moved the "Hide camera button on tweets" toggle to the very top for immediate access.

---

### Version 1.2.0 (2026-11-03)

#### Audio & Video Recording Enhancements
* **Forced Audio Unmuting (`forceAudio`)**:
  * Twitter autoplays all video content with `muted = true`. The extension now automatically unmutes video elements (`muted = false`, `volume = 1.0`) and triggers the player unmute control when recording starts, preventing silent recordings.
  * Configurable via popup settings (enabled by default).
* **Accurate Media Type Identification**:
  * Fixed media classifier that previously flagged muted autoplayed videos as GIFs.
  * Audio tracks are now captured from all actual video posts while retaining silent loop behavior for true GIFs.
* **Synchronized Multi-Video Recording at 60 FPS**:
  * When capturing replies that contain videos alongside parent tweet videos, playback is synchronized across both elements onto a unified canvas at steady 60 fps.
* **High-Resolution Ultra HD 2x Recording**:
  * Canvas recording resolution matches the configured extension scale up to 2x (1200px canonical width), ensuring crisp typography and sharp video details across Chromium and Gecko browsers.

#### Thread Capture & Stitching Improvements
* **Thread Post Count Selector**:
  * Added an interactive slider and direct number input in the capture menu for threads of 3 or more messages.
  * Supports two capture modes:
    * **From start ("С начала")**: Captures the first N posts from the beginning of the conversation.
    * **From end ("С конца")**: Captures the last N posts leading up to the current focal tweet.
* **Root Post Thread Slicing Bugfix**:
  * Resolved an issue where initiating a thread capture from the root/parent tweet with "First N posts" terminated after capturing only the first tweet due to author continuation checks.
  * Incomplete thread slicing now captures sequentially until the exact requested post count is satisfied.
* **Anti-Seam GIF and Video Freezing**:
  * Prevents vertical seam misalignment and frame tearing when screenshotting threads containing animated GIFs or videos.
  * All media elements in the capture chain are temporarily frozen at their current playback frame while html2canvas renders the slice.

#### Modular Feature Settings & Popup Quick Actions
* **Modular Feature Toggles**:
  * Added dedicated toggle switches in the extension popup to customize visible features:
    * **Hide buttons on tweets (`hideTweetButtons`)**: Removes camera buttons from tweet action bars, shifting all capture triggers to the extension popup.
    * **Force audio on video (`forceAudio`)**: Automatically unmutes video before recording.
    * **Video / GIF recording (`showVideoRecord`)**: Toggles visibility of video recording items in the dropdown menu.
    * **MP4 conversion (`enableMp4Conversion`)**: Toggles client-side FFmpeg WASM conversion (exports WebM directly when disabled).
    * **Thread post count selector (`showThreadCount`)**: Toggles the post slider in the screenshot menu.
    * **Subtitles toggle (`showSubtitlesToggle`)**: Toggles the subtitle recording checkbox in the menu.
    * **Hide action bar toggle (`showHideActionsToggle`)**: Toggles the like/retweet bar hiding checkbox in the menu.
* **Popup Quick Action Buttons**:
  * Quick capture triggers added directly inside the popup interface:
    * **This post**: Capture visible focal tweet.
    * **Entire thread**: Capture full conversation chain.
    * **Video / GIF**: Start media recording.

#### Packaging & Distribution
* **Standardized Releases Directory**:
  * Clean release packages generated directly into the `releases/` directory:
    * `twitter-screenshoter-v1.2.0-chrome.zip` (for Google Chrome, Brave, Edge, Opera, Vivaldi)
    * `twitter-screenshoter-v1.2.0-firefox.xpi` (for Mozilla Firefox, Zen Browser, Floorp)

---

### Version 1.1.0 (2026-10-29)

* **Dual-Video Recording**:
  * Support for recording reply posts with parent videos in a single unified frame.
* **60 FPS Canvas Stream Recording**:
  * Smooth frame pacing with WebM duration metadata injection (`fix-webm-duration.js`).
* **Client-Side MP4 Conversion**:
  * Integrated FFmpeg WASM encoding for instant Telegram and Discord compatibility.
* **Gecko & Zen Browser Support**:
  * Added `browser_specific_settings.gecko` Manifest V3 compatibility.

---

### Version 1.0.0 (2026-09-29)

* **Initial Release**:
  * High-resolution post and conversation screenshoter for X (Twitter).
  * Support for single posts, quotes, and full conversation threads.
  * Quote crop slider (100%, 75%, 50%, Text-only).
  * Automatic expansion of truncated text ("Show more").
  * Stripping of clutter: Prompts, Grok buttons, analytics, follow buttons.
  * Dark / Lights Out theme matching native Twitter UI.
  * Custom scaling (1x, 1.5x, 2x, 3x).
  * Auto-copy to clipboard and PNG auto-download.
  * Complete English and Russian localization.

---

<a name="русский"></a>
## Русский

### Версия 1.2.2 (08.11.2026)

#### Запись видео и GIF
* **Сохранение пропорций вертикальных видео**:
  * Устранено искажение и растягивание вертикальных видео и GIF при записи. Холст записи теперь строго сохраняет исходные пропорции медиафайла.
* **Устранение ошибки Tainted Canvas (CORS)**:
  * Исправлена ошибка блокировки холста (`The canvas has been tainted by cross-origin data`) при захвате твитов с гифками и видео. Медиаданные теперь загружаются через прокси в фоновом скрипте с расчетом токена синдикации и передаются в виде data URL, что исключает кросс-доменные ограничения.
* **Синхронизация и позиционирование видео**:
  * Устранены наложения, полосы и смещения кадров при записи ответов с родительскими видео и GIF.

#### Границы скриншотов и очистка интерфейса
* **Обрезка выпадающего списка «Relevant» и формы ответа**:
  * Исправлен расчет нижней границы захвата: переключатель сортировки комментариев «Relevant», разделительная полоса и поле «Ответить» (Post your reply) больше не попадают на скриншот как при включенной, так и при скрытой панели лайков/репостов.
* **Исправление скриншота текстовых ответов (черный экран)**:
  * Устранена ошибка, из-за которой скриншот текстового ответа на твит с картинкой давал черный прямоугольник из-за избыточного скрытия элементов. Целевой твит и его родители теперь защищены от скрытия.
* **Устранение перекрытия опросов**:
  * Кнопка скриншота больше не перекрывает варианты голосования в опросах благодаря строгому разделению контейнеров опросов и панели действий твита.

#### Организация настроек расширения
* **Логическая группировка параметров**:
  * Настройки в попапе структурированы по категориям: кнопка расширения, быстрые действия, скриншоты, запись видео, меню твита и треды, сохранение файлов.
  * Переключатель скрытия кнопки с постов вынесен наверх для быстрого доступа.

---

### Версия 1.2.0 (03.11.2026)

#### Запись видео и аудио
* **Принудительное включение звука (`forceAudio`)**:
  * Twitter автовоспроизводит ролики без звука (`muted = true`). Расширение теперь принудительно включает звук (`muted = false`, `volume = 1.0`) и нажимает кнопку unmute в плеере при старте записи, предотвращая запись без звуковой дорожки.
  * Опцию можно отключить в настройках попапа (по умолчанию включена).
* **Корректная классификация медиа**:
  * Исправлена ошибка, из-за которой автовоспроизводимые ролики со звуком принимались за гифки.
  * Аудиопоток гарантированно захватывается со всех видеопостов, сохраняя режим без звука только для реальных GIF.
* **Синхронизированная запись нескольких видео при 60 FPS**:
  * При записи ответов с видео вместе с родительским постом оба видеоролика синхронно воспроизводятся и объединяются в один холст с частотой 60 кадров/с.
* **Запись видео в Ultra HD 2x**:
  * Разрешение записи видео приведено в соответствие с общим масштабом расширения до 2x (каноническая ширина 1200px) для идеальной четкости текста и видео в Chromium и Firefox / Zen Browser.

#### Скриншоты тредов и склейка
* **Выбор количества постов в треде**:
  * В меню скриншота добавлен интерактивный слайдер и поле прямого ввода числа сообщений (для веток от 3 постов).
  * Два режима захвата:
    * **С начала**: Захватывает первые N сообщений от старта ветки вниз.
    * **С конца**: Захватывает последние N сообщений до текущего выбранного твита.
* **Исправление захвата ветки с родительского поста**:
  * Устранена ошибка, при которой выбор «Первые N постов» на самом первом посте ветки сохранял только 1 сообщение из-за преждевременного завершения цикла проверки автора.
  * Скрипт последовательно собирает сообщения до достижения запрошенного числа постов.
* **Предотвращение разрыва кадров GIF и видео**:
  * Устранено смещение и разрывы кадров анимаций на границах стыковки твитов в длинных тредах.
  * Все медиаэлементы в ветке временно замораживаются на текущем таймкоде на время захвата холста.

#### Модульные настройки и быстрые действия в попапе
* **Модульное отключение функций**:
  * В меню расширения добавлены независимые тумблеры:
    * **Скрыть кнопки у твитов (`hideTweetButtons`)**: Убирает кнопки скриншота из ленты твитов, перенося всё управление в попап.
    * **Принудительно включать звук видео (`forceAudio`)**: Автоматически включает звук перед записью.
    * **Запись видео и GIF (`showVideoRecord`)**: Включает/выключает пункты записи медиа в выпадающем меню.
    * **Конвертация в MP4 (`enableMp4Conversion`)**: Включает/выключает конвертацию через FFmpeg WASM (при отключении сохраняется WebM).
    * **Выбор числа постов в треде (`showThreadCount`)**: Скрывает слайдер количества твитов.
    * **Тумблер субтитров (`showSubtitlesToggle`)**: Скрывает чекбокс субтитров в меню твита.
    * **Тумблер скрытия лайков/панели (`showHideActionsToggle`)**: Скрывает чекбокс скрытия панели действий.
* **Быстрые действия в меню расширения**:
  * Кнопки прямого запуска из попапа:
    * **Этот пост**: Скриншот видимого целевого поста.
    * **Вся ветка**: Скриншот всей цепочки сообщений.
    * **Видео / GIF**: Запуск захвата видео.

#### Сборка и релизы
* **Папка releases/**:
  * Стандартизированная генерация дистрибутивов в каталог `releases/`:
    * `twitter-screenshoter-v1.2.0-chrome.zip` (для Chrome, Brave, Edge, Opera, Vivaldi)
    * `twitter-screenshoter-v1.2.0-firefox.xpi` (для Firefox, Zen Browser, Floorp)

---

### Версия 1.1.0 (29.10.2026)

* Запись видеопостов в цитатах и ответах с одновременным воспроизведением.
* Запись холста со стабильными 60 FPS и внедрением метаданных длительности WebM (`fix-webm-duration.js`).
* Клиентская конвертация в MP4 через FFmpeg WASM для Telegram и Discord.
* Полная поддержка Firefox и Zen Browser (`browser_specific_settings.gecko`).

---

### Версия 1.0.0 (29.09.2026)

* Первый публичный релиз расширения для X (Twitter).
* Скриншоты отдельных постов, цитат и длинных веток сообщений.
* Ползунок обрезки цитируемых постов (100%, 75%, 50%, только текст).
* Автоматическое раскрытие длинного текста («Показать еще»).
* Очистка от лишнего интерфейса: баннеры, Grok, аналитика, кнопка «Подписаться».
* Интеграция в темную тему Twitter.
* Пользовательский масштаб (1x, 1.5x, 2x, 3x).
* Автокопирование в буфер обмена и автоскачивание PNG.
* Полная поддержка русского и английского языков.
