(() => {
  'use strict';

  const rsi = document.getElementById('rsi');
  if (!rsi) return;

  const tabs = [...rsi.querySelectorAll('[data-rsi-challenge]')];
  const panels = [...rsi.querySelectorAll('[data-rsi-challenge-panel]')];

  function activateChallenge(id, focus = false) {
    tabs.forEach(tab => {
      const active = tab.dataset.rsiChallenge === id;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach(panel => {
      const active = panel.dataset.rsiChallengePanel === id;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateChallenge(tab.dataset.rsiChallenge));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else next = (index - 1 + tabs.length) % tabs.length;
      activateChallenge(tabs[next].dataset.rsiChallenge, true);
    });
  });

  const benchmarkTabs = [...rsi.querySelectorAll('[data-rsi-benchmark]')];
  const benchmarkPanels = [...rsi.querySelectorAll('[data-rsi-benchmark-panel]')];

  function activateBenchmark(id, focus = false) {
    benchmarkTabs.forEach(tab => {
      const active = tab.dataset.rsiBenchmark === id;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    benchmarkPanels.forEach(panel => {
      const active = panel.dataset.rsiBenchmarkPanel === id;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  }

  benchmarkTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateBenchmark(tab.dataset.rsiBenchmark));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = benchmarkTabs.length - 1;
      else if (event.key === 'ArrowRight') next = (index + 1) % benchmarkTabs.length;
      else next = (index - 1 + benchmarkTabs.length) % benchmarkTabs.length;
      activateBenchmark(benchmarkTabs[next].dataset.rsiBenchmark, true);
    });
  });
})();
