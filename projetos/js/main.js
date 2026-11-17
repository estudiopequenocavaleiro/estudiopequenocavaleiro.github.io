/* ============================================
   VITRINE INTERATIVA DE PROJETOS - JavaScript
   ============================================

   ARRAY DE PROJETOS:
   Edite este array para adicionar, remover ou modificar projetos.
   Cada projeto precisa de:
   - title: nome do projeto
   - category: categoria/tag (opcional, pode usar "")
   - description: texto breve sobre o projeto
   - image: URL da imagem principal (tamanho grande)
   - thumbnail: URL da imagem miniatura (para os cards)
   - link: URL de destino ao clicar em "Ver mais"

   IMAGENS:
   Arquivos _G no destaque grande e _P nos cards menores.
   ============================================ */

// ============================================
// ARRAY DE PROJETOS - EDITE AQUI!
// ============================================
const projects = [
    {
        title: 'Modelagem & Escultura 3D',
        category: 'Arte',
        description: 'Criação de modelos 3D como ponto de partida para ideias, personagens e mundos. Estudos de forma, estilo e identidade visual, explorando desde o low poly estilizado até peças mais detalhadas.',
        image: 'images/otimizadas/Modelagem_G.jpg',
        thumbnail: 'images/otimizadas/Modelagem_P.jpg',
        link: '#'
    },
    {
        title: 'Rigging, animação e VFX',
        category: 'Cinema',
        description: 'Animação como ferramenta de narrativa e expressão. Testes de movimento, loops, acting e experimentos visuais que buscam dar vida aos personagens e ideias, mesmo em projetos pequenos e estudos rápidos.',
        image: 'images/otimizadas/Rig_G.jpg',
        thumbnail: 'images/otimizadas/Rig_P.jpg',
        link: '#'
    },
    {
        title: 'Impressão 3D',
        category: 'Arte',
        description: 'Do digital para o físico. Projetos pensados para impressão 3D, prototipagem, testes de peças funcionais ou decorativas. Aqui a ideia é entender limites, com erros, ajustes e aprendizados no caminho.',
        image: 'images/otimizadas/3DPrint_G.jpg',
        thumbnail: 'images/otimizadas/3DPrint_P.jpg',
        link: '#'
    },
    {
        title: 'Jogos',
        category: 'Games',
        description: 'Exploração de jogos como sistemas interativos. Protótipos, ideias, mecânicas e experimentos que misturam arte, design e programação.',
        image: 'images/otimizadas/Games_G.jpg',
        thumbnail: 'images/otimizadas/Games_P.jpg',
        link: '#'
    },
    {
        title: 'Programação/Projetos Maker',
        category: 'Tecnologia',
        description: 'A parte invisível que faz tudo funcionar. Um espaço para testar ideias, criar soluções e entender como unir tecnologia e criação de forma prática.',
        image: 'images/otimizadas/Programacao_G.jpg',
        thumbnail: 'images/otimizadas/Programacao_P.jpg',
        link: '#'
    },
    {
        title: 'Ensino e Conteúdos',
        category: 'Educação',
        description: 'Cursos, oficinas, workshops e materiais gratuitos voltados para quem quer aprender 3D, tecnologia e criação digital de forma prática.',
        image: 'images/otimizadas/Ensino_G.jpg',
        thumbnail: 'images/otimizadas/Ensino_P.jpg',
        link: '#'
    }
];

// ============================================
// CÓDIGO DA VITRINE (não precisa editar)
// ============================================

// Elementos do DOM
const highlightImage = document.getElementById('image');
const highlightCategory = document.getElementById('category');
const highlightTitle = document.getElementById('title');
const highlightDescription = document.getElementById('description');
const highlightLink = document.getElementById('link');
const highlightContent = document.querySelector('.highlight__content');
const cardsContainer = document.getElementById('cards');

// Estado atual
let currentProjectIndex = 0;

// Inicialização
function initVitrine() {
    // Gerar cards
    generateCards();

    // Carregar projeto inicial
    loadProject(0);
}

// Gerar cards dinamicamente a partir do array de projetos
function generateCards() {
    // Criar wrapper para scroll se não existir
    let wrapper = document.querySelector('.vitrine__cards-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'vitrine__cards-wrapper';
        cardsContainer.appendChild(wrapper);
    }

    wrapper.innerHTML = '';

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'vitrine__card' + (index === 0 ? ' vitrine__card--active' : '');
        card.dataset.index = index;

        card.innerHTML = `
            <img src="${project.thumbnail}" alt="${project.title}" class="card__image" loading="lazy">
            <div class="card__overlay">
                ${project.category ? `<span class="card__category">${project.category}</span>` : ''}
                <h3 class="card__title">${project.title}</h3>
            </div>
        `;

        card.addEventListener('click', () => selectProject(index));
        wrapper.appendChild(card);
    });
}

// Carregar projeto no destaque principal
function loadProject(index) {
    const project = projects[index];

    // Atualizar conteúdo
    highlightImage.src = project.image;
    highlightImage.alt = project.title;
    highlightCategory.textContent = project.category || '';
    highlightCategory.style.display = project.category ? 'inline-block' : 'none';
    highlightTitle.textContent = project.title;
    highlightDescription.textContent = project.description;
    highlightLink.href = project.link;
}

// Selecionar projeto com animação suave
function selectProject(index) {
    if (index === currentProjectIndex) return;

    // Atualizar visual dos cards
    const cards = document.querySelectorAll('.vitrine__card');
    cards.forEach((card, i) => {
        card.classList.toggle('vitrine__card--active', i === index);
    });

    // Animação de transição
    highlightImage.classList.add('transitioning');
    highlightContent.classList.add('transitioning');

    // Após animação de saída, trocar conteúdo
    const animationDuration = getComputedStyle(document.documentElement)
        .getPropertyValue('--vitrine-animation-duration') || '0.3s';
    const durationMs = parseFloat(animationDuration) * 1000;

    setTimeout(() => {
        currentProjectIndex = index;
        loadProject(index);

        // Remover classe de transição para animação de entrada
        highlightImage.classList.remove('transitioning');
        highlightContent.classList.remove('transitioning');
    }, durationMs);
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initVitrine);
