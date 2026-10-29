/* Campaign：AARRR 五阶段联动 */
(() => {
    const root = document.querySelector('[data-campaign-lifecycle]');
    if (!root) return;

    const buttons = [...root.querySelectorAll('[data-campaign-stage]')];
    const panels = [...root.querySelectorAll('[data-campaign-panel]')];
    const counter = document.getElementById('campaignStageCount');
    const progress = document.getElementById('campaignStageProgress');
    const previous = root.querySelector('[data-campaign-prev]');
    const next = root.querySelector('[data-campaign-next]');
    let activeIndex = 0;

    const stageName = (index) => {
        const button = buttons[index];
        return `${button.dataset.stageEnglish}（${button.dataset.stageChinese}）`;
    };

    function selectStage(index, moveFocus = false) {
        activeIndex = (index + buttons.length) % buttons.length;
        const selectedButton = buttons[activeIndex];
        const selectedStage = selectedButton.dataset.campaignStage;

        buttons.forEach((button, buttonIndex) => {
            const selected = buttonIndex === activeIndex;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-selected', selected ? 'true' : 'false');
            button.tabIndex = selected ? 0 : -1;
        });

        panels.forEach((panel) => {
            const selected = panel.dataset.campaignPanel === selectedStage;
            panel.hidden = !selected;
            panel.classList.toggle('is-active', selected);
        });

        counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(buttons.length).padStart(2, '0')}`;
        progress.style.transform = `scaleX(${activeIndex / (buttons.length - 1)})`;
        previous.textContent = `← ${stageName((activeIndex - 1 + buttons.length) % buttons.length)}`;
        next.textContent = activeIndex === buttons.length - 1
            ? `回到 ${stageName(0)} ↻`
            : `下一环节：${stageName(activeIndex + 1)} →`;
        previous.setAttribute('aria-label', `查看上一环节：${stageName((activeIndex - 1 + buttons.length) % buttons.length)}`);
        next.setAttribute('aria-label', activeIndex === buttons.length - 1 ? `回到第一环节：${stageName(0)}` : `查看下一环节：${stageName(activeIndex + 1)}`);

        if (moveFocus) selectedButton.focus();
    }

    buttons.forEach((button, index) => {
        button.addEventListener('click', () => selectStage(index));
        button.addEventListener('keydown', (event) => {
            let targetIndex = null;
            if (event.key === 'ArrowRight') targetIndex = (index + 1) % buttons.length;
            if (event.key === 'ArrowLeft') targetIndex = (index - 1 + buttons.length) % buttons.length;
            if (event.key === 'Home') targetIndex = 0;
            if (event.key === 'End') targetIndex = buttons.length - 1;
            if (targetIndex === null) return;
            event.preventDefault();
            event.stopPropagation();
            selectStage(targetIndex, true);
        });
    });

    previous.addEventListener('click', () => selectStage(activeIndex - 1));
    next.addEventListener('click', () => selectStage(activeIndex + 1));
    selectStage(0);
})();
