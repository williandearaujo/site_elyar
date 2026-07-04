# Guia: Comentários e Métricas Globais (Visitas/Curtidas) no Google Sheets

Para que as **visualizações (visitas)** e as **curtidas (likes)** de cada artigo do blog sejam globais e atualizadas em tempo real para todos os usuários da internet (e não salvas apenas no navegador de cada visitante individual), você pode utilizar a mesma planilha do **Google Sheets** que configurou para os comentários.

O código abaixo gerencia de forma unificada os comentários (na aba `Comentarios`) e as visitas/curtidas (na aba `Metricas` que o script criará automaticamente para você).

---

## 💻 Passo 1: Atualizar o Código no Apps Script
1. Abra a sua planilha `Elyar Blog - Comentários` no Google Drive.
2. Vá em **Extensões > Apps Script**.
3. Substitua todo o código existente no editor pelo código unificado abaixo:

```javascript
function doGet(e) {
  return ContentService.createTextOutput("API ativa. Use POST para todas as operações.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action; // "get_metrics", "like", "get_comments" ou "add_comment"
  var pageId = e.parameter.pageId;
  
  // -------------------------------------------------------------
  // ACTION: GET_METRICS (LEITURA E INCREMENTO DE VISITAS)
  // -------------------------------------------------------------
  if (action === "get_metrics") {
    var sheet = ss.getSheetByName("Metricas");
    if (!sheet) {
      sheet = ss.insertSheet("Metricas");
      sheet.appendRow(["pageId", "views", "likes"]);
    }
    
    var data = sheet.getDataRange().getValues();
    var views = 0;
    var likes = 0;
    var foundIndex = -1;
    
    // Procura o ID do artigo na planilha
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === pageId) {
        views = parseInt(data[i][1]) || 0;
        likes = parseInt(data[i][2]) || 0;
        foundIndex = i + 1;
        break;
      }
    }
    
    // Se "increment=true", soma uma visita
    if (e.parameter.increment === "true") {
      views += 1;
      if (foundIndex !== -1) {
        sheet.getRange(foundIndex, 2).setValue(views);
      } else {
        sheet.appendRow([pageId, views, likes]);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ views: views, likes: likes }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // -------------------------------------------------------------
  // ACTION: LIKE (INCREMENTO DE CURTIDAS)
  // -------------------------------------------------------------
  if (action === "like") {
    var sheet = ss.getSheetByName("Metricas");
    if (!sheet) {
      sheet = ss.insertSheet("Metricas");
      sheet.appendRow(["pageId", "views", "likes"]);
    }
    
    var data = sheet.getDataRange().getValues();
    var views = 0;
    var likes = 0;
    var foundIndex = -1;
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === pageId) {
        views = parseInt(data[i][1]) || 0;
        likes = parseInt(data[i][2]) || 0;
        likes += 1;
        sheet.getRange(i + 1, 3).setValue(likes);
        foundIndex = i + 1;
        break;
      }
    }
    
    if (foundIndex === -1) {
      likes = 1;
      sheet.appendRow([pageId, views, likes]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, likes: likes }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // -------------------------------------------------------------
  // ACTION: GET_COMMENTS (LEITURA DE COMENTÁRIOS)
  // -------------------------------------------------------------
  if (action === "get_comments") {
    var sheet = ss.getSheetByName("Comentarios") || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    var comments = [];
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
  
  // -------------------------------------------------------------
  // ACTION: ADD_COMMENT (GRAVAÇÃO DE COMENTÁRIO - PADRÃO)
  // -------------------------------------------------------------
  var sheet = ss.getSheetByName("Comentarios") || ss.getSheets()[0];
  var author = e.parameter.author;
  var text = e.parameter.text;
  var date = e.parameter.date;
  
  if (pageId && author && text) {
    sheet.appendRow([pageId, author, text, date]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Parâmetros ausentes' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Clique no disquete (💾 **Salvar projeto**).

---

## 🚀 Passo 2: Criar uma Nova Versão da Implantação (Muito Importante!)
Sempre que você edita o código do Apps Script, precisa implantá-lo novamente para aplicar as mudanças públicas:
1. No canto superior direito, clique em **Implantar > Gerenciar implantações**.
2. Clique no ícone de **Lápis (Editar)** ao lado do Web App ativo.
3. No campo "Versão", selecione **Nova versão** (New version).
4. Clique no botão azul **Implantar**.
5. Copie a URL gerada e certifique-se de que é a mesma configurada nos posts do blog.

Pronto! Agora todas as chamadas do seu site são enviadas via `POST` seguro, resolvendo o problema de CORS dos navegadores e garantindo que visitas e curtidas sejam computadas instantaneamente.
