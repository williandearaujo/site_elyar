# Guia de Administração - Elyar Serviços

Este repositório contém os arquivos do site oficial da **Elyar Serviços** hospedado no GitHub Pages. O site adota a linguagem visual **Premium Black & Gold** e é totalmente estático (HTML, CSS e JS), garantindo velocidade e segurança extremas.

---

## 📂 Estrutura de Arquivos Importantes

*   `index.html` - Página Inicial (Home).
*   `servicos.html` - Hub Principal de Serviços.
*   `portfolio.html` - Portfólio de Dashboards do Power BI (com Isotope Filters).
*   `contato.html` - Página de Contato com Formulário (FormSubmit) e Mapa.
*   `blog.html` - Hub de Postagens do Blog (no diretório raiz).
*   `blog/` - **Pasta contendo os artigos do blog**:
    *   `blog/ia-impacto.html` - Artigo sobre Inteligência Artificial.
    *   `blog/monitoramento-ativo.html` - Artigo sobre Monitoramento Zabbix & Grafana.
    *   `blog/template.html` - **Modelo base para a criação de novos artigos**.
*   `js/main-v1.js` - Script principal da TI, controles do menu, contadores progressivos e formulários.
*   `css/elyar-premium.css` - Estilos customizados da identidade Black & Gold.
*   `sitemap.xml` & `robots.txt` - Arquivos de configuração de SEO para o Google.

---

## ✍️ Como Criar e Publicar Novos Artigos no Blog (Passo a Passo)

Como o site é estático (sem banco de dados), adicionar um novo post é muito simples. Siga estas etapas:

### Passo 1: Duplicar o Template Base
1. Localize o arquivo `template.html` dentro da pasta **`blog/`**.
2. Faça uma cópia dele dentro da própria pasta **`blog/`** e renomeie o arquivo usando o título do seu post em letras minúsculas e separado por hifens.
   * *Exemplo:* Se o tema for sobre segurança em nuvem, salve como **`blog/seguranca-nuvem.html`**.

### Passo 2: Preparar a Imagem do Artigo
1. Crie ou escolha uma imagem no formato horizontal (proporção recomendada **16:9** ou resolução **1280x720 pixels**).
2. Salve essa imagem dentro da pasta `images/blog/` com um nome descritivo (ex: `blog_seguranca_nuvem.png`).
3. No seu novo arquivo HTML, localize a tag `<img>` do Banner e altere o caminho da imagem (note que o link precisa subir um nível usando `../` pois o arquivo está na pasta `blog/`):
   ```html
   <!-- Substitua 'blog_placeholder.png' pela sua nova imagem -->
   <img src="../images/blog/blog_seguranca_nuvem.png" alt="Título do Post Banner" ...>
   ```

### Passo 3: Atualizar Metadados e SEO (Topo do Arquivo)
No início do seu novo arquivo, ajuste:
*   A tag `<title>` com o título do post (ex: `<title>Segurança em Nuvem | Blog Elyar</title>`).
*   A tag `<meta name="description">` com um resumo de 1 ou 2 linhas sobre o post.
*   A tag `<meta name="keywords">` com termos relacionados.
*   **⚠️ CRÍTICO:** Remova a linha abaixo para que o Google passe a encontrar e indexar o seu artigo:
    ```html
    <meta name="robots" content="noindex, nofollow"> <!-- REMOVA ESTA LINHA -->
    ```

### Passo 4: Escrever o Conteúdo do Artigo
Substitua os textos de exemplo no corpo da página:
*   **Badge de Categoria**: Mude de `CATEGORIA_DO_ARTIGO` para a categoria desejada (ex: *Segurança*, *Business Intelligence*, *Infraestrutura*).
*   **Título Principal**: Mude o conteúdo da tag `<h1>`.
*   **Informações**: Modifique o autor e a data de publicação.
*   **Texto Principal**: Escreva o conteúdo usando as tags HTML convencionais (`<p>`, `<h3>`, `<blockquote>`, etc.).
*   **⚠️ ATENÇÃO AOS LINKS:** Lembre-se que o seu post está dentro de uma subpasta. Todos os links internos do menu e rodapé no seu post usam `../` (como `../index.html`, `../servicos.html`). Caso queira fazer um link para um serviço específico no texto, siga o mesmo modelo (ex: `../servicos-zabbix.html`).

### Passo 5: Configurar chaves exclusivas de Interação (Script no final)
No final do seu arquivo, localize a tag `<script>` interna e **substitua o ID genérico `TEMPLATE_ID`** por um ID curto e exclusivo do seu artigo.
*   *Exemplo:* Mude de `TEMPLATE_ID` para `seguranca_nuvem`.
```javascript
// Altere as chaves para que fiquem exclusivas deste post:
var viewsKey = 'blog_views_seguranca_nuvem';
var commentsKey = 'blog_comments_seguranca_nuvem';
var likesKey = 'blog_likes_seguranca_nuvem';
var likedKey = 'blog_liked_seguranca_nuvem';
```
*(Nota: Isso garante que as visualizações, curtidas e comentários deste artigo fiquem separados e não se misturem com outros posts).*
Você também pode definir os números iniciais simulados nas linhas seguintes (ex: views iniciais `100`, likes iniciais `30`).

### Passo 6: Vincular o Artigo no Hub do Blog (`blog.html`)
Para que o artigo apareça na página de listagem principal (`blog.html` na raiz):
1. Abra o arquivo **`blog.html`** na raiz.
2. Localize a área onde os cards estão listados. Duplique o bloco de código de um card anterior.
3. Modifique as informações do card duplicado:
   * Aponte o link do botão para o seu novo arquivo dentro da subpasta (ex: **`blog/seguranca-nuvem.html`**).
   * Altere a imagem `src` para a sua nova imagem (`images/blog/blog_seguranca_nuvem.png` — sem `../` porque o arquivo `blog.html` está na raiz).
   * Altere a categoria, a data de publicação, o título e a descrição resumida.
   * **IDs de Views e Curtidas no HTML**: No código HTML do card que você acabou de criar, atualize os seletores de ID para os seletores do seu novo post (ex: `<span id="nuvem-views-count">0</span>` e `<span id="nuvem-likes-count">0</span>`).
4. **Vincular no Script do Hub**: Vá ao final do arquivo `blog.html` e adicione a leitura das chaves exclusivas que você definiu no Passo 5 para que os contadores atualizem na listagem:
   ```javascript
   // Exemplo de como adicionar a leitura de visualizações e likes para o novo post:
   var nuvemViewsKey = 'blog_views_seguranca_nuvem';
   var nuvemLikesKey = 'blog_likes_seguranca_nuvem';
   
   var nuvemViews = localStorage.getItem(nuvemViewsKey) || 100;
   if (!localStorage.getItem(nuvemViewsKey)) localStorage.setItem(nuvemViewsKey, 100);
   $('#nuvem-views-count').text(nuvemViews);
   
   var nuvemLikes = localStorage.getItem(nuvemLikesKey) || 30;
   if (!localStorage.getItem(nuvemLikesKey)) localStorage.setItem(nuvemLikesKey, 30);
   $('#nuvem-likes-count').text(nuvemLikes);
   ```

---

## 📬 Configuração do Formulário de E-mail de Contato
O formulário de contatos envia e-mails utilizando a API do **FormSubmit.co** direcionados ao e-mail corporativo `contato@elyar.com.br` via requisições silenciosas em JSON (AJAX).
*   **Primeira ativação**: Caso mude o e-mail no HTML ou submeta pela primeira vez de um ambiente novo, o FormSubmit enviará uma mensagem de ativação para a sua caixa de entrada. Basta clicar em **"Activate Form"** para autorizar e passar a receber os e-mails silenciosamente.
*   **Captcha desativado**: O campo oculto `<input type="hidden" name="_captcha" value="false">` está configurado para evitar telas de verificação incômodas para o usuário final.

---

## ⚙️ Conectando com Scripts e CSS Globais
Como as páginas do blog estão dentro de uma subpasta, caso altere o nome do arquivo principal de Javascript (`js/main-v1.js`), lembre-se que no `blog.html` a importação é normal (`js/main-v1.js?v=2`), enquanto dentro dos artigos na subpasta `blog/` a importação deve conter o prefixo do diretório pai (`../js/main-v1.js?v=2`).
