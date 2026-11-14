/* =========================================================
   Painel de Ajuste — Vitrine de Projetos
   dev-panel.js

   Funcionalidades:
   - Lê/escreve CSS variables em tempo real
   - Mostra medições em px de cada peça (live)
   - Gera snippet CSS pronto para colar
   - Toggle para recolher/expandir painel
   ========================================================= */

(function () {
    'use strict';

    /* ---------- 1. Definição dos controles ----------
       Cada controle = { id, label, var, min, max, step, unit, default }
       Os defaults são lidos do :root em runtime. */
    const controls = [
        // DESTAQUE
        { group: 'DESTAQUE', id: 'highlight-height', label: 'Altura', var: '--vitrine-highlight-height', min: 200, max: 700, step: 10, unit: 'px', def: 480 },
        { group: 'DESTAQUE', id: 'highlight-radius', label: 'Borda', var: '--vitrine-border-radius', min: 0, max: 32, step: 2, unit: 'px', def: 16 },

        // CARDS
        { group: 'CARDS', id: 'card-width', label: 'Largura', var: '--vitrine-card-width', min: 100, max: 280, step: 10, unit: 'px', def: 180 },
        { group: 'CARDS', id: 'card-height', label: 'Altura', var: '--vitrine-card-height', min: 60, max: 400, step: 10, unit: 'px', def: 250 },
        { group: 'CARDS', id: 'card-gap', label: 'Espaço', var: '--vitrine-card-gap', min: 4, max: 32, step: 2, unit: 'px', def: 12 },
        { group: 'CARDS', id: 'card-radius', label: 'Borda', var: '--vitrine-card-border-radius', min: 0, max: 24, step: 2, unit: 'px', def: 12 },

        // HOVER
        { group: 'HOVER', id: 'hover-opacity', label: 'Opacidade', var: '--vitrine-card-hover-opacity', min: 0.1, max: 1, step: 0.05, unit: '', def: 0.5 },
        { group: 'HOVER', id: 'hover-scale', label: 'Zoom', var: '--vitrine-card-hover-scale', min: 1, max: 1.2, step: 0.02, unit: '', def: 1.08 },
        { group: 'HOVER', id: 'hover-lift', label: 'Elevação', var: '--vitrine-card-hover-lift', min: 0, max: 12, step: 1, unit: 'px', def: 4 },

        // ANIMAÇÕES
        { group: 'ANIMAÇÃO', id: 'anim-speed', label: 'Velocidade', var: '--vitrine-animation-duration', min: 0.1, max: 1, step: 0.05, unit: 's', def: 0.3 },

        // CORES
        { group: 'CORES', id: 'color-primary', label: 'Primária', var: '--vitrine-primary', type: 'color', def: '#3b82f6' },
        { group: 'CORES', id: 'color-bg', label: 'Fundo', var: '--vitrine-bg', type: 'color', def: '#0f172a' },
        { group: 'CORES', id: 'color-card-bg', label: 'Card BG', var: '--vitrine-card-bg', type: 'color', def: '#1e293b' }
    ];

    /* ---------- 2. Lê valor atual de uma variável CSS ---------- */
    function getCssVar(varName) {
        const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        if (!raw) return null;

        // Tenta converter para número
        const num = parseFloat(raw);
        if (!isNaN(num)) return num;

        // Retorna como string (cores)
        return raw;
    }

    /* ---------- 3. Aplica valor a uma variável CSS ---------- */
    function applyVar(varName, value, unit) {
        const finalValue = unit !== undefined && unit !== '' ? value + unit : value;
        document.documentElement.style.setProperty(varName, finalValue);
        updateMeasures();
        updateSnippet();
    }

    /* ---------- 4. Constrói o DOM do painel ---------- */
    function buildPanel() {
        const panel = document.createElement('div');
        panel.className = 'dev-panel';
        panel.innerHTML = `
            <div class="dev-panel__header">
                <h3 class="dev-panel__title">DEV — AJUSTES</h3>
                <div style="display:flex;gap:6px;">
                    <button class="dev-panel__toggle" id="devReset" title="Restaurar valores padrão">RESET</button>
                    <button class="dev-panel__toggle" id="devToggle">RECOLHER</button>
                </div>
            </div>
            <div class="dev-panel__body">
                ${buildGroups()}
                <div class="dev-measures" id="devMeasures">
                    <h4 class="dev-measures__title">MEDIÇÕES (px)</h4>
                    <div id="devMeasuresContent"></div>
                </div>
                <div class="dev-snippet">
                    <h4 class="dev-snippet__title">
                        <span>SNIPPET CSS</span>
                        <button class="dev-snippet__copy" id="devCopy">COPIAR</button>
                    </h4>
                    <pre id="devSnippet"></pre>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        document.body.classList.add('has-panel');

        // Botão flutuante (caso queira ocultar totalmente)
        const fab = document.createElement('button');
        fab.className = 'dev-panel-fab';
        fab.textContent = 'DEV';
        fab.title = 'Mostrar painel de ajustes';
        fab.addEventListener('click', () => {
            panel.style.display = 'block';
            fab.style.display = 'none';
        });
        document.body.appendChild(fab);

        // Quando ?panel=on mas usuário clica em "fechar painel" via fab,
        // o painel volta a aparecer; aqui apenas garantimos estado inicial
        // com painel visível e fab oculto.
        fab.style.display = 'none';
        panel.style.display = '';

        return panel;
    }

    /* ---------- 5. Constrói os grupos de controles ---------- */
    function buildGroups() {
        const groups = {};
        controls.forEach(c => {
            if (!groups[c.group]) groups[c.group] = [];
            groups[c.group].push(c);
        });

        return Object.entries(groups).map(([name, list]) => `
            <div class="dev-group">
                <h4 class="dev-group__title">${name}</h4>
                ${list.map(c => buildRow(c)).join('')}
            </div>
        `).join('');
    }

    /* ---------- 6. Constrói uma linha de controle ---------- */
    function buildRow(c) {
        const currentValue = getCssVar(c.var) ?? c.def;
        const displayValue = c.type === 'color' ? '' : formatValue(currentValue, c.unit);

        if (c.type === 'color') {
            return `
                <div class="dev-row dev-row--color">
                    <label class="dev-row__label" for="${c.id}">${c.label}</label>
                    <input type="color" id="${c.id}" value="${currentValue}">
                    <span class="dev-row__value" id="${c.id}-val">${currentValue}</span>
                </div>
            `;
        }

        return `
            <div class="dev-row">
                <label class="dev-row__label" for="${c.id}">${c.label}</label>
                <input type="range" id="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${currentValue}">
                <span class="dev-row__value" id="${c.id}-val">${displayValue}</span>
            </div>
        `;
    }

    function formatValue(value, unit) {
        if (unit === '%') return value + '%';
        if (unit === 'px') return value + 'px';
        if (unit === 's') return value + 's';
        if (unit === 'vh') return value + 'vh';
        return value;
    }

    /* ---------- 7. Vincula eventos dos controles ---------- */
    function bindControls() {
        controls.forEach(c => {
            const input = document.getElementById(c.id);
            const valEl = document.getElementById(c.id + '-val');
            if (!input) return;

            if (c.type === 'color') {
                // Cor
                input.addEventListener('input', () => {
                    applyVar(c.var, input.value, '');
                    valEl.textContent = input.value;
                });
            } else {
                // Slider numérico
                const initialValue = parseFloat(input.value);
                applyVar(c.var, initialValue, c.unit);
                valEl.textContent = formatValue(initialValue, c.unit);

                input.addEventListener('input', () => {
                    const v = parseFloat(input.value);
                    applyVar(c.var, v, c.unit);
                    valEl.textContent = formatValue(v, c.unit);
                });
            }
        });
    }

    /* ---------- 8. Atualiza medições em px (live) ---------- */
    function updateMeasures() {
        const highlight = document.querySelector('.vitrine__highlight');
        const cards = document.querySelectorAll('.vitrine__card');
        if (!highlight || !cards.length) return;

        const hlBox = highlight.getBoundingClientRect();
        const cardBox = cards[0].getBoundingClientRect();
        const cardsContainer = document.querySelector('.vitrine__cards');
        const containerBox = cardsContainer.getBoundingClientRect();

        const html = `
            <div class="dev-measures__line">
                <span>Destaque</span>
                <span>${Math.round(hlBox.width)}×${Math.round(hlBox.height)}px</span>
            </div>
            <div class="dev-measures__line">
                <span>Cards</span>
                <span>${cards.length} cards visíveis</span>
            </div>
            <div class="dev-measures__line">
                <span>Card único</span>
                <span>${Math.round(cardBox.width)}×${Math.round(cardBox.height)}px</span>
            </div>
            <div class="dev-measures__line">
                <span>Container</span>
                <span>${Math.round(containerBox.width)}px largura</span>
            </div>
            <div class="dev-measures__line">
                <span>Cards cabem</span>
                <span>≈${Math.floor(containerBox.width / (cardBox.width + 12))} de ${cards.length}</span>
            </div>
        `;
        document.getElementById('devMeasuresContent').innerHTML = html;
    }

    /* ---------- 9. Gera snippet CSS ---------- */
    function updateSnippet() {
        const lines = [
            `/* Copie este bloco para o :root do style.css */`,
            ``,
            `:root {`,
        ];

        // Agrupa por categoria
        const categories = {
            'DESTAQUE': [],
            'CARDS': [],
            'HOVER': [],
            'ANIMAÇÃO': [],
            'CORES': []
        };

        controls.forEach(c => {
            const value = getCssVar(c.var);
            if (value !== null) {
                const formattedValue = c.type === 'color' ? value : value + (c.unit || '');
                categories[c.group].push(`    ${c.var}: ${formattedValue};`);
            }
        });

        // Adiciona categorias não vazias
        if (categories['DESTAQUE'].length) {
            lines.push(`    /* Destaque */`);
            lines.push(...categories['DESTAQUE']);
            lines.push(``);
        }
        if (categories['CARDS'].length) {
            lines.push(`    /* Cards */`);
            lines.push(...categories['CARDS']);
            lines.push(``);
        }
        if (categories['HOVER'].length) {
            lines.push(`    /* Hover */`);
            lines.push(...categories['HOVER']);
            lines.push(``);
        }
        if (categories['ANIMAÇÃO'].length) {
            lines.push(`    /* Animação */`);
            lines.push(...categories['ANIMAÇÃO']);
            lines.push(``);
        }
        if (categories['CORES'].length) {
            lines.push(`    /* Cores */`);
            lines.push(...categories['CORES']);
            lines.push(``);
        }

        lines.push(`}`);

        document.getElementById('devSnippet').textContent = lines.join('\n');
    }

    /* ---------- 10. Botão de copiar ---------- */
    function bindCopy() {
        const btn = document.getElementById('devCopy');
        btn.addEventListener('click', () => {
            const text = document.getElementById('devSnippet').textContent;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = 'COPIADO!';
                setTimeout(() => btn.textContent = 'COPIAR', 1200);
            });
        });
    }

    /* ---------- 11. Toggle do painel ---------- */
    function bindToggle() {
        const btn = document.getElementById('devToggle');
        const panel = document.querySelector('.dev-panel');
        btn.addEventListener('click', () => {
            panel.classList.toggle('is-collapsed');
            btn.textContent = panel.classList.contains('is-collapsed') ? 'EXPANDIR' : 'RECOLHER';
        });
    }

    /* ---------- 12. Reset para valores padrão ---------- */
    function bindReset() {
        const btn = document.getElementById('devReset');
        if (!btn) return;

        btn.addEventListener('click', () => {
            controls.forEach(c => {
                // Remove a variável do estilo inline
                document.documentElement.style.removeProperty(c.var);

                // Atualiza o input
                const input = document.getElementById(c.id);
                const valEl = document.getElementById(c.id + '-val');
                if (!input) return;

                if (c.type === 'color') {
                    input.value = c.def;
                    valEl.textContent = c.def;
                } else {
                    input.value = c.def;
                    valEl.textContent = formatValue(c.def, c.unit);
                }
            });

            updateMeasures();
            updateSnippet();

            btn.textContent = 'OK!';
            setTimeout(() => btn.textContent = 'RESET', 1000);
        });
    }

    /* ---------- 13. Init ---------- */
    function init() {
        // Atalho: ?panel=off esconde (padrão), ?panel=on mostra
        const params = new URLSearchParams(location.search);
        const showPanel = params.get('panel') === 'on';

        if (!showPanel) {
            // Painel oculto: só cria o botão flutuante para reabrir
            const fab = document.createElement('button');
            fab.className = 'dev-panel-fab';
            fab.textContent = 'DEV';
            fab.title = 'Mostrar painel de ajustes (use ?panel=on para abrir direto)';
            fab.addEventListener('click', () => {
                location.search = '?panel=on';
                location.reload();
            });
            document.body.appendChild(fab);
            document.body.classList.add('has-panel');
            return;
        }

        buildPanel();
        bindControls();
        bindCopy();
        bindToggle();
        bindReset();

        // Recalcular medidas ao redimensionar
        window.addEventListener('resize', updateMeasures);

        // Medições iniciais após renderização
        requestAnimationFrame(() => {
            updateMeasures();
            updateSnippet();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
