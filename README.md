# Estúdio Pequeno Cavaleiro

Portfólio estático do estúdio, com páginas de projetos, cursos, conteúdo e recursos. A entrada do site é `index.html`, que encaminha para `home/`.

## Organização

- `home/`: página inicial.
- `projetos/`: portfólio.
- `aprender/`: cursos e mosaico de trabalhos e eventos.
- `conteudo/`: artigos e página de conteúdo.
- `recursos/`: mapa de recursos e ferramentas.
- `css/`, `js/` e `images/`: arquivos compartilhados.
- `scripts/`: ferramentas locais de manutenção.

## Conferir localmente

Na pasta do projeto, rode `node scripts/check-site.mjs` para conferir caminhos locais. Para abrir o site com um servidor local, rode `node scripts/serve.mjs` e acesse `http://127.0.0.1:8765/`.

Os painéis de ajuste de Aprender e Projetos são carregados apenas em `localhost`, `127.0.0.1` ou ao abrir os arquivos diretamente no computador.

## Publicar no GitHub Pages

Depois de enviar a branch `main` para o GitHub, abra **Settings → Pages** no repositório. Em **Build and deployment**, escolha **Deploy from a branch**, selecione **main** e **/(root)** e salve. O arquivo `.nojekyll` mantém a publicação direta dos arquivos estáticos.

Os links internos são relativos à pasta de cada página. Ao renomear ou mover uma imagem, atualize também o caminho no HTML ou JavaScript e execute a checagem antes de enviar as alterações.
