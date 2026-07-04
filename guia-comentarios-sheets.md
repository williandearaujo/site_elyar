# Guia: Comentários Globais e Persistentes com Google Sheets (100% Gratuito)

Como a **Elyar Serviços** é hospedada estaticamente no GitHub Pages, o sistema de comentários padrão armazena os dados no navegador de cada usuário (`localStorage`). Isso significa que um visitante não vê os comentários enviados por outro.

Para tornar os comentários **globais e persistentes para todos os visitantes** sem gastar nada e sem anúncios (como no Disqus), você pode usar uma planilha do **Google Sheets** como banco de dados.

Siga os passos simples abaixo para configurar:

---

## 📅 Passo 1: Criar a Planilha no Google Drive
1. Acesse o seu [Google Drive](https://drive.google.com) e clique em **Novo > Planilhas Google**.
2. Renomeie a planilha para um nome de sua escolha (ex: `Elyar Blog - Comentários`).
3. Opcional: Na primeira linha, crie os cabeçalhos para organizar visualmente as colunas:
   * **Coluna A**: `pageId`
   * **Coluna B**: `author`
   * **Coluna C**: `text`
   * **Coluna D**: `date`

---

## 💻 Passo 2: Vincular o Script do Google Apps Script
1. Na sua planilha, clique no menu superior em **Extensões > Apps Script**.
2. Apague qualquer código existente no editor e cole o código abaixo:

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var pageId = e.parameter.pageId;
  
  var comments = [];
  
  // Lê as linhas (pulando o cabeçalho)
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === pageId) {
      comments.push({
        pageId: data[i][0],
        author: data[i][1],
        text: data[i][2],
        date: data[i][3]
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(comments))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Recebe os parâmetros enviados por POST
  var pageId = e.parameter.pageId;
  var author = e.parameter.author;
  var text = e.parameter.text;
  var date = e.parameter.date;
  
  if (pageId && author && text) {
    sheet.appendRow([pageId, author, text, date]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Parâmetros ausentes' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}
```

3. Clique no ícone de disquete (💾 **Salvar projeto**) no topo do editor.

---

## 🚀 Passo 3: Publicar como Web App
1. No canto superior direito do Apps Script, clique no botão azul **Implantar > Nova implantação**.
2. No menu lateral da janela que abrir, clique na engrenagem ao lado de "Selecionar tipo" e escolha **Web app**.
3. Preencha as configurações exatamente assim:
   * **Descrição**: `API de Comentários Elyar`
   * **Executar como**: **Você** (seu e-mail)
   * **Quem tem acesso**: **Qualquer pessoa** *(⚠️ CRÍTICO: Se deixar "Apenas eu", o site não conseguirá salvar os comentários dos visitantes!)*
4. Clique no botão azul **Implantar**.
5. O Google solicitará permissão para que o script acesse sua planilha. Clique em **Autorizar acesso**, selecione sua conta do Google, clique em **Advanced (Avançado)** e depois em **Go to Projeto sem título (unsafe)** e confirme a autorização.
6. Copie a **URL do Web App** gerada (ela termina com `/exec`).

---

## 🔌 Passo 4: Colar a URL no código do Blog
Com a URL copiada, basta abrir os arquivos do seu blog e colar a URL na variável `COMMENTS_API_URL` (localizada no final do arquivo de cada post):

```javascript
// Localizado no script final dos arquivos blog/ia-impacto.html, blog/monitoramento-ativo.html, etc.
var COMMENTS_API_URL = 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI';
```

### Exemplo:
```javascript
var COMMENTS_API_URL = 'https://script.google.com/macros/s/AKfycby..._abc123/exec';
```

---

## 🛡️ Moderação de Comentários
Para moderar ou apagar algum comentário indesejado, basta abrir a planilha `Elyar Blog - Comentários` no seu Google Sheets e **excluir a linha inteira** do comentário correspondente. O site atualizará automaticamente na próxima visualização do artigo!
