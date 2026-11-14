/* =========================================================
   Painel de ajuste (DEV ONLY)
   dev-panel.js
   =========================================================
   - Lê/escreve CSS variables em tempo real
   - Mostra medições em px de cada peça (live)
   - Gera snippet CSS pronto para colar
   - Toggle: criar localStorage flag ou remover para produção
   ========================================================= */

(function () {
    'use strict';

    /* ---------- 1. Definição dos controles ----------
       Cada controle = { id, label, var, min, max, step, unit, default }
       Os defaults são lidos do :root em runtime (ver syncDefaults). */
    const controls = [
        // MAIN (aspect ratio controlado por dois sliders)
        { group: 'MAIN', id: 'main-ratio-w', label: 'Ratio W',  var: '--main-aspect-w', min: 1, max: 21, step: 1, def: 7 },
        { group: 'MAIN', id: 'main-ratio-h', label: 'Ratio H',  var: '--main-aspect-h', min: 1, max: 21, step: 1, def: 5 },

        // SECONDARY
        { group: 'SECONDARY', id: 'sec-w',  label: 'Width',  var: '--secondary-width',  min: -50, max: 110, step: 1, unit: '%', def: 55 },
        { group: 'SECONDARY', id: 'sec-h',  label: 'Height', var: '--secondary-height', min: -50, max: 110, step: 1, unit: '%', def: 54 },
        { group: 'SECONDARY', id: 'sec-t',  label: 'Top',    var: '--secondary-top',    min: -50, max: 110, step: 1, unit: '%', def: 91 },
        { group: 'SECONDARY', id: 'sec-r',  label: 'Right',  var: '--secondary-right',  min: -50, max: 110, step: 1, unit: '%', def: 32 },
        { group: 'SECONDARY', id: 'sec-b',  label: 'Bottom', var: '--secondary-bottom', min: -50, max: 110, step: 1, unit: '%', def: -41 },
        { group: 'SECONDARY', id: 'sec-l',  label: 'Left',   var: '--secondary-left',   min: -50, max: 110, step: 1, unit: '%', def: -13 },

        // TERTIARY
        { group: 'TERTIARY', id: 'ter-w',  label: 'Width',  var: '--tertiary-width',  min: -50, max: 110, step: 1, unit: '%', def: 40 },
        { group: 'TERTIARY', id: 'ter-h',  label: 'Height', var: '--tertiary-height', min: -50, max: 110, step: 1, unit: '%', def: 51 },
        { group: 'TERTIARY', id: 'ter-t',  label: 'Top',    var: '--tertiary-top',    min: -50, max: 110, step: 1, unit: '%', def: 80 },
        { group: 'TERTIARY', id: 'ter-r',  label: 'Right',  var: '--tertiary-right',  min: -50, max: 110, step: 1, unit: '%', def: 4 },
        { group: 'TERTIARY', id: 'ter-b',  label: 'Bottom', var: '--tertiary-bottom', min: -50, max: 110, step: 1, unit: '%', def: -6 },
        { group: 'TERTIARY', id: 'ter-l',  label: 'Left',   var: '--tertiary-left',   min: -50, max: 110, step: 1, unit: '%', def: 50 },

        // MOSAICO
        { group: 'MOSAICO', id: 'mq-h',  label: 'Height', var: '--marquee-height', min: 30, max: 100, step: 1, unit: 'vh', def: 51 },
        { group: 'MOSAICO', id: 'mq-s',  label: 'Speed',  var: '--marquee-speed',  min: 10, max: 200, step: 1, unit: 's', def: 101 },
        { group: 'MOSAICO', id: 'mq-g',  label: 'Gap',    var: '--marquee-gap',    min: 0,  max: 40,  step: 1, unit: 'px', def: 6 }
    ];

    /* ---------- 2. Inicializa CSS variables a partir dos defaults ---------- */
    // Defaults do aspect ratio são lidos do :root (definido no style.css)
    function getRootAspectDefault() {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--main-aspect').trim();
        // tenta "7 / 5", "4/5", "4 / 5", etc.
        const m = raw.match(/(\d+)\s*\/\s*(\d+)/);
        return m ? { w: parseInt(m[1], 10), h: parseInt(m[2], 10) } : { w: 4, h: 5 };
    }

    function syncAspectRatio() {
        // Só compõe --main-aspect se o usuário realmente moveu um dos sliders.
        // Caso contrário, deixa o valor do :root do CSS prevalecer.
        const wEl = document.documentElement.style.getPropertyValue('--main-aspect-w');
        const hEl = document.documentElement.style.getPropertyValue('--main-aspect-h');
        if (wEl === '' || hEl === '') return; // usuário não mexeu — usa :root
        document.documentElement.style.setProperty('--main-aspect', `${parseFloat(wEl)} / ${parseFloat(hEl)}`);
    }

    function currentValue(varName) {
        const raw = document.documentElement.style.getPropertyValue(varName);
        if (!raw) return null;
        const num = parseFloat(raw);
        return isNaN(num) ? null : num;
    }

    function applyControl(c, value) {
        if (c.var === '--main-aspect-w' || c.var === '--main-aspect-h') {
            document.documentElement.style.setProperty(c.var, value);
            syncAspectRatio();
        } else {
            document.documentElement.style.setProperty(c.var, value + (c.unit || ''));
        }
        updateMeasures();
    }

    /* ---------- 3. Construção do DOM do painel ---------- */
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
                <div id="devMirrorContainer">${buildMirrorControls()}</div>
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

        // Quando ?panel=on, painel inicia visível; fab fica disponível
        // para o usuário recolher manualmente.
        fab.style.display = 'none';

        return panel;
    }

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

    function buildRow(c) {
        // Para aspect ratio, lê o default real do :root; demais usa c.def
        let initialValue;
        if (c.var === '--main-aspect-w') initialValue = getRootAspectDefault().w;
        else if (c.var === '--main-aspect-h') initialValue = getRootAspectDefault().h;
        else initialValue = c.def !== null ? c.def : (c.min + c.max) / 2;

        const display = (c.var === '--main-aspect-w' || c.var === '--main-aspect-h')
            ? initialValue
            : (c.def !== null ? c.def + (c.unit || '') : 'auto');

        return `
            <div class="dev-row">
                <label class="dev-row__label" for="${c.id}">${c.label}</label>
                <input type="range" id="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${initialValue}">
                <span class="dev-row__value" id="${c.id}-val">${display}</span>
            </div>
        `;
    }

    /* ---------- 4. Eventos dos sliders ---------- */
    function bindControls() {
        controls.forEach(c => {
            const input = document.getElementById(c.id);
            const valEl = document.getElementById(c.id + '-val');
            if (!input) return;

            // Para controles com default null (significa "não aplico essa posição"),
            // só aplico se o usuário MEXER no slider.
            const initialValue = parseFloat(input.value);
            if (c.def !== null) {
                applyControl(c, initialValue);
                valEl.textContent = initialValue + (c.unit || '');
            } else {
                valEl.textContent = 'auto';
            }

            input.addEventListener('input', () => {
                const v = parseFloat(input.value);
                applyControl(c, v);
                valEl.textContent = v + (c.unit || '');
            });
        });
    }

    /* ---------- 5. Medições em px (live) ---------- */
    function updateMeasures() {
        const work = document.querySelector('.work');
        if (!work) return;

        const main      = work.querySelector('.work__img--main');
        const secondary = work.querySelector('.work__img--secondary');
        const tertiary  = work.querySelector('.work__img--tertiary');
        const media     = work.querySelector('.work__media');

        if (!main || !secondary || !tertiary || !media) return;

        // Usar offsets相对于 o container pai (.work__media)
        const mdBox = media.getBoundingClientRect();
        const sBox  = secondary.getBoundingClientRect();
        const tBox  = tertiary.getBoundingClientRect();

        // overflow = posição absoluta da peça relativa às bordas do container
        const secOverflowL = Math.round(sBox.left - mdBox.left);
        const secOverflowR = Math.round(mdBox.right - sBox.right);
        const secOverflowT = Math.round(sBox.top - mdBox.top);
        const secOverflowB = Math.round(mdBox.bottom - sBox.bottom);

        const terOverflowL = Math.round(tBox.left - mdBox.left);
        const terOverflowR = Math.round(mdBox.right - tBox.right);
        const terOverflowT = Math.round(tBox.top - mdBox.top);
        const terOverflowB = Math.round(mdBox.bottom - tBox.bottom);

        const m  = rect(main);
        const s  = rect(secondary);
        const t  = rect(tertiary);
        const md = rect(media);

        const html = `
            <div class="dev-measures__line"><span>media</span><span>${md.w}×${md.h}px</span></div>
            <div class="dev-measures__line"><span>main</span><span>${m.w}×${m.h}px</span></div>
            <div class="dev-measures__line"><span>secondary</span><span>${s.w}×${s.h}px</span></div>
            <div class="dev-measures__line"><span>sec overflow</span><span>L${signed(secOverflowL)} T${signed(secOverflowT)} R${signed(secOverflowR)} B${signed(secOverflowB)}</span></div>
            <div class="dev-measures__line"><span>tertiary</span><span>${t.w}×${t.h}px</span></div>
            <div class="dev-measures__line"><span>ter overflow</span><span>L${signed(terOverflowL)} T${signed(terOverflowT)} R${signed(terOverflowR)} B${signed(terOverflowB)}</span></div>
        `;
        document.getElementById('devMeasuresContent').innerHTML = html;

        updateSnippet();
    }

    function signed(n) {
        // valores negativos = vaza para fora
        return (n > 0 ? '+' : '') + n;
    }

    function rect(el) {
        const r = el.getBoundingClientRect();
        return {
            top: Math.round(r.top), bottom: Math.round(r.bottom),
            left: Math.round(r.left), right: Math.round(r.right),
            w: Math.round(r.width), h: Math.round(r.height)
        };
    }

    /* ---------- 5b. Espelhamento por projeto ---------- */
    function buildMirrorControls() {
        const works = document.querySelectorAll('.work');
        if (!works.length) return '';

        return `
            <div class="dev-group">
                <h4 class="dev-group__title">PROJETOS (espelhar)</h4>
                ${Array.from(works).map((w, i) => `
                    <div class="dev-row">
                        <label class="dev-row__label">Proj ${i + 1}</label>
                        <button class="dev-mirror-btn" data-work="${i}">ESPELHAR</button>
                        <span class="dev-row__value" id="mirror-status-${i}">normal</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function bindMirrorControls() {
        const works = document.querySelectorAll('.work');
        works.forEach((w, i) => {
            const btn = document.querySelector(`.dev-mirror-btn[data-work="${i}"]`);
            const status = document.getElementById(`mirror-status-${i}`);
            if (!btn || !status) return;

            btn.addEventListener('click', () => {
                w.classList.toggle('is-mirrored');
                const mirrored = w.classList.contains('is-mirrored');
                btn.textContent = mirrored ? 'RESTAURAR' : 'ESPELHAR';
                status.textContent = mirrored ? 'espelhado' : 'normal';
                updateMeasures();
            });
        });
    }
    function updateSnippet() {
        const aspect = document.documentElement.style.getPropertyValue('--main-aspect') || '4 / 5';
        const mirrored = Array.from(document.querySelectorAll('.work.is-mirrored'))
            .map((_, i) => i + 1);

        const lines = [
            `/* Copie este bloco para o :root do style.css */`,
            ``,
            `--main-aspect: ${aspect};`,
            ``,
            `/* Secondary */`,
            optLine('--secondary-width',  '%'),
            optLine('--secondary-height', '%'),
            optLine('--secondary-top',    '%'),
            optLine('--secondary-right',  '%'),
            optLine('--secondary-bottom', '%'),
            optLine('--secondary-left',   '%'),
            ``,
            `/* Tertiary */`,
            optLine('--tertiary-width',  '%'),
            optLine('--tertiary-height', '%'),
            optLine('--tertiary-top',    '%'),
            optLine('--tertiary-right',  '%'),
            optLine('--tertiary-bottom', '%'),
            optLine('--tertiary-left',   '%'),
            ``,
            `/* Mosaico */`,
            optLine('--marquee-height', 'vh'),
            optLine('--marquee-speed',  's'),
            optLine('--marquee-gap',    'px')
        ];

        if (mirrored.length) {
            lines.push(``, `/* Espelhamento */`);
            mirrored.forEach(i => lines.push(`.work:nth-child(${i}) .work__media { /* espelhado horizontalmente */ }`));
            lines.push(`/* No CSS real, copie o bloco .work.is-mirrored .work__img--secondary/--tertiary */`);
        }

        document.getElementById('devSnippet').textContent = lines.join('\n');
    }

    function optLine(varName, unit) {
        const v = document.documentElement.style.getPropertyValue(varName);
        return v ? `${varName}: ${v};` : `${varName}: /* mantém default */;`;
    }

    /* ---------- 7. Botão de copiar ---------- */
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

    /* ---------- 8. Toggle do painel ---------- */
    function bindToggle() {
        const btn = document.getElementById('devToggle');
        const panel = document.querySelector('.dev-panel');
        btn.addEventListener('click', () => {
            panel.classList.toggle('is-collapsed');
            btn.textContent = panel.classList.contains('is-collapsed') ? 'EXPANDIR' : 'RECOLHER';
        });
    }

    /* ---------- 8b. Reset para valores padrão ---------- */
    function bindReset() {
        const btn = document.getElementById('devReset');
        if (!btn) return;

        btn.addEventListener('click', () => {
            // Remove todas as variáveis CSS injetadas em documentElement.style
            // para que os valores do :root do style.css voltem a valer.
            const allVars = controls.flatMap(c => [c.var]);
            // também remove --main-aspect-w / --main-aspect-h / --main-aspect se existirem
            allVars.push('--main-aspect-w', '--main-aspect-h', '--main-aspect');
            allVars.forEach(v => document.documentElement.style.removeProperty(v));

            // Atualiza sliders para refletir os defaults
            controls.forEach(c => {
                const input = document.getElementById(c.id);
                const valEl = document.getElementById(c.id + '-val');
                if (!input || !valEl) return;

                let value;
                if (c.var === '--main-aspect-w') value = getRootAspectDefault().w;
                else if (c.var === '--main-aspect-h') value = getRootAspectDefault().h;
                else value = c.def !== null ? c.def : (c.min + c.max) / 2;

                input.value = value;
                valEl.textContent = (c.var === '--main-aspect-w' || c.var === '--main-aspect-h')
                    ? value
                    : (c.def !== null ? c.def + (c.unit || '') : 'auto');
            });

            // Re-aplica os defaults (caso seja uma var controlada por JS)
            syncAspectRatio();

            // Restaura estados de espelhamento para os do HTML
            document.querySelectorAll('.work').forEach((w, i) => {
                const shouldMirror = w.hasAttribute('data-default-mirror');
                w.classList.toggle('is-mirrored', shouldMirror);
                const mirrorBtn = document.querySelector(`.dev-mirror-btn[data-work="${i}"]`);
                const status = document.getElementById(`mirror-status-${i}`);
                if (mirrorBtn) mirrorBtn.textContent = shouldMirror ? 'RESTAURAR' : 'ESPELHAR';
                if (status) status.textContent = shouldMirror ? 'espelhado' : 'normal';
            });

            updateMeasures();
            btn.textContent = 'OK!';
            setTimeout(() => btn.textContent = 'RESET', 1000);
        });
    }

    /* ---------- 9. Init ---------- */
    function init() {
        // Atalho: ?panel=off esconde (padrão), ?panel=on mostra
        const params = new URLSearchParams(location.search);
        const showPanel = params.get('panel') === 'on';

        if (!showPanel) {
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
        bindMirrorControls();
        bindCopy();
        bindToggle();
        bindReset();

        // Recalcular medidas ao redimensionar
        window.addEventListener('resize', updateMeasures);

        // Medições iniciais
        requestAnimationFrame(updateMeasures);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();