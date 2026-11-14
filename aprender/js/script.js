/* =========================================================
   Portfólio Editorial — Mosaico Infinito
   script.js
   =========================================================
   - Renderiza o mosaico a partir de um array de projetos
   - Blocos inteiros alternam com pares empilhados de trabalhos e fotos de eventos
   - Os pares de fotos usam largura proporcional ao formato 4:3
   - Cada trabalho aparece uma vez por volta, em outra posição na volta seguinte
   - A próxima sequência é criada fora da tela para manter o movimento contínuo
   ========================================================= */

(function () {
    'use strict';

    /* ---------- 1. FONTE DE DADOS ----------
       Trabalhos dos alunos e registros de aulas e eventos.
       Para vídeos, usamos um quadro do próprio arquivo como prévia. */
    const projects = [
        { title: 'FOXY',             category: 'ALUNO · VINICIUS VIDAL',      image: 'images/Alunos/Foxy_Vinicius_Vidal.png',                              url: '#' },
        { title: 'LAGARTO ARQUEIRO', category: 'ALUNA · SILVIA SUGIURA',      image: 'images/Alunos/Lagarto_Arqueiro_Silvia_Sugiura.png',                 url: '#' },
        { title: 'INCUBADORA',       category: 'ALUNO · RAFAEL CANI',         video: 'images/Alunos/Videos/Incubadora_Rafael_Cani.mp4',                  url: '#' },
        { title: 'PICKETT',          category: 'ALUNA · GABRIELLE FERNANDES', image: 'images/Alunos/Pickett_Render_Gabrielle_Fernandes.jpg',             url: '#' },
        { title: 'COMIC FAROESTE',   category: 'ALUNO · GABRIEL ABRÃO',       image: 'images/Alunos/Comic_Faroeste_Gabriel_Abrao.png',                   url: '#' },
        { title: 'VASO ANTIGO',      category: 'ALUNO · GABRIEL APOLINÁRIO',  image: 'images/Alunos/Vaso_Antigo_Gabriel_Apolinario.png',                url: '#' },
        { title: 'SAMURAI',          category: 'ALUNO · CASSIANO NETO',       video: 'images/Alunos/Videos/Samurai_Cassiano_Neto.mp4',                   url: '#' },
        { title: 'TEMPLO OBSIDIANA', category: 'ALUNO · RAPHAEL SETS',       image: 'images/Alunos/Templo-Obsidiana_Raphael_Sets.png',                  url: '#' },
        { title: 'CARRO DOCE',       category: 'ALUNA · GABRIELLE JACCOMO',  image: 'images/Alunos/Carro_Doce_Gabrielle_Jaccomo.jpg',                   url: '#' },
        { title: 'PC',               category: 'ALUNO · GABRIEL APOLINÁRIO',  image: 'images/Alunos/PC_Gabriel_Apolinario.png',                          url: '#' },
        { title: 'AULAS E EVENTOS',  category: 'ESTÚDIO PEQUENO CAVALEIRO',  image: 'images/Eventos/1783432056153.jpg',                              url: '#' },
        { title: 'AULAS E EVENTOS',  category: 'ESTÚDIO PEQUENO CAVALEIRO',  image: 'images/Eventos/1785351310893.jpg',                              url: '#' },
        { title: 'AULAS E EVENTOS',  category: 'ESTÚDIO PEQUENO CAVALEIRO',  image: 'images/Eventos/IMG_20240406_155919 (1).jpg',                    url: '#' },
        { title: 'AULAS E EVENTOS',  category: 'ESTÚDIO PEQUENO CAVALEIRO',  image: 'images/Eventos/1761334285832 (1).jpg',                         url: '#' },
        { title: 'AULAS E EVENTOS',  category: 'ESTÚDIO PEQUENO CAVALEIRO',  image: 'images/Eventos/1761350857276 (1).jpg',                         url: '#' },
        { title: 'AULAS E EVENTOS',  category: 'ESTÚDIO PEQUENO CAVALEIRO',  image: 'images/Eventos/1781571569648.jpg',                              url: '#' },
        { title: 'APRESENTAÇÃO PUC GAME SHOW', category: 'ESTÚDIO PEQUENO CAVALEIRO', image: 'images/Eventos/Explicando2.png', url: '#' },
        { title: 'AULAS E EVENTOS',  category: 'ESTÚDIO PEQUENO CAVALEIRO',  image: 'images/Eventos/1785351311002.jpg',                              url: '#' },
        { title: 'FOTO DE GRUPO',    category: 'ESTÚDIO PEQUENO CAVALEIRO',  image: 'images/Eventos/Foto de grupo com sorriso acolhedor.png',        url: '#' }
    ];

    /* ---------- 2. FUNÇÃO: cria bloco com 1 mídia (100% altura) ---------- */
    function mediaHTML(p) {
        if (p.video) {
            return `<video src="${p.video}" muted loop playsinline preload="metadata" aria-label="${p.title}"></video><span class="m-tile__video-badge" aria-hidden="true">▶</span>`;
        }
        return `<img src="${p.image}" alt="${p.title}" loading="lazy">`;
    }

    function setupVideoPreview(video, tile) {
        let previewTime = 0;

        // Busca um quadro do próprio vídeo para não exibir a foto de outro trabalho.
        video.addEventListener('loadedmetadata', () => {
            if (Number.isFinite(video.duration) && video.duration > 0) {
                previewTime = Math.min(0.5, video.duration / 4);
                video.currentTime = previewTime;
            }
        }, { once: true });

        tile.addEventListener('mouseenter', () => video.play().catch(() => {}));
        tile.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = previewTime;
        });
    }

    function buildSingleBlock(p, projectIndex, landscape = false) {
        const block = document.createElement('button');
        block.type = 'button';
        block.className = landscape ? 'm-block m-block--single m-block--wide-photo' : 'm-block m-block--single';
        block.dataset.projectIndex = projectIndex;
        block.setAttribute('aria-label', `Ampliar ${p.video ? 'vídeo' : 'imagem'}: ${p.title} — ${p.category}`);
        block.innerHTML = `
            ${mediaHTML(p)}
            <div class="m-tile__meta">
                <p class="m-tile__title">${p.title}</p>
                <p class="m-tile__category">${p.category}</p>
            </div>
        `;
        if (p.video) {
            setupVideoPreview(block.querySelector('video'), block);
        }
        return block;
    }

    /* ---------- 3. FUNÇÃO: cria bloco com 2 mídias (50% + 50%) ---------- */
    function buildDoubleBlock(first, second, variant) {
        const block = document.createElement('div');
        block.className = variant === 'landscape'
            ? 'm-block m-block--double m-block--landscape'
            : `m-block m-block--double is-wide-${variant}`;
        block.innerHTML = [first, second].map(projectIndex => {
            const p = projects[projectIndex];
            return `
            <button class="m-tile" type="button" data-project-index="${projectIndex}" aria-label="Ampliar ${p.video ? 'vídeo' : 'imagem'}: ${p.title} — ${p.category}">
                ${mediaHTML(p)}
                <div class="m-tile__meta">
                    <p class="m-tile__title">${p.title}</p>
                    <p class="m-tile__category">${p.category}</p>
                </div>
            </button>`;
        }).join('');
        block.querySelectorAll('video').forEach(v => {
            setupVideoPreview(v, v.closest('.m-tile'));
        });
        return block;
    }

    /* ---------- 4. MONTAGEM DA SEQUÊNCIA ----------
       Intercala os registros de eventos com os trabalhos dos alunos. Cada
       mídia aparece uma vez antes de a sequência completa se repetir. */
    function shuffled(items) {
        const result = [...items];
        for (let index = result.length - 1; index > 0; index--) {
            const other = Math.floor(Math.random() * (index + 1));
            [result[index], result[other]] = [result[other], result[index]];
        }
        return result;
    }

    function buildSequence(featureProjectIndex = null) {
        const sequence = document.createElement('div');
        sequence.className = 'marquee__sequence';

        const events = shuffled(projects.map((project, index) =>
            project.image?.startsWith('images/Eventos/') ? index : -1).filter(index => index !== -1));
        if (featureProjectIndex !== null) {
            const featuredPosition = events.indexOf(featureProjectIndex);
            if (featuredPosition !== -1) events.unshift(events.splice(featuredPosition, 1)[0]);
        }
        const landscapeWorks = shuffled([0, 3, 4, 7, 8]);
        const compactWorks = shuffled([1, 5, 9]);
        const smallTiles = shuffled([compactWorks[1], compactWorks[2], 2, 6]);
        const photoBlocks = events.slice(0, landscapeWorks.length).map((event, index) =>
            Math.random() < 0.5
                ? ['landscape', event, landscapeWorks[index]]
                : ['landscape', landscapeWorks[index], event]);
        photoBlocks.push(...events.slice(landscapeWorks.length).map(event => ['wide-photo', event]));
        const otherBlocks = shuffled([
            ['single', compactWorks[0]],
            ['double', smallTiles[0], smallTiles[1]],
            ['double', smallTiles[2], smallTiles[3]]
        ]);
        const photos = shuffled(photoBlocks);
        if (featureProjectIndex !== null) {
            const featuredPosition = photos.findIndex(block => block.includes(featureProjectIndex));
            if (featuredPosition !== -1) photos.unshift(photos.splice(featuredPosition, 1)[0]);
        }
        const layout = [];
        photos.forEach((photo, index) => {
            layout.push(photo);
            if (index % 3 === 1 && otherBlocks.length) layout.push(otherBlocks.shift());
        });

        layout.forEach(([type, first, second], index) => {
            sequence.appendChild(type === 'single' || type === 'wide-photo'
                ? buildSingleBlock(projects[first], first, type === 'wide-photo')
                : buildDoubleBlock(first, second,
                    type === 'landscape' ? 'landscape' : index % 2 === 0 ? 'a' : 'b'));
        });
        return sequence;
    }

    /* ---------- 5. RENDERIZAÇÃO ---------- */
    const track = document.getElementById('marqueeTrack');
    if (!track) return;

    // A próxima volta já está pronta à direita. Ao sair da tela, a volta
    // anterior é removida e uma nova ordem é montada no fim da trilha.
    track.appendChild(buildSequence(projects.findIndex(project => project.image === 'images/Eventos/Explicando2.png')));
    track.appendChild(buildSequence());

    /* ---------- 6. VISUALIZAÇÃO AMPLIADA ---------- */
    const lightbox = document.getElementById('mosaicLightbox');
    const lightboxMedia = lightbox.querySelector('.m-lightbox__media');
    const lightboxCaption = lightbox.querySelector('.m-lightbox__caption');
    let previousFocus;

    track.addEventListener('click', event => {
        const tile = event.target.closest('[data-project-index]');
        if (!tile) return;
        const project = projects[Number(tile.dataset.projectIndex)];
        previousFocus = tile;
        lightboxMedia.replaceChildren();

        const media = document.createElement(project.video ? 'video' : 'img');
        media.src = project.video || project.image;
        if (project.video) {
            media.controls = true;
            media.playsInline = true;
            tile.querySelector('video')?.pause();
        } else {
            media.alt = project.title;
        }
        lightboxMedia.appendChild(media);
        lightboxCaption.textContent = `${project.title} · ${project.category}`;
        lightbox.showModal();
        if (project.video) media.play().catch(() => {});
    });

    lightbox.querySelector('.m-lightbox__close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('close', () => {
        const video = lightboxMedia.querySelector('video');
        if (video) video.pause();
        lightboxMedia.replaceChildren();
        previousFocus?.focus({ preventScroll: true });
    });

    /* ---------- 7. MOVIMENTO CONTÍNUO ---------- */
    const marquee = track.closest('.marquee');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let offset = 0;
    let lastFrame = 0;
    function advance(time) {
        if (lastFrame && !marquee.matches(':hover') && !lightbox.open) {
            const elapsed = Math.min((time - lastFrame) / 1000, 0.05);
            const firstWidth = track.firstElementChild.getBoundingClientRect().width;
            const duration = parseFloat(getComputedStyle(marquee).getPropertyValue('--marquee-speed')) || 101;
            offset -= firstWidth / duration * elapsed;

            if (-offset >= firstWidth) {
                offset += firstWidth;
                track.firstElementChild.remove();
                track.appendChild(buildSequence());
            }
            track.style.transform = `translate3d(${offset}px, 0, 0)`;
        }
        lastFrame = time;
        requestAnimationFrame(advance);
    }
    requestAnimationFrame(advance);

})();
