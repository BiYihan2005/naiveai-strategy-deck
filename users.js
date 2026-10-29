/* 用户金字塔：层级与五类用户联动 */
(() => {
    const tiers = {
        high: { label: '高价值用户', summary: '初创、大公司团队与投研机构', count: '3 类用户', defaultPersona: 'startup' },
        active: { label: '活跃用户', summary: '科研课题组', count: '1 类用户', defaultPersona: 'scientist' },
        normal: { label: '普通用户', summary: '大众', count: '1 类用户', defaultPersona: 'consumer' }
    };

    const tierButtons = [...document.querySelectorAll('[data-user-tier]')];
    const personaTabs = [...document.querySelectorAll('[data-user-persona]')];
    const personaPanels = [...document.querySelectorAll('[data-user-panel]')];
    const tierLabel = document.getElementById('userTierLabel');
    const tierSummary = document.getElementById('userTierSummary');
    const tierCount = document.getElementById('userTierCount');
    if (!tierButtons.length || !personaTabs.length || !personaPanels.length) return;

    function selectPersona(persona, moveFocus = false) {
        const selectedTab = personaTabs.find(tab => tab.dataset.userPersona === persona);
        if (!selectedTab || selectedTab.hidden) return;

        personaTabs.forEach(tab => {
            const selected = tab === selectedTab;
            tab.classList.toggle('is-active', selected);
            tab.setAttribute('aria-selected', selected ? 'true' : 'false');
            tab.tabIndex = selected ? 0 : -1;
        });
        personaPanels.forEach(panel => {
            const selected = panel.dataset.userPanel === persona;
            panel.hidden = !selected;
            panel.classList.toggle('is-active', selected);
        });
        if (moveFocus) selectedTab.focus();
    }

    function selectTier(tier) {
        const config = tiers[tier];
        if (!config) return;
        tierButtons.forEach(button => {
            const selected = button.dataset.userTier === tier;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
        personaTabs.forEach(tab => { tab.hidden = tab.dataset.tierGroup !== tier; });
        tierLabel.textContent = config.label;
        tierSummary.textContent = config.summary;
        tierCount.textContent = config.count;
        selectPersona(config.defaultPersona);
    }

    tierButtons.forEach(button => button.addEventListener('click', () => selectTier(button.dataset.userTier)));
    personaTabs.forEach(tab => {
        tab.addEventListener('click', () => selectPersona(tab.dataset.userPersona));
        tab.addEventListener('keydown', event => {
            const visibleTabs = personaTabs.filter(item => !item.hidden);
            const current = visibleTabs.indexOf(tab);
            let next = null;
            if (event.key === 'ArrowRight') next = (current + 1) % visibleTabs.length;
            if (event.key === 'ArrowLeft') next = (current - 1 + visibleTabs.length) % visibleTabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = visibleTabs.length - 1;
            if (next === null) return;
            event.preventDefault();
            event.stopPropagation();
            selectPersona(visibleTabs[next].dataset.userPersona, true);
        });
    });

    selectTier('high');
})();
