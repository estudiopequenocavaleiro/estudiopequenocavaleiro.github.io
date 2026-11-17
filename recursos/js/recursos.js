/*
 * Para publicar um recurso, edite o item correspondente abaixo e adicione href.
 * Caminhos de arquivos locais são relativos a recursos/index.html.
 * Enquanto href estiver ausente, o card aparece como "Em preparação".
 */
const places = {
    forja: {
        name: 'Forja',
        description: 'Produções do estúdio para abrir, adaptar e usar nos seus próprios projetos.',
        items: [
            { type: 'Produção do estúdio', title: 'Modelos 3D', description: 'Arquivos .blend de personagens, objetos e cenas para explorar e adaptar.', icon: '◈' },
            { type: 'Produção do estúdio', title: 'Texturas e materiais', description: 'Superfícies, shaders e materiais para experimentar em projetos 3D.', icon: '▧' },
            { type: 'Produção do estúdio', title: 'Brushes', description: 'Pincéis para escultura, pintura e acabamento digital.', icon: '✳' },
            { type: 'Produção do estúdio', title: 'Códigos e templates', description: 'Bases de código e modelos prontos para começar novos experimentos.', icon: '</>' },
            { type: 'Produção do estúdio', title: 'Projetos DIY e maker', description: 'Protótipos que misturam criação digital, eletrônica e fabricação.', icon: '⚙' }
        ]
    },
    sabio: {
        name: 'Sábio da Floresta',
        description: 'Recomendações e respostas para escolher, configurar e usar suas ferramentas.',
        items: [
            { type: 'Recomendações e dúvidas', title: 'Guia de PCs', description: 'Orientações para escolher peças e montar uma máquina para criar.', icon: '▣' },
            { type: 'Recomendações e dúvidas', title: 'Impressoras 3D', description: 'Comparações, cuidados e caminhos para começar a imprimir.', icon: '⬡' },
            { type: 'Recomendações e dúvidas', title: 'Periféricos', description: 'Mesas digitalizadoras, monitores e outros equipamentos de trabalho.', icon: '⌘' },
            { type: 'Recomendações e dúvidas', title: 'Softwares', description: 'Programas indicados para arte, jogos, edição e produção.', icon: '◈' },
            { type: 'Recomendações e dúvidas', title: 'Configurações', description: 'Ajustes para deixar ferramentas e projetos prontos para uso.', icon: '☷' },
            { type: 'Recomendações e dúvidas', title: 'Add-ons', description: 'Extensões e utilitários que podem ajudar no fluxo de trabalho.', icon: '✳' },
            { type: 'Recomendações e dúvidas', title: 'Dúvidas frequentes', description: 'Respostas curtas para problemas e escolhas comuns.', icon: '?' }
        ]
    },
    observatorio: {
        name: 'Observatório',
        description: 'Referências para estudar arte, narrativa, movimento e design em outras obras.',
        items: [
            { type: 'Referências para estudo', title: 'Filmes', description: 'Obras para observar composição, luz, ritmo e construção de mundos.', icon: '▶' },
            { type: 'Referências para estudo', title: 'Séries', description: 'Histórias e universos para estudar linguagem visual e narrativa.', icon: '▣' },
            { type: 'Referências para estudo', title: 'Jogos', description: 'Experiências para investigar arte, mecânicas e interação.', icon: '◇' },
            { type: 'Referências para estudo', title: 'Animações', description: 'Referências de movimento, atuação e direção de arte.', icon: '◌' },
            { type: 'Referências para estudo', title: 'Animes', description: 'Estudos de estilo, cenas, personagens e linguagem visual.', icon: '✦' },
            { type: 'Referências para estudo', title: 'Tier lists', description: 'Listas para comparar obras e conversar sobre escolhas criativas.', icon: '★' }
        ]
    },
    alquimia: {
        name: 'Torre do Alquimista',
        description: 'Guias de estudo para aprender técnicas e acompanhar processos do começo ao fim.',
        items: [
            { type: 'Guia de estudo', title: 'Documentos', description: 'Apostilas, PDFs e materiais para consultar durante a prática.', icon: '▤' },
            { type: 'Guia de estudo', title: 'Tutoriais', description: 'Passos guiados para aprender uma técnica ou resolver uma tarefa.', icon: '✎' },
            { type: 'Guia de estudo', title: 'Cursos', description: 'Cursos do estúdio e formações indicadas para estudar com mais profundidade.', icon: '✦', href: '../aprender/index.html', action: 'Ver cursos →' },
            { type: 'Guia de estudo', title: 'Livros', description: 'Leituras para ampliar repertório e fundamentar os estudos.', icon: '▣' },
            { type: 'Guia de estudo', title: 'Vídeos de processos', description: 'Gravações e bastidores para acompanhar como as ideias ganham forma.', icon: '▶', href: 'https://youtube.com/@estudiopequenocavaleiro', action: 'Ver vídeos →' }
        ]
    },
    praca: {
        name: 'Praça',
        description: 'Atividades e encontros para participar, criar junto e conhecer outras pessoas.',
        items: [
            { type: 'Interatividade', title: 'Desafios', description: 'Propostas criativas para praticar e compartilhar resultados.', icon: '✦' },
            { type: 'Interatividade', title: 'Eventos', description: 'Encontros, oficinas e atividades para acompanhar ou participar.', icon: '◎' },
            { type: 'Interatividade', title: 'Game Jams', description: 'Criação de jogos em equipe dentro de um prazo e um tema.', icon: '◇' },
            { type: 'Interatividade', title: 'Exposições', description: 'Mostras e espaços para conhecer trabalhos e processos.', icon: '▣' },
            { type: 'Interatividade', title: 'Oportunidades', description: 'Chamadas, colaborações e caminhos para fazer parte.', icon: '⌁' },
            { type: 'Interatividade', title: 'Comunidades', description: 'Lugares para trocar ideias e encontrar outros criadores.', icon: '☷', href: 'https://discord.gg/XewHVRmMsZ', action: 'Entrar no Discord →' }
        ]
    }
};

// Os subfiltros já podem ser testados; os arquivos serão associados a eles depois.
const filterGroups = {
    'Modelos 3D': ['Modelagem', 'Escultura', 'Animação', 'Impressão 3D'],
    'Texturas e materiais': ['Metal', 'Madeira', 'Pedra', 'Tecido'],
    'Brushes': ['Escultura', 'Pintura', 'Detalhes'],
    'Códigos e templates': ['Godot', 'Web', 'Arduino', 'Python'],
    'Projetos DIY e maker': ['Eletrônica', 'Impressão 3D', 'Protótipos'],
    'Guia de PCs': ['Montagem', 'Peças', 'Orçamento', 'Manutenção'],
    'Impressoras 3D': ['FDM', 'Resina', 'Manutenção', 'Materiais'],
    'Periféricos': ['Mesas digitalizadoras', 'Monitores', 'Áudio', 'Acessórios'],
    'Softwares': ['3D', 'Jogos', 'Arte', 'Edição', 'Código'],
    'Configurações': ['Blender', 'Godot', 'Impressão 3D', 'Sistema'],
    'Add-ons': ['Blender', 'Godot', 'Produtividade'],
    'Dúvidas frequentes': ['Equipamentos', 'Programas', 'Processos'],
    'Filmes': ['Direção de arte', 'Fotografia', 'Narrativa'],
    'Séries': ['Universos', 'Personagens', 'Narrativa'],
    'Jogos': ['Arte', 'Mecânicas', 'Narrativa', 'Interface'],
    'Animações': ['Movimento', 'Personagens', 'Cenários'],
    'Animes': ['Estilo', 'Ação', 'Composição'],
    'Tier lists': ['Filmes', 'Séries', 'Jogos', 'Animes'],
    'Documentos': ['Apostilas', 'Resumos', 'Guias rápidos'],
    'Tutoriais': ['3D', 'Jogos', 'Programação', 'Maker'],
    'Cursos': ['Online', 'Presenciais', 'Experiências'],
    'Livros': ['Arte', 'Design', 'Tecnologia'],
    'Vídeos de processos': ['Modelagem', 'Animação', 'Jogos', 'Bastidores'],
    'Desafios': ['3D', 'Desenho', 'Código'],
    'Eventos': ['Feiras e mostras', 'Oficinas', 'Encontros', 'Palestras'],
    'Game Jams': ['Próximas', 'Em andamento', 'Projetos concluídos'],
    'Exposições': ['Digitais', 'Presenciais', 'Galerias'],
    'Oportunidades': ['Editais', 'Parcerias', 'Trabalhos'],
    'Comunidades': ['Grupos', 'Discord', 'Colaborações']
};

// Adicione href a cada item quando o arquivo ou a página estiver pronto.
// Caminhos locais partem de recursos/index.html.
const resourceEntries = {
    'Softwares': {
        '3D': [{ title: 'Blender', href: 'https://www.blender.org/' }],
        Jogos: [{ title: 'Godot', href: 'https://godotengine.org/' }],
        Arte: [{ title: 'Krita', href: 'https://krita.org/' }],
        'Edição': [{ title: 'GIMP', href: 'https://www.gimp.org/' }]
    },
    'Add-ons': {
        Blender: [{ title: 'RetopoFlow', href: 'https://github.com/CGCookie/retopoflow', note: 'Retopologia' }]
    },
    'Eventos': {
        'Feiras e mostras': [
            { title: 'PUCPR Game Show', href: 'https://blogs.pucpr.br/jogosdigitais/pucpr-show/' },
            { title: 'Maker Faire Curitiba', href: 'https://www.makerfairecuritiba.com.br/' }
        ]
    },
    'Comunidades': {
        Grupos: [{ title: 'Comunidade do estúdio no app', href: 'https://aster-luna-8787d.web.app/' }],
        Discord: [{ title: 'Discord do estúdio', href: 'https://discord.gg/XewHVRmMsZ' }]
    },
    'Tutoriais': {
        '3D': [
            { title: 'Escultura digital com o mouse', href: 'https://www.youtube.com/watch?v=y43gmJWIulE', note: 'YouTube' }
        ]
    },
    'Cursos': {
        Online: [
            { title: 'Cursos do estúdio', href: '../aprender/index.html' },
            { title: 'Animação da Sony', href: 'https://www.yellowbrick.co/sony', note: 'Em inglês' },
            { title: 'Criação de robôs para iniciantes', href: 'https://www.cgboost.com/courses/blender-robot-creation-for-beginners', note: 'Em inglês' },
            { title: 'Blender para iniciantes', href: 'https://www.cgboost.com/courses/free-blender-beginners-course', note: 'Em inglês' },
            { title: 'Escultura para iniciantes', href: 'https://www.cgboost.com/courses/blender-sculpting-for-beginners', note: 'Em inglês' },
            { title: 'Game Design', href: 'https://www.eucapacito.com.br/cursos/game-design/' }
        ]
    },
    'Modelos 3D': {
        Modelagem: [
            { title: 'Modelo 01' },
            { title: 'Modelo 02' },
            { title: 'Modelo 03' }
        ]
    },
    'Guia de PCs': {
        Montagem: [
            { title: 'Laboratório do PC', href: 'ferramentas/laboratorio-do-pc/index.html' }
        ]
    }
};

const carousel = document.getElementById('resource-carousel');
const title = document.getElementById('resource-title');
const description = document.getElementById('resource-description');
const kicker = document.getElementById('resource-kicker');
const mapGuide = document.querySelector('.map-guide');
const mapGuideDetails = document.querySelector('.map-guide__details');
const mapStage = document.querySelector('.map-stage');
const filterPanel = document.querySelector('.filter-panel');
const filterTitle = document.getElementById('filter-title');
const filterDescription = document.getElementById('filter-description');
const filterOptions = document.getElementById('filter-options');
const filterResult = document.getElementById('filter-result');
const selectedFilterTitle = document.getElementById('selected-filter-title');
const previous = document.getElementById('previous-card');
const next = document.getElementById('next-card');
const placeButtons = [...document.querySelectorAll('[data-category]')];

function makeCard(item) {
    const card = document.createElement('button');
    card.className = 'resource-card';
    card.type = 'button';
    card.setAttribute('aria-controls', 'filter-options');
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', () => selectResource(item, card));

    const top = document.createElement('span');
    top.className = 'resource-card__top';
    const icon = document.createElement('span');
    icon.className = 'resource-card__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = item.icon;
    const status = document.createElement('span');
    status.className = 'resource-card__status';
    const hasLinkedEntry = Object.values(resourceEntries[item.title] || {})
        .some(entries => entries.some(entry => entry.href));
    status.textContent = item.href || hasLinkedEntry ? 'Disponível' : 'Em preparação';
    top.append(icon, status);

    const type = document.createElement('span');
    type.className = 'resource-card__type';
    type.textContent = item.type;
    const heading = document.createElement('span');
    heading.className = 'resource-card__title';
    heading.textContent = item.title;
    const copy = document.createElement('span');
    copy.className = 'resource-card__description';
    copy.textContent = item.description;

    const action = document.createElement('span');
    action.className = 'resource-card__action';
    action.textContent = 'Explorar categorias →';

    card.append(top, type, heading, copy, action);
    return card;
}

function selectResource(item, card, reveal = true) {
    carousel.querySelectorAll('.resource-card').forEach(button => {
        const active = button === card;
        button.classList.toggle('is-selected', active);
        button.setAttribute('aria-pressed', String(active));
    });
    filterTitle.textContent = item.title;
    filterDescription.textContent = item.description;
    const filters = filterGroups[item.title] || [];
    const buttons = filters.map(label => {
        const button = document.createElement('button');
        button.className = 'filter-chip';
        button.type = 'button';
        button.textContent = label;
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => selectFilter(item, label));
        return button;
    });
    filterOptions.replaceChildren(...buttons);
    if (filters.length) selectFilter(item, filters[0]);
    if (!reveal) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.matchMedia('(max-width: 750px)').matches) {
        filterPanel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    } else {
        const filterTop = filterPanel.getBoundingClientRect().top - mapGuideDetails.getBoundingClientRect().top + mapGuideDetails.scrollTop - 16;
        mapGuideDetails.scrollTo({ top: filterTop, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
}

function selectFilter(item, label) {
    filterOptions.querySelectorAll('.filter-chip').forEach(button => {
        const active = button.textContent === label;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
    });
    selectedFilterTitle.textContent = label;
    filterResult.scrollTop = 0;
    const entries = resourceEntries[item.title]?.[label]
        || (item.href ? [{ title: item.action || item.title, href: item.href }] : []);
    if (!entries.length) {
        const empty = document.createElement('p');
        empty.className = 'resource-index__empty';
        empty.textContent = 'Os itens desta subcategoria aparecerão aqui.';
        filterResult.replaceChildren(empty);
        return;
    }
    const list = document.createElement('ol');
    list.className = 'resource-index__list';
    entries.forEach(entry => {
        const row = document.createElement('li');
        const content = document.createElement(entry.href ? 'a' : 'span');
        content.className = 'resource-index__item';
        if (entry.href) {
            content.href = entry.href;
            if (/^https?:\/\//.test(entry.href)) {
                content.target = '_blank';
                content.rel = 'noopener noreferrer';
            }
        }
        const name = document.createElement('strong');
        name.textContent = entry.title;
        const state = document.createElement('small');
        state.textContent = entry.href ? [entry.note, 'Abrir →'].filter(Boolean).join(' · ') : 'Em preparação';
        content.append(name, state);
        row.append(content);
        list.append(row);
    });
    filterResult.replaceChildren(list);
}

function updateControls() {
    previous.disabled = carousel.scrollLeft <= 2;
    next.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
}

function selectPlace(key) {
    const place = places[key];
    if (!place) return;

    title.textContent = place.name;
    description.textContent = place.description;
    kicker.textContent = `Lugar selecionado · ${place.items.length} tipos de recurso`;
    carousel.setAttribute('aria-label', `Recursos: ${place.name}`);
    carousel.replaceChildren(...place.items.map(makeCard));
    carousel.scrollLeft = 0;
    selectResource(place.items[0], carousel.firstElementChild, false);
    mapGuideDetails.scrollTop = 0;

    placeButtons.forEach(button => {
        const active = button.dataset.category === key;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
    });
    requestAnimationFrame(updateControls);
}

function scrollCards(direction) {
    const firstCard = carousel.firstElementChild;
    if (!firstCard) return;
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    carousel.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: reducedMotion ? 'auto' : 'smooth' });
}

placeButtons.forEach(button => button.addEventListener('click', () => selectPlace(button.dataset.category)));
previous.addEventListener('click', () => scrollCards(-1));
next.addEventListener('click', () => scrollCards(1));
carousel.addEventListener('scroll', updateControls, { passive: true });
window.addEventListener('resize', updateControls);
new ResizeObserver(() => {
    mapGuide.style.height = `${mapStage.getBoundingClientRect().height}px`;
}).observe(mapStage);

selectPlace('forja');
