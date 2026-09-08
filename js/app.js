/**
 * WEDDING INVITATION INTERACTIVE SCRIPT — ASHIK & JERRIN
 * 
 * Features:
 * - Rotating Vinyl Record Player (Canon in D by Brooklyn Duo)
 * - YouTube IFrame Audio Streaming + Web Audio Cello/Piano Synthesizer Fallback
 * - Couple Photo Story & Memories Gallery
 * - Dual Countdown Timer (The Engagement & The Wedding)
 * - RSVP Form & Calendar (.ICS & Google Calendar)
 * - Wedding Wishes Guestbook
 */

(function () {
  'use strict';

  const config = window.WEDDING_CONFIG || {};

  // DOM Elements
  const introScreen = document.getElementById('intro-screen');
  const siteHeader = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const heroBg = document.getElementById('hero-bg-image');

  // Vinyl Player Elements
  const vinylPlayer = document.getElementById('vinyl-player');
  const vinylTooltipText = document.getElementById('vinyl-tooltip-text');
  const heroMusicBtn = document.getElementById('hero-music-play-btn');

  // Countdown Elements
  const cdDays = document.getElementById('countdown-days');
  const cdHours = document.getElementById('countdown-hours');
  const cdMinutes = document.getElementById('countdown-minutes');
  const cdSeconds = document.getElementById('countdown-seconds');
  const countdownTargetLabel = document.getElementById('countdown-target-label');
  const countdownTabs = document.querySelectorAll('.countdown-tab-btn');

  // RSVP Elements
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpFormContainer = document.getElementById('rsvp-form-container');
  const rsvpConfirmation = document.getElementById('rsvp-confirmation');
  const rsvpGuestNameDisplay = document.getElementById('rsvp-guest-name');
  const btnGoogleCalendar = document.getElementById('btn-google-calendar');
  const btnDownloadIcs = document.getElementById('btn-download-ics');

  // Guestbook Elements
  const wishesContainer = document.getElementById('wishes-container');
  const openWishModalBtn = document.getElementById('open-wish-modal-btn');
  const wishModal = document.getElementById('wish-modal');
  const closeWishModalBtn = document.getElementById('close-wish-modal-btn');
  const wishForm = document.getElementById('wish-form');

  let currentCountdownEvent = 'wedding'; // 'engagement' | 'wedding'
  let ytPlayer = null;
  let isYtReady = false;
  let isMusicPlaying = false;
  let synthAudioCtx = null;
  let synthInterval = null;
  let noteIndex = 0;

  /* ==========================================================================
     1. INITIALIZATION & DATA INJECTION
     ========================================================================== */
  function init() {
    renderConfigData();
    initNavigation();
    initSmoothScroll();
    initCountdown();
    initVinylMusicPlayer();
    initRSVP();
    initGuestbook();
    initScrollObserver();
  }

  function renderConfigData() {
    const coupleNames = config.couple?.displayNames || "Ashik & Jerrin";
    const heroDates = config.event?.heroDates || "12 & 21 September 2026";
    const heroLocations = config.event?.heroLocations || "Kasaragod & Thrissur, Kerala";
    const monogram = config.couple?.monogram || "A & J";
    const tagline = config.event?.tagline || "invite you to share in two beautiful moments, a promise made and a lifetime begun.";

    document.querySelectorAll('.js-couple-names').forEach(el => el.textContent = coupleNames);
    document.querySelectorAll('.js-hero-dates').forEach(el => el.textContent = heroDates);
    document.querySelectorAll('.js-hero-locations').forEach(el => el.textContent = heroLocations);
    document.querySelectorAll('.js-monogram').forEach(el => el.textContent = monogram);
    document.querySelectorAll('.js-tagline').forEach(el => el.textContent = tagline);

    // Populate chapter list (2 Events: Engagement + Matrimony & Lunch)
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer && config.schedule) {
      timelineContainer.innerHTML = config.schedule.map((item, i) => `
        <article class="chapter-row reveal-on-scroll ${i % 2 === 1 ? 'chapter-row-alt' : ''}">
          <div class="chapter-number">${item.number}</div>
          <div class="chapter-body">
            <h3 class="chapter-title">${item.title}</h3>
            <p class="chapter-subtitle">${item.subtitle}</p>
            <p class="chapter-meta">
              <span class="chapter-date">${item.date}</span>
              <span class="chapter-meta-sep" aria-hidden="true">·</span>
              <span>${item.time}</span>
            </p>
            <p class="chapter-venue"><em>${item.venueName}</em></p>
            <p class="chapter-desc">${item.details}</p>
            <div class="chapter-links">
              <button class="text-link js-scroll-to-venue" data-target="${item.venueTargetId}">View Venue</button>
              ${item.mapsUrl ? `<a class="text-link" href="${item.mapsUrl}" target="_blank" rel="noopener noreferrer">Get Directions</a>` : ''}
            </div>
          </div>
        </article>
      `).join('');

      // Attach scroll-to-venue click listeners
      timelineContainer.querySelectorAll('.js-scroll-to-venue').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = btn.getAttribute('data-target');
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            const headerOffset = 85;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            targetEl.classList.remove('highlight-pulse');
            void targetEl.offsetWidth; // trigger reflow
            targetEl.classList.add('highlight-pulse');
          }
        });
      });
    }

    // Populate Venues
    const venuesContainer = document.getElementById('venues-container');
    if (venuesContainer && config.venues) {
      venuesContainer.innerHTML = config.venues.map(v => `
        <article class="venue-row reveal-on-scroll" id="${v.id}">
          <div class="venue-image-wrapper">
            <img src="${v.image}" alt="${v.name}" class="venue-img" loading="lazy" />
          </div>
          <div class="venue-info">
            <span class="section-eyebrow">${v.type}</span>
            <h3 class="venue-name">${v.name}</h3>
            <p class="venue-time">${v.time}</p>
            <p class="venue-address">${v.address}</p>
            ${v.mapsUrl ? `
              <a href="${v.mapsUrl}" target="_blank" rel="noopener noreferrer" class="text-link">
                Get Directions
              </a>
            ` : ''}
          </div>
        </article>
      `).join('');
    }
  }

  /* ==========================================================================
     2. STICKY NAV & SCROLL SPY
     ========================================================================== */
  function initNavigation() {
    let scrollTicking = false;
    const trackedSections = document.querySelectorAll('section[id]');

    function onScrollFrame() {
      const scrollY = window.scrollY;
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
      updateActiveNavLink(scrollY, trackedSections);
      scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(onScrollFrame);
        scrollTicking = true;
      }
    }, { passive: true });

    // Initial check on load
    onScrollFrame();

    if (mobileToggle && mobileOverlay) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileToggle.classList.toggle('open');
        mobileOverlay.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileToggle.classList.remove('open');
          mobileOverlay.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  function updateActiveNavLink(scrollY, sections) {
    const sectionList = sections || document.querySelectorAll('section[id]');
    const scrollPos = (scrollY !== undefined ? scrollY : window.scrollY) + 140;

    sectionList.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  /* ==========================================================================
     3. DAMPED INERTIAL SCROLL (desktop fine pointers)
     Wheel input is eased so trackpad scrolling glides instead of flying.
     ========================================================================== */
  function initSmoothScroll() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = null;

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    function step() {
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        rafId = null;
        return;
      }
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(step);
    }

    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return; // don't fight pinch-zoom
      // let inner scrollables (modals) behave natively
      if (e.target instanceof Element && e.target.closest('.modal-dialog')) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      target = Math.max(0, Math.min(target + delta, maxScroll()));
      if (rafId === null) {
        rafId = requestAnimationFrame(step);
      }
    }, { passive: false });

    // stay in sync with scrolls from other sources (anchor clicks, keyboard)
    window.addEventListener('scroll', () => {
      if (rafId === null) {
        target = current = window.scrollY;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     4. DUAL COUNTDOWN TIMER
     ========================================================================== */
  function initCountdown() {
    const engagementIso = config.event?.engagementDateISO || "2026-09-12T11:30:00";
    const weddingIso = config.event?.weddingDateISO || "2026-09-21T10:30:00";

    function update() {
      const targetStr = currentCountdownEvent === 'engagement' ? engagementIso : weddingIso;
      const targetTime = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        if (cdDays) cdDays.textContent = '00';
        if (cdHours) cdHours.textContent = '00';
        if (cdMinutes) cdMinutes.textContent = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
      if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
      if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    }

    if (countdownTabs.length > 0) {
      countdownTabs.forEach(tab => {
        tab.addEventListener('click', function () {
          countdownTabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          currentCountdownEvent = this.getAttribute('data-event');
          if (countdownTargetLabel) {
            countdownTargetLabel.textContent = currentCountdownEvent === 'engagement'
              ? "Until The Engagement · 12 September 2026 (Kamballur)"
              : "Until The Holy Matrimony · 21 September 2026 (Thrissur)";
          }
          update();
        });
      });
    }

    update();
    setInterval(update, 1000);
  }

  /* ==========================================================================
     6. ROTATING VINYL RECORD PLAYER (Canon in D by Brooklyn Duo)
     ========================================================================== */
  function initVinylMusicPlayer() {
    setupYouTubePlayer();

    // Bind vinyl record click
    if (vinylPlayer) {
      vinylPlayer.addEventListener('click', toggleMusic);
      vinylPlayer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMusic();
        }
      });
    }

    if (heroMusicBtn) {
      heroMusicBtn.addEventListener('click', toggleMusic);
    }
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function setupYouTubePlayer() {
    window.onYouTubeIframeAPIReady = function () {
      try {
        const originVal = window.location.protocol.startsWith('http') ? window.location.origin : undefined;
        const videoId = config.music?.youtubeId || 'QgaTQ5-XfMM';
        const playerVars = {
          'playsinline': 1,
          'controls': 0,
          'disablekb': 1,
          'fs': 0,
          'rel': 0,
          'loop': 1,
          'playlist': videoId
        };
        if (originVal) {
          playerVars.origin = originVal;
        }

        ytPlayer = new YT.Player('youtube-audio-frame', {
          height: '1',
          width: '1',
          videoId: videoId,
          playerVars: playerVars,
          events: {
            'onReady': function () {
              isYtReady = true;
            },
            'onStateChange': function (event) {
              if (window.YT && event.data === YT.PlayerState.PLAYING) {
                setMusicPlayingState(true);
              } else if (window.YT && event.data === YT.PlayerState.ENDED) {
                // Loop continuously when track reaches the end
                if (isMusicPlaying && ytPlayer && typeof ytPlayer.playVideo === 'function') {
                  try {
                    ytPlayer.seekTo(0);
                    ytPlayer.playVideo();
                  } catch (e) {
                    console.warn('YouTube loop restart note:', e);
                  }
                } else {
                  setMusicPlayingState(false);
                }
              } else if (window.YT && event.data === YT.PlayerState.PAUSED) {
                setMusicPlayingState(false);
              }
            },
            'onError': function (err) {
              console.log('YouTube note: fallback to audio synth', err);
              if (isMusicPlaying) {
                startSynthMusic();
              }
            }
          }
        });

        // Also ensure any HTML5 audio tags have loop enabled
        document.querySelectorAll('audio').forEach(audio => {
          audio.loop = true;
        });
      } catch (err) {
        console.warn('YouTube player init note:', err);
      }
    };

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  function playMusic() {
    setMusicPlayingState(true);
    let started = false;
    if (ytPlayer && isYtReady && typeof ytPlayer.playVideo === 'function') {
      try {
        ytPlayer.playVideo();
        started = true;
      } catch (e) {
        console.warn('Fallback to Web Audio:', e);
      }
    }

    if (!started) {
      startSynthMusic();
    }
  }

  function pauseMusic() {
    if (ytPlayer && isYtReady && typeof ytPlayer.pauseVideo === 'function') {
      try {
        ytPlayer.pauseVideo();
      } catch (e) {
        console.warn(e);
      }
    }
    stopSynthMusic();
    setMusicPlayingState(false);
  }

  function setMusicPlayingState(playing) {
    isMusicPlaying = playing;
    if (vinylPlayer) {
      if (playing) {
        vinylPlayer.classList.add('is-playing');
      } else {
        vinylPlayer.classList.remove('is-playing');
      }
    }

    if (vinylTooltipText) {
      vinylTooltipText.textContent = playing ? "Playing: A Thousand Years" : "Click to Play Vinyl";
    }

    if (heroMusicBtn) {
      const btnText = heroMusicBtn.querySelector('.js-hero-music-text');
      if (btnText) {
        btnText.textContent = playing ? "Pause Music" : "Play A Thousand Years";
      }
    }
  }

  // Cello & Piano Web Audio Synthesis — A Thousand Years (ThePianoGuys / Christina Perri)
  const aThousandYearsSequence = [
    { bass: 116.54, cello: 233.08, melody: 466.16, chord: [293.66, 349.23] }, // Bb major (Bb3, D4, F4, Bb4)
    { bass: 116.54, cello: 233.08, melody: 523.25, chord: [293.66, 349.23] }, // C5
    { bass: 116.54, cello: 233.08, melody: 587.33, chord: [293.66, 349.23] }, // D5
    { bass: 116.54, cello: 233.08, melody: 523.25, chord: [293.66, 349.23] }, // C5
    { bass: 87.31,  cello: 174.61, melody: 440.00, chord: [261.63, 349.23] }, // F major (F3, C4, F4, A4)
    { bass: 87.31,  cello: 174.61, melody: 349.23, chord: [261.63, 349.23] }, // F4
    { bass: 87.31,  cello: 174.61, melody: 392.00, chord: [261.63, 349.23] }, // G4
    { bass: 87.31,  cello: 174.61, melody: 440.00, chord: [261.63, 349.23] }, // A4
    { bass: 98.00,  cello: 196.00, melody: 392.00, chord: [233.08, 293.66] }, // G minor (G3, Bb3, D4, G4)
    { bass: 98.00,  cello: 196.00, melody: 349.23, chord: [233.08, 293.66] }, // F4
    { bass: 98.00,  cello: 196.00, melody: 293.66, chord: [233.08, 293.66] }, // D4
    { bass: 98.00,  cello: 196.00, melody: 349.23, chord: [233.08, 293.66] }, // F4
    { bass: 77.78,  cello: 155.56, melody: 311.13, chord: [233.08, 311.13] }, // Eb major (Eb3, Bb3, Eb4, G4)
    { bass: 77.78,  cello: 155.56, melody: 349.23, chord: [233.08, 311.13] }, // F4
    { bass: 77.78,  cello: 155.56, melody: 392.00, chord: [233.08, 311.13] }, // G4
    { bass: 77.78,  cello: 155.56, melody: 349.23, chord: [233.08, 311.13] }  // F4
  ];

  function playSynthNote(freq, type, gainVal, decay) {
    if (!synthAudioCtx) return;
    try {
      const osc = synthAudioCtx.createOscillator();
      const gain = synthAudioCtx.createGain();
      const filter = synthAudioCtx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, synthAudioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'sawtooth' ? 800 : 1400, synthAudioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, synthAudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, synthAudioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, synthAudioCtx.currentTime + decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(synthAudioCtx.destination);

      osc.start();
      osc.stop(synthAudioCtx.currentTime + decay + 0.05);
    } catch (e) {
      console.warn(e);
    }
  }

  function playSynthStep() {
    const item = aThousandYearsSequence[noteIndex % aThousandYearsSequence.length];

    if (item.bass) {
      playSynthNote(item.bass, 'sawtooth', 0.05, 2.6);
    }
    if (item.cello) {
      playSynthNote(item.cello, 'triangle', 0.06, 2.2);
    }
    if (item.melody) {
      playSynthNote(item.melody, 'sine', 0.09, 1.9);
    }
    if (item.chord) {
      item.chord.forEach((note, i) => {
        setTimeout(() => {
          playSynthNote(note, 'sine', 0.04, 1.5);
        }, (i + 1) * 110);
      });
    }

    noteIndex = (noteIndex + 1) % aThousandYearsSequence.length;
  }

  function startSynthMusic() {
    if (!synthAudioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      synthAudioCtx = new AudioContextClass();
    }
    if (synthAudioCtx.state === 'suspended') {
      synthAudioCtx.resume();
    }
    playSynthStep();
    synthInterval = setInterval(playSynthStep, 720);
  }

  function stopSynthMusic() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  /* ==========================================================================
     FIREBASE FIRESTORE INITIALIZATION
     ========================================================================== */
  let db = null;

  function getFirestoreDb() {
    if (db) return db;
    if (window.firebase && config.integrations?.firebaseConfig) {
      try {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(config.integrations.firebaseConfig);
        }
        db = firebase.firestore();
      } catch (err) {
        console.warn('Firebase initialization error:', err);
      }
    }
    return db;
  }

  /* ==========================================================================
     7. RSVP & CALENDAR BUILDER
     ========================================================================== */
  function initRSVP() {
    if (!rsvpForm) return;

    // Error feedback message element
    let rsvpErrorEl = document.getElementById('rsvp-error-msg');
    if (!rsvpErrorEl) {
      rsvpErrorEl = document.createElement('p');
      rsvpErrorEl.id = 'rsvp-error-msg';
      rsvpErrorEl.className = 'form-error-msg';
      rsvpErrorEl.style.cssText = 'color: #9E2A2B; font-size: 0.9rem; margin-top: 0.8rem; display: none; text-align: center;';
      rsvpForm.appendChild(rsvpErrorEl);
    }

    rsvpForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('rsvp-name');
      const attendingRadio = document.querySelector('input[name="attending"]:checked');
      const eventSelection = document.querySelector('input[name="attending_events"]:checked');
      const guestsSelect = document.getElementById('rsvp-guests');
      const messageInput = document.getElementById('rsvp-message');
      const submitBtn = rsvpForm.querySelector('.form-submit-btn');
      const submitBtnSpan = submitBtn ? submitBtn.querySelector('span') : null;

      const name = nameInput ? nameInput.value.trim() : '';
      const attending = attendingRadio ? attendingRadio.value : 'accept';
      const eventChoice = eventSelection ? eventSelection.value : 'both';
      const guests = guestsSelect ? guestsSelect.value : '1';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name) {
        alert('Please enter your full name.');
        return;
      }

      // Reset error state & display loading button state
      rsvpErrorEl.style.display = 'none';
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnSpan) submitBtnSpan.textContent = 'Sending RSVP...';

      const rsvpData = {
        name,
        attending, // 'accept' | 'decline'
        eventChoice,
        guests: parseInt(guests, 10) || 1,
        message,
        createdAt: (window.firebase && firebase.firestore?.FieldValue)
          ? firebase.firestore.FieldValue.serverTimestamp()
          : new Date().toISOString()
      };

      try {
        // 1. Write to Firebase Firestore (collection: 'rsvps')
        const firestoreDb = getFirestoreDb();
        if (firestoreDb) {
          await firestoreDb.collection('rsvps').add(rsvpData);
        }

        // 2. Submit to Formspree for instant email notification
        const formspreeUrl = config.integrations?.formspreeEndpoint;
        if (formspreeUrl) {
          try {
            await fetch(formspreeUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                name,
                attending: attending === 'accept' ? 'Joyfully Accept' : 'Regretfully Decline',
                eventSelection: eventChoice,
                guests,
                message: message || '(No additional message)',
                submittedAt: new Date().toLocaleString()
              })
            });
          } catch (formspreeErr) {
            console.warn('Formspree notification note:', formspreeErr);
          }
        }

        // 3. Local offline backup
        try {
          const stored = JSON.parse(localStorage.getItem('wedding_rsvp_submissions') || '[]');
          stored.push({ ...rsvpData, submittedAt: new Date().toISOString() });
          localStorage.setItem('wedding_rsvp_submissions', JSON.stringify(stored));
        } catch (err) {
          console.warn('Could not save RSVP locally:', err);
        }

        // 4. Google Apps Script backup if configured
        if (config.integrations?.googleAppsScriptUrl) {
          fetch(config.integrations.googleAppsScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rsvpData)
          }).catch(err => console.warn('Webhook sync error:', err));
        }

        // 5. Success state
        if (rsvpGuestNameDisplay) {
          rsvpGuestNameDisplay.textContent = name;
        }

        rsvpFormContainer.style.display = 'none';
        rsvpConfirmation.classList.add('active');

        setupCalendarButtons(eventChoice);
      } catch (err) {
        console.error('RSVP submission error:', err);
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnSpan) submitBtnSpan.textContent = 'Send RSVP';
        rsvpErrorEl.textContent = 'Unable to submit your RSVP right now. Please check your connection and try again.';
        rsvpErrorEl.style.display = 'block';
      }
    });
  }

  function setupCalendarButtons(eventChoice) {
    const couple = config.couple?.displayNames || "Ashik & Jerrin";
    const title = `Wedding & Celebration of ${couple}`;
    const venue = "Our Lady of Lourdes Metropolitan Cathedral & Lourdes Centenary Hall, East Fort, Thrissur";
    const description = `We invite you to celebrate the wedding of ${couple}. Nuptial ceremony at 10:30 AM followed by Celebration Lunch at Lourdes Centenary Hall, East Fort, Thrissur.`;
    
    const startIso = config.event?.weddingDateISO || "2026-09-21T10:30:00";
    const endIso = config.event?.weddingEndISO || "2026-09-21T15:00:00";

    const startDate = new Date(startIso);
    const endDate = new Date(endIso);

    function formatGCalDate(d) {
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    }

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(venue)}`;

    if (btnGoogleCalendar) {
      btnGoogleCalendar.setAttribute('href', gcalUrl);
    }

    if (btnDownloadIcs) {
      btnDownloadIcs.addEventListener('click', (e) => {
        e.preventDefault();
        generateAndDownloadIcs(title, venue, description, startDate, endDate);
      });
    }
  }

  function generateAndDownloadIcs(title, venue, description, startDate, endDate) {
    function formatIcsDate(d) {
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ashik & Jerrin Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@ashikandjerrin.com`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${venue.replace(/\n/g, '\\n')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Ashik-Jerrin-Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ==========================================================================
     8. WEDDING WISHES (GUESTBOOK)
     ========================================================================== */
  function initGuestbook() {
    let wishes = [];

    function getLocalOrInitialWishes() {
      try {
        const stored = JSON.parse(localStorage.getItem('wedding_guestbook_wishes') || '[]');
        return [...stored, ...(config.initialWishes || [])];
      } catch (e) {
        return config.initialWishes || [];
      }
    }

    function renderWishes() {
      if (!wishesContainer) return;
      wishesContainer.innerHTML = wishes.map(wish => `
        <div class="wish-card reveal-on-scroll">
          <div class="wish-header">
            <h4 class="wish-author">${escapeHtml(wish.name)}</h4>
            <span class="wish-date">${escapeHtml(wish.date)}</span>
          </div>
          <p class="wish-message">“${escapeHtml(wish.message)}”</p>
        </div>
      `).join('');
    }

    // Initial render from local/config while Firestore connects
    wishes = getLocalOrInitialWishes();
    renderWishes();

    // Connect to Firestore real-time listener
    const firestoreDb = getFirestoreDb();
    if (firestoreDb) {
      try {
        firestoreDb.collection('wishes')
          .orderBy('createdAt', 'desc')
          .onSnapshot((snapshot) => {
            if (!snapshot.empty) {
              const liveWishes = [];
              snapshot.forEach(doc => {
                const data = doc.data();
                let dateStr = data.date;
                if (!dateStr && data.createdAt) {
                  const d = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                  dateStr = d.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  });
                }
                liveWishes.push({
                  id: doc.id,
                  name: data.name || 'Well-wisher',
                  message: data.message || '',
                  date: dateStr || ''
                });
              });
              wishes = liveWishes;
              renderWishes();
            } else {
              // If collection is empty, display initial curated wishes
              wishes = config.initialWishes || [];
              renderWishes();
            }
          }, (err) => {
            console.warn('Firestore wishes snapshot listener note:', err);
            wishes = getLocalOrInitialWishes();
            renderWishes();
          });
      } catch (err) {
        console.warn('Could not attach Firestore wishes listener:', err);
      }
    }

    if (openWishModalBtn && wishModal) {
      openWishModalBtn.addEventListener('click', () => {
        wishModal.classList.add('open');
      });
    }

    if (closeWishModalBtn && wishModal) {
      closeWishModalBtn.addEventListener('click', () => {
        wishModal.classList.remove('open');
      });
    }

    if (wishModal) {
      wishModal.addEventListener('click', (e) => {
        if (e.target === wishModal) {
          wishModal.classList.remove('open');
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && wishModal.classList.contains('open')) {
          wishModal.classList.remove('open');
        }
      });
    }

    if (wishForm) {
      wishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const authorInput = document.getElementById('wish-author-input');
        const messageInput = document.getElementById('wish-message-input');
        const modalSubmitBtn = wishForm.querySelector('button[type="submit"]');
        const modalSubmitText = modalSubmitBtn ? modalSubmitBtn.querySelector('span') : null;

        const name = authorInput ? authorInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !message) {
          alert('Please enter both your name and wedding wish.');
          return;
        }

        const dateFormatted = new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        if (modalSubmitBtn) modalSubmitBtn.disabled = true;
        if (modalSubmitText) modalSubmitText.textContent = 'Posting Blessing...';

        try {
          const firestoreDb = getFirestoreDb();
          if (firestoreDb) {
            await firestoreDb.collection('wishes').add({
              name,
              message,
              date: dateFormatted,
              createdAt: (window.firebase && firebase.firestore?.FieldValue)
                ? firebase.firestore.FieldValue.serverTimestamp()
                : new Date().toISOString()
            });
          } else {
            // Local offline fallback
            const newWish = {
              id: 'wish-' + Date.now(),
              name,
              message,
              date: dateFormatted
            };
            wishes.unshift(newWish);
            try {
              const stored = JSON.parse(localStorage.getItem('wedding_guestbook_wishes') || '[]');
              stored.unshift(newWish);
              localStorage.setItem('wedding_guestbook_wishes', JSON.stringify(stored));
            } catch (err) {
              console.warn('Could not save wish locally:', err);
            }
            renderWishes();
          }

          wishForm.reset();
          if (wishModal) wishModal.classList.remove('open');
        } catch (err) {
          console.error('Error posting wish:', err);
          alert('Unable to post your blessing right now. Please check your internet connection and try again.');
        } finally {
          if (modalSubmitBtn) modalSubmitBtn.disabled = false;
          if (modalSubmitText) modalSubmitText.textContent = 'Post Blessing';
        }
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ==========================================================================
     9. SCROLL INTERSECTION OBSERVER
     ========================================================================== */
  function initScrollObserver() {
    const scrollElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '60px 0px -10px 0px'
    });

    scrollElements.forEach(el => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
