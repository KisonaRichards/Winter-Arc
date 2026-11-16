/* Onboarding wizard, validation & contract signing */
    // -----------------------------------------------------------------------
    // 5. ONBOARDING STEP 1 REAL-TIME VALIDATION & UNIT TOGGLES
    // -----------------------------------------------------------------------
    function setHeightUnit(unit) {
      gameState.player.heightUnit = unit;
      SoundFX.pop();

      const btnFt = document.getElementById('toggle-height-ft');
      const btnCm = document.getElementById('toggle-height-cm');
      const groupFt = document.getElementById('height-ft-group');
      const groupCm = document.getElementById('height-cm-group');

      if (unit === 'ft') {
        btnFt.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-ice-500 text-obsidian-950 transition-all';
        btnCm.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 hover:text-white transition-all';
        groupFt.classList.remove('hidden');
        groupCm.classList.add('hidden');
      } else {
        btnCm.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-ice-500 text-obsidian-950 transition-all';
        btnFt.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 hover:text-white transition-all';
        groupCm.classList.remove('hidden');
        groupFt.classList.add('hidden');
      }
      validateStep1Inputs(false);
    }

    function setWeightUnit(unit) {
      gameState.player.weightUnit = unit;
      SoundFX.pop();

      const btnLbs = document.getElementById('toggle-weight-lbs');
      const btnKg = document.getElementById('toggle-weight-kg');
      const suffix = document.getElementById('weight-unit-suffix');
      const input = document.getElementById('input-weight');

      if (unit === 'lbs') {
        btnLbs.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-ice-500 text-obsidian-950 transition-all';
        btnKg.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 hover:text-white transition-all';
        suffix.textContent = 'lbs';
        input.placeholder = '175';
      } else {
        btnKg.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-ice-500 text-obsidian-950 transition-all';
        btnLbs.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 hover:text-white transition-all';
        suffix.textContent = 'kg';
        input.placeholder = '79';
      }
      validateStep1Inputs(false);
    }

    function setFieldError(inputId, errorId, message) {
      const inputEl = document.getElementById(inputId);
      const errEl = document.getElementById(errorId);
      if (message) {
        if (inputEl) {
          inputEl.classList.remove('border-slate-700', 'focus:border-ice-400');
          inputEl.classList.add('border-rose-500', 'focus:border-rose-500');
        }
        errEl.textContent = message;
        errEl.classList.remove('hidden');
        return false;
      } else {
        if (inputEl) {
          inputEl.classList.add('border-slate-700', 'focus:border-ice-400');
          inputEl.classList.remove('border-rose-500', 'focus:border-rose-500');
        }
        errEl.classList.add('hidden');
        return true;
      }
    }

    function validateStep1Inputs(strictEmptyCheck = false) {
      let allValid = true;

      // 1. Validate Code Name: strictly alphanumeric (letters & numbers only)
      const nameVal = document.getElementById('input-name').value.trim();
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      if (nameVal.length > 0 && !alphanumericRegex.test(nameVal)) {
        setFieldError('input-name', 'error-name', 'Alphanumeric characters only (letters & numbers, no symbols/spaces).');
        allValid = false;
      } else if (strictEmptyCheck && nameVal.length === 0) {
        setFieldError('input-name', 'error-name', 'Please enter your code name.');
        allValid = false;
      } else {
        setFieldError('input-name', 'error-name', null);
      }

      // 2. Validate Height (ft/in or cm)
      if (gameState.player.heightUnit === 'ft') {
        const ftRaw = document.getElementById('input-height-ft').value.trim();
        const inRaw = document.getElementById('input-height-in').value.trim();
        const digitsOnly = /^\d+$/;

        if ((ftRaw && !digitsOnly.test(ftRaw)) || (inRaw && !digitsOnly.test(inRaw))) {
          setFieldError('input-height-ft', 'error-height', 'Height must be numeric digits only.');
          allValid = false;
        } else if (ftRaw && (parseInt(ftRaw, 10) < 3 || parseInt(ftRaw, 10) > 8)) {
          setFieldError('input-height-ft', 'error-height', 'Enter feet between 3 and 8.');
          allValid = false;
        } else if (inRaw && (parseInt(inRaw, 10) < 0 || parseInt(inRaw, 10) > 11)) {
          setFieldError('input-height-in', 'error-height', 'Inches must be between 0 and 11.');
          allValid = false;
        } else if (strictEmptyCheck && (!ftRaw || inRaw === '')) {
          setFieldError('input-height-ft', 'error-height', 'Enter both feet and inches.');
          allValid = false;
        } else {
          setFieldError('input-height-ft', 'error-height', null);
          setFieldError('input-height-in', 'error-height', null);
        }
      } else {
        const cmRaw = document.getElementById('input-height-cm').value.trim();
        const digitsOnly = /^\d+$/;
        if (cmRaw && !digitsOnly.test(cmRaw)) {
          setFieldError('input-height-cm', 'error-height', 'Height in cm must be numeric.');
          allValid = false;
        } else if (cmRaw && (parseInt(cmRaw, 10) < 90 || parseInt(cmRaw, 10) > 250)) {
          setFieldError('input-height-cm', 'error-height', 'Enter cm between 90 and 250.');
          allValid = false;
        } else if (strictEmptyCheck && !cmRaw) {
          setFieldError('input-height-cm', 'error-height', 'Enter your height in cm.');
          allValid = false;
        } else {
          setFieldError('input-height-cm', 'error-height', null);
        }
      }

      // 3. Validate Weight (lbs or kg)
      const wtRaw = document.getElementById('input-weight').value.trim();
      const numericRegex = /^\d+(\.\d+)?$/;
      if (wtRaw && !numericRegex.test(wtRaw)) {
        setFieldError('input-weight', 'error-weight', 'Weight must be a valid number.');
        allValid = false;
      } else if (wtRaw) {
        const wtNum = parseFloat(wtRaw);
        const minWt = gameState.player.weightUnit === 'lbs' ? 60 : 28;
        const maxWt = gameState.player.weightUnit === 'lbs' ? 700 : 320;
        if (wtNum < minWt || wtNum > maxWt) {
          setFieldError('input-weight', 'error-weight', `Enter weight between ${minWt}–${maxWt} ${gameState.player.weightUnit}.`);
          allValid = false;
        } else {
          setFieldError('input-weight', 'error-weight', null);
        }
      } else if (strictEmptyCheck) {
        setFieldError('input-weight', 'error-weight', `Enter your starting weight in ${gameState.player.weightUnit}.`);
        allValid = false;
      } else {
        setFieldError('input-weight', 'error-weight', null);
      }

      return allValid;
    }

    function initOnboardingUI() {
      const skinContainer = document.getElementById('skin-tone-options');
      skinContainer.innerHTML = SKIN_TONES.map(s => `
        <button type="button" onclick="selectAvatarFeature('skinTone', '${s.id}')"
          class="w-9 h-9 rounded-full border-2 transition-transform ${gameState.player.skinTone === s.id ? 'border-ice-400 scale-110 ring-2 ring-ice-400/40' : 'border-slate-700'}"
          style="background-color: ${s.hex};">
        </button>
      `).join('');

      const styleContainer = document.getElementById('hair-style-options');
      styleContainer.innerHTML = HAIR_STYLES.map(st => `
        <button type="button" onclick="selectAvatarFeature('hairStyle', '${st.id}')"
          class="px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${gameState.player.hairStyle === st.id ? 'bg-ice-500/20 border-ice-400 text-ice-300' : 'bg-obsidian-950 border-slate-800 text-slate-400 hover:text-white'}">
          ${st.label}
        </button>
      `).join('');

      const colorContainer = document.getElementById('hair-color-options');
      colorContainer.innerHTML = HAIR_COLORS.map(c => `
        <button type="button" onclick="selectAvatarFeature('hairColor', '${c.id}')"
          class="w-8 h-8 rounded-full border-2 transition-transform ${gameState.player.hairColor === c.id ? 'border-ice-400 scale-110 ring-2 ring-ice-400/40' : 'border-slate-700'}"
          style="background-color: ${c.hex};">
        </button>
      `).join('');

      document.getElementById('onboarding-avatar-preview').innerHTML = buildAvatarSVG(
        gameState.player.skinTone,
        gameState.player.hairStyle,
        gameState.player.hairColor,
        'gown'
      );

      renderAspectsGrid();
    }

    function selectAvatarFeature(key, val) {
      gameState.player[key] = val;
      SoundFX.pop();
      initOnboardingUI();
    }

    function renderAspectsGrid() {
      const grid = document.getElementById('aspects-grid');
      grid.innerHTML = LIFE_ASPECTS.map(a => {
        const selected = gameState.aspects.includes(a.id);
        return `
          <button type="button" onclick="toggleAspect('${a.id}')"
            class="p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${selected ? 'bg-ice-500/20 border-ice-400 shadow-lg shadow-ice-500/10' : 'bg-obsidian-950/80 border-slate-800 hover:border-slate-600'}">
            <div class="flex items-center justify-between w-full">
              <div class="w-8 h-8 rounded-xl bg-obsidian-900 flex items-center justify-center ${a.color}">
                <i class="fa-solid ${a.icon}"></i>
              </div>
              ${selected ? '<i class="fa-solid fa-circle-check text-ice-400 text-sm"></i>' : ''}
            </div>
            <span class="font-display font-bold text-xs text-white leading-snug">${a.name}</span>
          </button>
        `;
      }).join('');

      document.getElementById('aspect-count-badge').textContent = `${gameState.aspects.length} / 5 Selected`;
    }

    function toggleAspect(aspectId) {
      SoundFX.pop();
      const idx = gameState.aspects.indexOf(aspectId);
      if (idx > -1) {
        gameState.aspects.splice(idx, 1);
      } else {
        if (gameState.aspects.length >= 5) {
          showToast('You can select up to 5 core aspects!', 'warning');
          return;
        }
        gameState.aspects.push(aspectId);
      }
      renderAspectsGrid();
    }

    function renderHabitStepUI() {
      const suggestionsContainer = document.getElementById('suggested-habits-list');
      const relevantAspects = LIFE_ASPECTS.filter(a => gameState.aspects.includes(a.id));

      let allSuggestions = [];
      relevantAspects.forEach(a => {
        a.suggestions.forEach(s => {
          allSuggestions.push({ text: s, aspectId: a.id, aspectName: a.name, icon: a.icon, color: a.color });
        });
      });

      suggestionsContainer.innerHTML = allSuggestions.map(item => {
        const isSelected = gameState.habits.some(h => h.text === item.text);
        return `
          <button type="button" onclick="toggleHabitSelection('${item.text.replace(/'/g, "\\'")}', '${item.aspectId}')"
            class="p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${isSelected ? 'bg-ice-500/20 border-ice-400 text-white' : 'bg-obsidian-900/90 border-slate-800 text-slate-300 hover:border-slate-600'}">
            <div class="flex items-center gap-2.5 min-w-0">
              <i class="fa-solid ${item.icon} ${item.color} text-xs shrink-0"></i>
              <span class="text-xs font-medium truncate">${item.text}</span>
            </div>
            <i class="fa-solid ${isSelected ? 'fa-circle-check text-ice-400' : 'fa-plus text-slate-500'} text-xs shrink-0"></i>
          </button>
        `;
      }).join('');

      // Selected Pills
      const pillsContainer = document.getElementById('selected-habits-pills');
      pillsContainer.innerHTML = gameState.habits.map(h => `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ice-500/20 border border-ice-400/40 text-xs font-semibold text-ice-200">
          ${h.text}
          <button type="button" onclick="removeHabitById('${h.id}')" class="hover:text-rose-400 ml-1">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </span>
      `).join('');

      document.getElementById('habit-count-badge').textContent = `${gameState.habits.length} / 5 Habits Chosen`;
    }

    function toggleHabitSelection(text, aspectId) {
      SoundFX.pop();
      const existingIdx = gameState.habits.findIndex(h => h.text === text);
      if (existingIdx > -1) {
        if (gameState.habits.length <= 3) {
          showToast('You must keep at least 3 active habits!', 'warning');
          return;
        }
        gameState.habits.splice(existingIdx, 1);
      } else {
        if (gameState.habits.length >= 5) {
          showToast('Maximum 5 daily habits allowed!', 'warning');
          return;
        }
        gameState.habits.push({
          id: 'hab_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          text,
          aspectId: aspectId || gameState.aspects[0] || 'discipline',
          completedDate: null
        });
      }
      renderHabitStepUI();
    }

    function addCustomHabit() {
      const input = document.getElementById('custom-habit-input');
      const val = input.value.trim();
      if (!val) return;
      if (gameState.habits.length >= 5) {
        showToast('Maximum 5 daily habits allowed!', 'warning');
        return;
      }
      gameState.habits.push({
        id: 'hab_' + Date.now(),
        text: val,
        aspectId: gameState.aspects[0] || 'discipline',
        completedDate: null
      });
      input.value = '';
      SoundFX.pop();
      renderHabitStepUI();
    }

    function removeHabitById(id) {
      if (gameState.habits.length <= 3) {
        showToast('You must maintain at least 3 active habits!', 'warning');
        return;
      }
      gameState.habits = gameState.habits.filter(h => h.id !== id);
      renderHabitStepUI();
    }

    function goToWizardStep(step) {
      if (step > currentWizardStep) {
        if (currentWizardStep === 1) {
          const isValid = validateStep1Inputs(true);
          if (!isValid) {
            SoundFX.error();
            showToast('Please fix the highlighted red fields before continuing.', 'warning');
            return;
          }

          gameState.player.name = document.getElementById('input-name').value.trim();
          if (gameState.player.heightUnit === 'ft') {
            const ft = document.getElementById('input-height-ft').value.trim();
            const inch = document.getElementById('input-height-in').value.trim();
            gameState.player.heightDisplay = `${ft}'${inch}"`;
          } else {
            const cm = document.getElementById('input-height-cm').value.trim();
            gameState.player.heightDisplay = `${cm} cm`;
          }

          const weight = parseFloat(document.getElementById('input-weight').value.trim());
          gameState.player.startWeight = weight;
          gameState.player.currentWeight = weight;
        } else if (currentWizardStep === 2) {
          if (gameState.aspects.length < 2) {
            SoundFX.error();
            showToast(`Select at least 2 ${SEASON.arc} aspects!`, 'warning');
            return;
          }
        } else if (currentWizardStep === 3) {
          if (gameState.habits.length < 3) {
            SoundFX.error();
            showToast('Choose at least 3 daily habits to lock in on!', 'warning');
            return;
          }
          const goal = document.getElementById('input-target-goal').value.trim();
          gameState.targetGoal = goal || 'Stay 100% consistent and level up my life this ' + SEASON.arc + '.';
        }
      }

      currentWizardStep = step;
      SoundFX.pop();

      [1, 2, 3, 4].forEach(s => {
        document.getElementById(`wizard-step-${s}`).classList.toggle('hidden', s !== step);
      });

      const dots = document.querySelectorAll('#wizard-steps-indicator .step-dot');
      dots.forEach((dot, idx) => {
        if (idx < step) {
          dot.classList.remove('bg-obsidian-700');
          dot.classList.add('bg-ice-400');
        } else {
          dot.classList.add('bg-obsidian-700');
          dot.classList.remove('bg-ice-400');
        }
      });

      if (step === 3) renderHabitStepUI();
      if (step === 4) prepareContractStep();
    }

    function prepareContractStep() {
      document.getElementById('contract-name').textContent = gameState.player.name;
      document.getElementById('contract-date').textContent = new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      document.getElementById('contract-habits-summary').innerHTML = gameState.habits.map(h => `
        <span class="px-2.5 py-1 rounded-lg bg-ice-500/10 border border-ice-400/25 text-xs text-ice-200 font-medium">
          ✓ ${h.text}
        </span>
      `).join('');

      setupSignatureCanvas();
    }

    // Interactive Signature Canvas
    function setupSignatureCanvas() {
      const canvas = document.getElementById('signature-pad');
      const placeholder = document.getElementById('signature-placeholder');
      const ctx = canvas.getContext('2d');

      // Match actual pixel size to CSS display size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 500;
      canvas.height = rect.height || 144;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let drawing = false;

      function getPos(e) {
        const r = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - r.left) * (canvas.width / r.width),
          y: (clientY - r.top) * (canvas.height / r.height)
        };
      }

      function startDraw(e) {
        e.preventDefault();
        drawing = true;
        hasSignedCanvas = true;
        placeholder.classList.add('hidden');
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }

      function moveDraw(e) {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      function endDraw() {
        drawing = false;
      }

      canvas.onmousedown = startDraw;
      canvas.onmousemove = moveDraw;
      window.onmouseup = endDraw;

      canvas.ontouchstart = startDraw;
      canvas.ontouchmove = moveDraw;
      canvas.ontouchend = endDraw;
    }

    function clearSignature() {
      const canvas = document.getElementById('signature-pad');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasSignedCanvas = false;
      document.getElementById('signature-placeholder').classList.remove('hidden');
    }

    function completeOnboarding() {
      if (!hasSignedCanvas) {
        SoundFX.error();
        showToast(`Sign the ${SEASON.arc} contract first to seal your decree!`, 'warning');
        return;
      }

      const canvas = document.getElementById('signature-pad');
      gameState.signatureDataUrl = canvas.toDataURL('image/png');
      gameState.onboarded = true;
      gameState.lastWeeklyLogTimestamp = Date.now(); // First weekly log starts 7-day cadence

      gameState.aspects.forEach(a => {
        gameState.aspectXP[a] = 15;
      });
      gameState.metricHistory.push({
        date: getCurrentGameDateFormatted(),
        summary: `${gameState.player.startWeight} ${gameState.player.weightUnit}`,
        note: `Week 1 Baseline: Entered the ${SEASON.arc} bare room.`
      });

      saveState();
      SoundFX.scrollUnfurl();

      // Hide wizard and launch 3D Parchment Scroll Decree Reveal!
      document.getElementById('onboarding-screen').classList.add('hidden');
      openScrollDecreeModal();
    }

    function openScrollDecreeModal() {
      document.getElementById('decree-player-name').textContent = gameState.player.name;
      document.getElementById('decree-rules-list').innerHTML = gameState.habits.map((h, i) => `
        <li class="flex items-start gap-2.5">
          <span class="w-5 h-5 rounded-full bg-amber-900 text-amber-100 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">${i + 1}</span>
          <span>${h.text}</span>
        </li>
      `).join('');

      document.getElementById('scroll-decree-modal').classList.remove('hidden');
    }

    function enterRoomFromScroll() {
      SoundFX.levelUp();
      document.getElementById('scroll-decree-modal').classList.add('hidden');
      document.getElementById('game-hub-screen').classList.remove('hidden');
      renderGameHub();

      setTimeout(() => {
        triggerAvatarSpeech(`Welcome ${gameState.player.name}! Share with 3 friends to ditch this gown fast! ❄️`);
        if (!gameState.shareRewardClaimed) {
          openShareBoostModal();
        }
      }, 450);
    }
