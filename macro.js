(() => {
  'use strict';

  const macro = document.getElementById('macro');
  if (!macro) return;
  const $ = (selector, root = macro) => root.querySelector(selector);
  const $$ = (selector, root = macro) => [...root.querySelectorAll(selector)];
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Motion is useful for reading causality, but can always be paused. */
  const motionButton = $('#macroMotion');
  if (motionReduced) {
    macro.classList.add('motion-paused');
    if (motionButton) motionButton.textContent = '动态已减少';
  }
  motionButton?.addEventListener('click', () => {
    const paused = macro.classList.toggle('motion-paused');
    motionButton.textContent = paused ? '播放逻辑线路' : '暂停逻辑线路';
    motionButton.setAttribute('aria-pressed', String(paused));
  });

  /* 01 — financial comparison. Chart values are USD 100m; sources retain original units. */
  const CNY_PER_USD = 6.7165;
  const fromCny = (value, original) => ({ usd: value / CNY_PER_USD, original });
  const usd = (value, original = '') => ({ usd: value, original });
  const companies = [
    {
      id: 'anthropic', name: 'Anthropic', period: '2026 H1｜Q2 单独列示',
      source: {
        title: 'Form S-1｜SEC EDGAR｜2026-10-26',
        detail: '合并经营报表与季度数据；美国 GAAP；原始单位：百万美元',
        url: 'https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm'
      },
      values: {
        revenue: usd(162.86, '16,286 百万美元'), grossProfit: null, research: null,
        netLoss: usd(807.48, '期内亏损 80,748 百万美元'), adjustedLoss: null, q2Operating: usd(9.74, 'Q2 经营利润 974 百万美元')
      }
    },
    {
      id: 'zhipu', name: '智谱', period: '人民币原始披露｜美元换算',
      source: {
        title: '2026 年中期业绩公告｜2026-08-31',
        detail: '财务摘要、综合损益表与非 IFRS 对账；原始单位：人民币千元',
        url: 'https://ea-cdn.eurolandir.com/press-releases-attachments./4174940/HKEX-EPS_20260831_12308929_0.PDF'
      },
      values: {
        revenue: fromCny(9.53892, '9.53892 亿元人民币'),
        grossProfit: fromCny(2.51611, '2.51611 亿元人民币'),
        research: fromCny(21.31171, '21.31171 亿元人民币'),
        netLoss: fromCny(20.71992, '期内亏损 20.71992 亿元人民币'),
        adjustedLoss: fromCny(19.64138, '经调整期内净亏损 19.64138 亿元人民币'),
        q2Operating: null
      }
    },
    {
      id: 'minimax', name: 'MiniMax', period: '2026 H1｜原始币种为美元',
      source: {
        title: '2026 年中期业绩公告｜2026-08-26',
        detail: '中期简明合并损益表与非 IFRS 对账；原始单位：千美元',
        url: 'https://www.minimax.io/news/minimax-announces-first-half-2026-financial-results-1787744160'
      },
      values: {
        revenue: usd(1.16573, '116,573 千美元'), grossProfit: usd(.20813, '20,813 千美元'), research: usd(2.96870, '296,870 千美元'),
        netLoss: usd(3.57997, '期内亏损 357,997 千美元'), adjustedLoss: usd(2.93031, '经调整净亏损 293,031 千美元'), q2Operating: null
      }
    }
  ];
  const h1Period = '报告期：截至 2026-06-30 止六个月｜金额单位：亿美元';
  const financeMetrics = {
    revenue: {
      label: '2026 H1 收入', period: h1Period,
      formula: '收入 = 报告期内确认的营业收入（直接取财报值）',
      scope: '三家公司都取截至 2026-06-30 止六个月。它是已经确认的半年收入，不是 ARR、年化收入、融资金额或公司估值。',
      note: '读图：比较的是同一半年的收入体量，不代表盈利能力和现金余额。'
    },
    grossProfit: {
      label: '2026 H1 毛利', period: h1Period,
      formula: '毛利 = 收入 − 营业成本（MiniMax 称“销售成本”）',
      scope: '智谱：953,892 − 702,281 = 251,611 人民币千元；MiniMax：116,573 − 95,760 = 20,813 千美元。Anthropic 未在此填入可比毛利，不按零处理。',
      note: '读图：毛利还没有扣除研发、销售和行政等费用，不等于经营利润或净利润。'
    },
    research: {
      label: '2026 H1 研发开支', period: h1Period,
      formula: '研发开支 = 报告期内计入损益的研发费用（直接取费用项）',
      scope: '智谱为 21.31171 亿元人民币，MiniMax 为 296,870 千美元。训练相关云服务可计入此项；它不是“总算力投入”，也不等于资本开支。Anthropic 不在此填入不同口径数字。',
      note: '读图：这是费用口径，不应把长期算力采购承诺或基础设施投资额直接加进来。'
    },
    netLoss: {
      label: '2026 H1 报表净亏损（绝对值）', period: h1Period,
      formula: '图示净亏损 = |min（期内净利润，0）|',
      scope: '也就是把报表中的亏损数字去掉负号，方便比较亏损大小。Anthropic 按美国 GAAP，智谱与 MiniMax 按各自 IFRS 报表口径；它不是经营利润，也不是现金消耗。',
      note: '特别注意：Anthropic 807.48 亿美元报表净亏损中，约 723.88 亿美元来自非现金公允价值变动，不能理解为同等金额的现金流出。'
    },
    adjustedLoss: {
      label: '2026 H1 经调整净亏损（绝对值）', period: h1Period,
      formula: '经调整净亏损 = 报表净亏损 − 公司加回的调整项目（按各自对账表）',
      scope: 'MiniMax：3.57997 −（0.28208 股份支付 + 0.31025 金融负债公允价值损失 + 0.05733 上市开支）= 2.93031 亿美元；智谱直接取其非 IFRS 对账值 19.64138 亿元人民币。',
      note: '读图：两家公司的调整项目并不相同，不能把这个非会计准则指标当成完全可比的“经营亏损”。Anthropic 不填不同口径数字。'
    },
    q2Operating: {
      label: '2026 Q2 经营利润', period: '报告期：2026 Q2 单季｜金额单位：亿美元｜仅 Anthropic 单列',
      formula: '经营利润 = 收入 − 营业成本 − 经营费用',
      scope: '这里只看 Anthropic 2026 Q2 单季的经营结果，不是 H1 累计值，也不是净利润；不混入营业外金融工具公允价值变动和所得税。',
      note: '经营利润率 = 9.74 ÷ 115.55 × 100% ≈ 8.4%（公司披露约 8%）。Q2 经营盈利不代表 H1 整体净利润转正。'
    }
  };
  let financeMetric = 'revenue';
  let financeScale = 'linear';
  const financeChart = $('#financeChart');
  const financeNote = $('#financeNote');
  const financeCurrent = $('#financeCurrent');
  const financePeriod = $('#financePeriod');
  const financeFormula = $('#financeFormula');
  const financeScope = $('#financeScope');
  const financeSources = $('#financeSources');
  const financeScaleTitle = $('#financeScaleTitle');
  const financeScaleFormula = $('#financeScaleFormula');
  const financeScaleExample = $('#financeScaleExample');
  const financeScaleNote = $('#financeScaleNote');
  const financeValue = value => value.toFixed(value >= 100 ? 2 : value >= 10 ? 2 : 3).replace(/0+$/, '').replace(/\.$/, '');
  const financeWidth = (value, max, scale) => scale === 'log'
    ? Math.log10(value + 1) / Math.log10(max + 1) * 100
    : value / max * 100;

  function renderFinance() {
    if (!financeChart) return;
    const metric = financeMetrics[financeMetric];
    const present = companies.filter(company => Number.isFinite(company.values[financeMetric]?.usd));
    const available = present.map(company => company.values[financeMetric].usd);
    const max = available.length ? Math.max(...available) : 1;
    financeChart.innerHTML = companies.map(company => {
      const item = company.values[financeMetric];
      const value = item?.usd;
      const hasValue = Number.isFinite(value);
      const width = hasValue ? financeWidth(value, max, financeScale) : 0;
      return `<div class="finance-row${hasValue ? '' : ' is-missing'}">
        <div class="finance-company"><strong>${company.name}</strong><span>${company.period}</span></div>
        <div>
          <div class="finance-track" aria-hidden="true"><span class="finance-bar ${company.id}" style="width:${width}%"></span></div>
          <div class="finance-original">${item?.original ? `原披露：${item.original}` : '本页不采用不可比数值，留空不等于零'}</div>
        </div>
        <div class="finance-value">${hasValue ? financeValue(value) : '—'}<small>${hasValue ? '亿美元' : '本指标未采用'}</small></div>
      </div>`;
    }).join('');
    financeChart.setAttribute('aria-label', `${metric.label}：Anthropic、智谱、MiniMax 横向比较`);
    if (financeCurrent) financeCurrent.textContent = metric.label;
    if (financePeriod) financePeriod.textContent = metric.period;
    if (financeFormula) financeFormula.textContent = metric.formula;
    if (financeScope) financeScope.textContent = metric.scope;
    if (financeNote) financeNote.textContent = metric.note;
    if (financeSources) financeSources.innerHTML = present.map(company => `<a class="finance-source-card" href="${company.source.url}" target="_blank" rel="noreferrer"><strong>${company.name} ↗</strong><span>${company.source.title}</span><small>${company.source.detail}</small></a>`).join('');

    const sample = present.reduce((smallest, company) => company.values[financeMetric].usd < smallest.values[financeMetric].usd ? company : smallest, present[0]);
    if (sample) {
      const value = sample.values[financeMetric].usd;
      const percent = financeWidth(value, max, financeScale);
      const example = financeScale === 'log'
        ? `log10(${financeValue(value)} + 1) ÷ log10(${financeValue(max)} + 1) × 100% ≈ ${percent.toFixed(1)}%`
        : `${financeValue(value)} ÷ ${financeValue(max)} × 100% ≈ ${percent.toFixed(1)}%`;
      if (financeScaleExample) financeScaleExample.textContent = `本指标以 ${sample.name} 为例：${example}；最大值公司为 100%。`;
    } else if (financeScaleExample) financeScaleExample.textContent = '当前指标没有可用于计算条形的数值。';
    if (financeScaleTitle) financeScaleTitle.textContent = financeScale === 'log' ? '对数尺度：压缩大小数值之间的视觉差距' : '线性尺度：数值是几倍，条长就是几倍';
    if (financeScaleFormula) financeScaleFormula.textContent = financeScale === 'log' ? '条形占比 = log10（公司数值 + 1）÷ log10（最大值 + 1）× 100%' : '条形占比 = 公司数值 ÷ 同指标最大值 × 100%';
    if (financeScaleNote) financeScaleNote.textContent = present.length === 1
      ? '当前只有一家公司有数值，所以归一化后的条长为 100%，切换尺度不会改变这个相对条长。'
      : financeScale === 'log'
        ? '加 1 是为兼容小于 1 和 0 的数值；这里只改变条长，不改变右侧真实金额，也不能再用条长直接判断倍数。'
        : '适合看真实倍数；公司差距很大时，小数值的条形可能很短，请同时读右侧金额。';
  }
  $$('[data-finance-metric]').forEach(button => button.addEventListener('click', () => {
    financeMetric = button.dataset.financeMetric;
    $$('[data-finance-metric]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    renderFinance();
  }));
  $$('[data-finance-scale]').forEach(button => button.addEventListener('click', () => {
    financeScale = button.dataset.financeScale;
    $$('[data-finance-scale]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    renderFinance();
  }));
  renderFinance();

  /* Anthropic seven pieces of evidence. */
  $$('.evidence-tab').forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.evidence;
    $$('.evidence-tab').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-selected', String(item === button));
    });
    $$('.evidence-panel').forEach(panel => panel.classList.toggle('active', panel.dataset.evidencePanel === target));
  }));

  /* 02 — four mutually reinforcing loops. */
  $$('.macro-loop-node').forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.loop;
    $$('.macro-loop-node').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-selected', String(item === button));
    });
    $$('.macro-loop-detail').forEach(panel => panel.classList.toggle('active', panel.dataset.loopPanel === target));
  }));

  /* 03 — technology roadmap. Quarter zero is 2020 Q1; 27 is 2026 Q4. */
  const roadmapBars = [
    { id: 'prepost', lane: 'capability', label: '预训练与后训练', start: 0, end: 27, row: 0, detail: '从 GPT-3 的规模化预训练，到 RLHF、推理模型与强化学习后训练，能力层仍在持续演进，并没有被 Agent 系统替代。' },
    { id: 'context', lane: 'capability', label: '长上下文', start: 14, end: 27, row: 1, detail: 'Claude 100K、长文档理解与 1M 级上下文，让模型可以承接更大的任务状态；上下文长度仍不等于长任务可靠性。' },
    { id: 'moe', lane: 'capability', label: 'MoE · 稀疏注意力', start: 15, end: 27, row: 2, detail: 'Mixtral、DeepSeek-V2（MLA）等路线把能力与推理效率放在同一个设计问题里，而不是单纯堆大参数。' },
    { id: 'multimodal', lane: 'capability', label: '原生多模态', start: 15, end: 27, row: 3, detail: 'Gemini 1.0、GPT-4o 以及后续模型把文本、图像、音频和视频放进更统一的交互与推理链路。' },
    { id: 'harness', lane: 'system', label: 'Agent Harness', start: 14, end: 27, row: 0, detail: '工具调用、代码执行、环境反馈与任务验收组成执行系统。Claude Code、Dots 等产品把“回答”推进到“持续执行”。' },
    { id: 'memory', lane: 'system', label: '记忆与持续代理', start: 18, end: 27, row: 1, detail: '跨会话记忆、主动工作、云端计算机和阻塞后的替代路径，成为长程任务能否完成的关键系统能力。' },
    { id: 'open', lane: 'delivery', label: '开放权重', start: 12, end: 27, row: 0, detail: 'LLaMA 开启开放权重浪潮，DeepSeek R1 等模型进一步把推理能力、部署选择权与成本竞争带入产业。' },
    { id: 'world', lane: 'delivery', label: '世界模型 · VLA', start: 16, end: 27, row: 1, detail: 'Sora 代表的视频与世界模型方向，连接物理环境理解、仿真、机器人与自动驾驶等真实世界任务。' },
    { id: 'edge', lane: 'delivery', label: '端侧 · 云边协同', start: 18, end: 27, row: 2, detail: '手机、PC、眼镜和汽车等终端要求低时延、隐私与成本协同，模型能力开始进入离用户最近的硬件入口。' }
  ];
  const milestones = [
    { date: '2020 Q2', short: '’20Q2', pos: 1, lane: 'capability', title: 'GPT-3（1750 亿参数）', detail: '属于能力主线：规模化预训练展示了通用语言模型的能力跃迁。' },
    { date: '2022 Q4', short: '’22Q4', pos: 11, lane: 'capability', title: 'ChatGPT 上线，RLHF 引爆', detail: '属于能力（对齐）主线：后训练把底座能力转化为大众可用的产品体验。' },
    { date: '2023 Q1', short: '’23Q1', pos: 12, lane: 'capability', title: 'GPT-4 + LLaMA', detail: '能力与落地并行：闭源能力上探，开放权重路线开端。' },
    { date: '2023 Q3', short: '’23Q3', pos: 14, lane: 'capability', title: 'GPT-4V + Claude 100K', detail: '能力主线向多模态与长上下文推进。' },
    { date: '2023 Q4', short: '’23Q4', pos: 15, lane: 'capability', title: 'Gemini 1.0 + Mixtral', detail: '原生多模态与 MoE 同时成为重要技术方向。' },
    { date: '2024 Q1', short: '’24Q1', pos: 16, lane: 'delivery', title: 'Sora（世界模型）', detail: '落地主线：视频生成与世界模型开始连接物理环境理解。' },
    { date: '2024 Q2', short: '’24Q2', pos: 17, lane: 'capability', title: 'GPT-4o + DeepSeek-V2（MLA）', detail: '能力与效率并行：原生交互体验和推理效率同时改善。' },
    { date: '2025 Q1', short: '’25Q1', pos: 20, lane: 'delivery', title: 'DeepSeek R1', detail: '效率与落地：推理能力、开放权重和成本竞争相互加强。' },
    { date: '2025 Q2', short: '’25Q2', pos: 21, lane: 'system', title: 'Claude Code（Agent 执行）', detail: '系统主线：代码、终端、测试与反馈共同构成长任务执行环境。' },
    { date: '2026 Q3', short: '’26Q3', pos: 26, lane: 'system', title: 'Gemini 4 Argon + Dots', detail: '长程 Agent、1M 级上下文与长输出配置、持续在线的云上执行共同推进。Argon 于 9 月 30 日发布，Dots 于 DevDay 发布。' },
    { date: '2026 Q4', short: '’26Q4', pos: 27, lane: 'system', title: 'Kimi K3.1 Pro + Muse Wonder', detail: '按实际发布时间更新到 2026 Q4：Kimi K3.1 Pro 强化终端长任务，Muse Wonder 强化 Active Memory 与 Active Focus。' }
  ];
  const laneMeta = {
    capability: { title: '能力层', sub: '让模型更“强”' },
    system: { title: '系统层', sub: '让模型“能干完活”' },
    delivery: { title: '落地层', sub: '让模型“可用”' }
  };
  const roadmapLanes = $('#roadmapLanes');
  const milestoneTrack = $('#milestoneTrack');
  const roadmapDetail = $('#roadmapDetail');

  function showRoadmapDetail(title, detail) {
    if (!roadmapDetail) return;
    roadmapDetail.innerHTML = `<strong>${title}</strong><p>${detail}</p>`;
  }
  function renderRoadmap() {
    if (!roadmapLanes || !milestoneTrack) return;
    roadmapLanes.innerHTML = Object.entries(laneMeta).map(([lane, meta]) => {
      const bars = roadmapBars.filter(bar => bar.lane === lane).map(bar => {
        const left = bar.start / 28 * 100;
        const width = (bar.end - bar.start + 1) / 28 * 100;
        const top = 12 + bar.row * 25;
        return `<button class="roadmap-bar ${lane}" data-roadmap-bar="${bar.id}" style="left:${left}%;width:${width}%;top:${top}px" title="${bar.label}">${bar.label}</button>`;
      }).join('');
      return `<div class="roadmap-lane" data-roadmap-lane="${lane}"><div class="roadmap-lane-label"><strong>${meta.title}</strong><span>${meta.sub}</span></div><div class="roadmap-track">${bars}</div></div>`;
    }).join('');
    milestoneTrack.innerHTML = milestones.map((item, index) => `<button class="milestone-dot" data-milestone="${index}" style="left:${item.pos / 28 * 100}%" title="${item.date}｜${item.title}" aria-label="${item.date} ${item.title}"><span style="top:${index % 2 ? '31px' : '18px'};width:44px">${item.short}</span></button>`).join('');
    $$('[data-roadmap-bar]').forEach(button => button.addEventListener('click', () => {
      const bar = roadmapBars.find(item => item.id === button.dataset.roadmapBar);
      $$('[data-roadmap-bar]').forEach(item => item.classList.toggle('active', item === button));
      $$('[data-milestone]').forEach(item => item.classList.remove('active'));
      showRoadmapDetail(bar.label, bar.detail);
    }));
    $$('[data-milestone]').forEach(button => button.addEventListener('click', () => {
      const item = milestones[Number(button.dataset.milestone)];
      $$('[data-milestone]').forEach(dot => dot.classList.toggle('active', dot === button));
      $$('[data-roadmap-bar]').forEach(bar => bar.classList.remove('active'));
      showRoadmapDetail(`${item.date}｜${item.title}`, item.detail);
    }));
  }
  $$('[data-roadmap-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.roadmapFilter;
    $$('[data-roadmap-filter]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    $$('[data-roadmap-lane]').forEach(lane => lane.classList.toggle('dimmed', filter !== 'all' && lane.dataset.roadmapLane !== filter));
  }));
  renderRoadmap();
  if (milestones.length) showRoadmapDetail(`${milestones.at(-1).date}｜${milestones.at(-1).title}`, milestones.at(-1).detail);

  /* 04 — Artificial Analysis Intelligence Index v5.0 scatter. */
  const models = [
    { id: 'carbon', name: 'Gemini 4 Carbon', org: 'Google', region: 'global', open: false, score: 59, cost: 7.76, config: 'High', note: '2026-10-29 更新的 v5.0 总分第一；四项评测领先。采用标准价格，不采用 50% 上线促销价；目前仅向部分用户开放。', dx: -12, dy: -14 },
    { id: 'opus-low', name: 'Claude Opus 5.5', org: 'Anthropic', region: 'global', open: false, score: 35, cost: .98, config: 'Low', note: '同一模型的低推理配置；与 Max 配置比较，可见能力和成本同时变化。', dx: 10, dy: 20 },
    { id: 'opus-max', name: 'Claude Opus 5.5', org: 'Anthropic', region: 'global', open: false, score: 58, cost: 10.04, config: 'Max · fallback', note: 'v5.0 发布时总分第一；HLE-Diamond、FrontierCode 2.0 与 AA-Omniscience 领先。', dx: -12, dy: 22 },
    { id: 'astra', name: 'GPT-6 Astra', org: 'OpenAI', region: 'global', open: false, score: 57, cost: 6.24, config: 'Max', note: 'v5.0 发布时 Terminal-Bench-Science 与 CritPt v2 hard subset 领先；Dots 使用其作为持续代理的能力底座。', dx: 10, dy: -12 },
    { id: 'sol', name: 'GPT-6.1 Sol', org: 'OpenAI', region: 'global', open: false, score: 55, cost: 1.27, config: 'Max', note: '与 Opus 5.5 Max 相差 3 个指数点，单任务成本约为其八分之一。', dx: 10, dy: 22 },
    { id: 'terra', name: 'GPT-6.1 Terra', org: 'OpenAI', region: 'global', open: false, score: 51, cost: .96, config: 'Max', note: '进入 v5.0 前列模型中的低成本前沿，说明成本竞争并不只发生在中国模型。', dx: 10, dy: -12 },
    { id: 'fable', name: 'Claude Fable 5.1', org: 'Anthropic', region: 'global', open: false, score: 49, cost: 13.04, config: 'Max · fallback', note: '在本图前列配置中成本较高，提醒不能只看模型名而忽略推理配置与实际 Token 用量。', dx: -10, dy: 22 },
    { id: 'argon', name: 'Gemini 4 Argon', org: 'Google', region: 'global', open: false, score: 50, cost: 7.68, config: 'High · Vertex', note: 'AutomationBench-AA 在 v5.0 发布时领先；面向 1M 级上下文与长输出配置。此处采用 Artificial Analysis 英文榜单的 Vertex 标准价格口径，不混用其他服务商或 50% 促销价。', dx: 10, dy: 22 },
    { id: 'kimi', name: 'Kimi K3.1 Pro', org: 'Moonshot AI', region: 'china', open: false, score: 46, cost: 3.68, config: 'Default', note: '中国模型中总分最高；Terminal-Bench 4.0 为 67%，v5.0 发布时权重尚未发布。', dx: 10, dy: -12 },
    { id: 'muse', name: 'Muse Wonder', org: 'Meta', region: 'global', open: false, score: 43, cost: 6.95, config: 'Max', note: '以 Active Memory、Active Focus 推进跨会话持续工作；Wonder Full 是不同配置，v5.0 为 50 分，且暂无可比任务成本，未混入此散点。', dx: 10, dy: -12 },
    { id: 'glm', name: 'GLM-5.3', org: '智谱 / Z.ai', region: 'china', open: true, score: 32, cost: 5.01, config: 'Max', note: '已发布开放权重；与 DeepSeek V4.1 Flash 1017 在 v5.0 同为 32 分，但任务成本不同。', dx: 10, dy: -12 },
    { id: 'deepseek', name: 'DeepSeek V4.1 Flash 1017', org: 'DeepSeek', region: 'china', open: true, score: 32, cost: .60, config: 'Max', note: '已发布开放权重；以较低成本进入本图成本前沿。', dx: 10, dy: -12 },
    { id: 'minimax', name: 'MiniMax M3.1 Flash', org: 'MiniMax', region: 'china', open: true, score: 29, cost: .49, config: 'Default', note: '高频、低成本方向的代表点。权重已于 2026-10-23 发布，采用 MiniMax Community License，不等同于 OSI 开源；旗舰与 Flash 应按任务价值分层。', dx: 10, dy: 20 }
  ];
  const scatter = $('#costScatter');
  const modelDetail = $('#costModelDetail');
  const modelSelect = $('#costModelSelect');
  let costFilter = 'all';
  let selectedModel = 'kimi';
  const svgNS = 'http://www.w3.org/2000/svg';
  const makeSvg = (tag, attrs = {}, text = '') => {
    const element = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    if (text) element.textContent = text;
    return element;
  };

  function showCostModel(id) {
    const model = models.find(item => item.id === id);
    if (!model || !modelDetail) return;
    modelDetail.innerHTML = `<span>${model.org} · ${model.region === 'china' ? '中国模型' : '海外模型'}</span>
      <h6>${model.name}</h6>
      <div class="model-detail-metrics"><div><strong>${model.score}</strong><span>智能指数 v5.0</span></div><div><strong>$${model.cost.toFixed(2)}</strong><span>每个指数任务成本</span></div></div>
      <p><strong>配置：</strong>${model.config}<br><strong>开放权重：</strong>${model.open ? '已发布' : '否 / 截至 v5.0 发布时尚未发布'}<br>${model.note}</p>`;
    if (modelSelect) modelSelect.value = id;
  }
  function visibleModels() {
    return models.filter(model => costFilter === 'all' || (costFilter === 'open' ? model.open : model.region === costFilter));
  }
  function renderScatter() {
    if (!scatter) return;
    const visible = visibleModels();
    if (!visible.some(model => model.id === selectedModel) && visible.length) selectedModel = visible[0].id;
    scatter.innerHTML = '';
    const W = 860, H = 480, left = 64, right = 22, top = 24, bottom = 58;
    const plotW = W - left - right, plotH = H - top - bottom;
    const xMin = Math.log10(.4), xMax = Math.log10(15);
    const x = value => left + (Math.log10(value) - xMin) / (xMax - xMin) * plotW;
    const y = value => top + (60 - value) / 40 * plotH;
    scatter.appendChild(makeSvg('rect', { x: x(.4), y: y(60), width: x(2) - x(.4), height: y(50) - y(60), class: 'quadrant' }));
    [20, 30, 40, 50, 60].forEach(tick => {
      scatter.appendChild(makeSvg('line', { x1: left, y1: y(tick), x2: W - right, y2: y(tick), class: 'grid-line' }));
      scatter.appendChild(makeSvg('text', { x: left - 12, y: y(tick) + 4, 'text-anchor': 'end', class: 'axis-label' }, String(tick)));
    });
    [.5, 1, 2, 5, 10].forEach(tick => {
      scatter.appendChild(makeSvg('line', { x1: x(tick), y1: top, x2: x(tick), y2: H - bottom, class: 'grid-line' }));
      scatter.appendChild(makeSvg('text', { x: x(tick), y: H - bottom + 23, 'text-anchor': 'middle', class: 'axis-label' }, `$${tick}`));
    });
    scatter.appendChild(makeSvg('text', { x: 16, y: top + plotH / 2, transform: `rotate(-90 16 ${top + plotH / 2})`, 'text-anchor': 'middle', class: 'axis-label' }, '智能指数（分）'));
    scatter.appendChild(makeSvg('text', { x: left + plotW / 2, y: H - 8, 'text-anchor': 'middle', class: 'axis-label' }, '每个 Intelligence Index 任务成本（美元，对数轴）'));
    scatter.appendChild(makeSvg('text', { x: x(.46), y: y(58), class: 'axis-label' }, '更有吸引力：能力高、成本低'));

    const frontier = [];
    let best = -Infinity;
    [...visible].sort((a, b) => a.cost - b.cost).forEach(model => {
      if (model.score > best) { frontier.push(model); best = model.score; }
    });
    if (frontier.length > 1) {
      const path = frontier.map((model, index) => `${index ? 'L' : 'M'} ${x(model.cost)} ${y(model.score)}`).join(' ');
      scatter.appendChild(makeSvg('path', { d: path, class: 'frontier-path' }));
    }
    visible.forEach(model => {
      const point = makeSvg('circle', {
        cx: x(model.cost), cy: y(model.score), r: model.id === selectedModel ? 8 : 6,
        fill: model.region === 'china' ? '#0f7b6c' : '#537f90',
        class: `model-point${model.id === selectedModel ? ' active' : ''}`,
        tabindex: '0', role: 'button', 'aria-label': `${model.name}，${model.score} 分，每任务 ${model.cost} 美元`
      });
      point.appendChild(makeSvg('title', {}, `${model.name}｜${model.score} 分｜$${model.cost.toFixed(2)}`));
      const select = () => { selectedModel = model.id; renderScatter(); showCostModel(model.id); };
      point.addEventListener('click', select);
      point.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); } });
      scatter.appendChild(point);
      if (model.id === selectedModel) {
        const anchor = model.dx < 0 ? 'end' : 'start';
        scatter.appendChild(makeSvg('text', { x: x(model.cost) + model.dx, y: y(model.score) + model.dy, 'text-anchor': anchor, class: 'point-label' }, model.name));
      }
    });
    showCostModel(selectedModel);
  }
  if (modelSelect) {
    modelSelect.innerHTML = models.map(model => `<option value="${model.id}">${model.name} · ${model.config}</option>`).join('');
    modelSelect.addEventListener('change', () => {
      selectedModel = modelSelect.value;
      costFilter = 'all';
      $$('[data-cost-filter]').forEach(button => button.classList.toggle('active', button.dataset.costFilter === 'all'));
      renderScatter();
    });
  }
  $$('[data-cost-filter]').forEach(button => button.addEventListener('click', () => {
    costFilter = button.dataset.costFilter;
    $$('[data-cost-filter]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    renderScatter();
  }));
  renderScatter();

  /* 05 — application cards: concise plain-language content on demand. */
  const applications = {
    coding: {
      title: 'Coding / 软件工程',
      why: '开发任务高频，测试、编译和运行结果能自动判对错，企业也愿意为提效付费。',
      blocker: '大型仓库上下文、代码安全、审查责任与团队交付瓶颈。',
      metric: '端到端验收率、审查时间、返工率、每个成功任务的成本。'
    },
    knowledge: {
      title: '通用知识工作',
      why: '文档、研究、表格、演示和跨 SaaS 自动化都能覆盖，潜在工作量大。',
      blocker: '数据权限、事实可靠性，以及跨系统流程能否真正接通。',
      metric: '完整任务交付率、活跃与留存、权限事故、单席位扩量。'
    },
    security: {
      title: '网络安全',
      why: '漏洞发现、验证和修复价值高，部分结果可以自动验证。',
      blocker: '双重用途、误报、权限与审计，不能只看“找到了多少漏洞”。',
      metric: '真实漏洞确认率、误报与漏报、修复成功率、受控开放合规。'
    },
    professional: {
      title: '法律 / 金融 / 税务',
      why: '专业人力贵，规则和交付格式相对明确，做好后价值容易算清。',
      blocker: '幻觉、引用有效性、保密、牌照与责任边界。',
      metric: '引用可核验率、专家复核时间、严重错误、责任边界。'
    },
    marketing: {
      title: '营销与内容生成',
      why: '能压低文案、图像和视频成本，并提高素材测试频率。',
      blocker: '内容同质化、版权、品牌一致性与平台政策。',
      metric: '单次合格素材成本、转化提升、版权事故、客户留存。'
    },
    education: {
      title: '教育',
      why: '个性化解释、练习和反馈需求广，能覆盖传统师资难规模化服务的人群。',
      blocker: '学习效果难归因、依赖性、未成年人保护与付费分化。',
      metric: '学习结果、持续使用、教师节省时间、付费与安全指标。'
    },
    service: {
      title: '客服与销售',
      why: '标准流程高频，可连接 CRM、工单和质检体系，价值容易进入现有流程。',
      blocker: '复杂问题升级、数据质量和品牌风险。',
      metric: '独立解决率、升级率、客户满意度、单次解决成本。'
    },
    hardware: {
      title: '智能硬件与个人助手',
      why: '低时延、个性化和跨应用执行，可能形成离用户更近的新入口。',
      blocker: '隐私、权限、硬件成本与生态协同。',
      metric: '日常活跃、跨应用任务成功率、留存、单用户全成本。'
    },
    robotics: {
      title: '智驾与机器人',
      why: '物理任务自动化价值大，仿真有机会降低训练和测试成本。',
      blocker: '安全、实时性、真实数据、Sim2Real、硬件与监管。',
      metric: '闭环动作成功率、异常恢复、尾延迟、真实环境里程或任务量。'
    }
  };
  const applicationDetail = $('#applicationDetail');
  $$('.application-card').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.application;
    const wasActive = button.classList.contains('active');
    $$('.application-card').forEach(card => {
      card.classList.remove('active');
      card.setAttribute('aria-expanded', 'false');
    });
    if (wasActive) {
      applicationDetail.hidden = true;
      applicationDetail.innerHTML = '';
      return;
    }
    const item = applications[id];
    button.classList.add('active');
    button.setAttribute('aria-expanded', 'true');
    applicationDetail.innerHTML = `<div class="application-detail-head"><h5>${item.title}</h5><button type="button" id="closeApplication">收起 ×</button></div>
      <div class="application-detail-grid"><div><span>为什么可能成立</span><p>${item.why}</p></div><div><span>当前主要卡点</span><p>${item.blocker}</p></div><div><span>最该验证的指标</span><p>${item.metric}</p></div></div>
      <div class="application-detail-metric">判断顺序：<strong>先看任务是否真能完成，再看客户是否持续付钱，最后看每一次成功交付能否留下毛利。</strong></div>`;
    applicationDetail.hidden = false;
    $('#closeApplication')?.addEventListener('click', () => {
      applicationDetail.hidden = true;
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    });
  }));
})();
