/* Goals & habits evolution modal, backup export/import */
    // -----------------------------------------------------------------------
    // 11. GOALS & HABITS EVOLUTION MODAL & BACKUP EXPORT/IMPORT
    // -----------------------------------------------------------------------
    function openGoalsEvolutionModal() {
      document.getElementById('evolve-goal-input').value = gameState.targetGoal;
      renderEvolveHabitsList();
      document.getElementById('goals-evolution-modal').classList.remove('hidden');
    }

    function closeGoalsEvolutionModal() {
      document.getElementById('goals-evolution-modal').classList.add('hidden');
    }

    function renderEvolveHabitsList() {
      const container = document.getElementById('evolve-habits-list');
      document.getElementById('evolve-habit-count').textContent = `${gameState.habits.length}/5`;

      container.innerHTML = gameState.habits.map((h, idx) => `
        <div class="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 flex items-center justify-between gap-2">
          <span class="text-xs text-white truncate">${h.text}</span>
          <button type="button" onclick="removeEvolveHabit('${h.id}')" class="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded bg-rose-500/10 shrink-0">
            Remove
          </button>
        </div>
      `).join('');
    }

    function addEvolveHabit() {
      const input = document.getElementById('evolve-custom-habit');
      const val = input.value.trim();
      if (!val) return;
      if (gameState.habits.length >= 5) {
        showToast('Maximum 5 habits allowed!', 'warning');
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
      renderEvolveHabitsList();
    }

    function removeEvolveHabit(id) {
      if (gameState.habits.length <= 3) {
        showToast('You must maintain at least 3 active habits!', 'warning');
        return;
      }
      gameState.habits = gameState.habits.filter(h => h.id !== id);
      SoundFX.pop();
      renderEvolveHabitsList();
    }

    function saveEvolveGoals() {
      if (gameState.habits.length < 3) {
        showToast('You must have at least 3 active habits!', 'warning');
        return;
      }
      const goalVal = document.getElementById('evolve-goal-input').value.trim();
      if (goalVal) {
        gameState.targetGoal = goalVal;
      }
      saveState();
      renderGameHub();
      closeGoalsEvolutionModal();
      SoundFX.levelUp();
      showToast('Goals and habits successfully evolved! Keep locking in.', 'success');
      triggerAvatarSpeech('Goals updated! Evolving to the next level! 🔥');
    }

    function exportSaveData() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `winter_arc_save_${getCurrentGameDateKey()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      SoundFX.pop();
      showToast('Save file exported successfully!', 'success');
    }

    function importSaveData(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && parsed.player && parsed.habits) {
            gameState = parsed;
            saveState();
            SoundFX.levelUp();
            location.reload();
          } else {
            throw new Error('Invalid format');
          }
        } catch (err) {
          SoundFX.error();
          showToast('Invalid backup file format.', 'warning');
        }
      };
      reader.readAsText(file);
    }

