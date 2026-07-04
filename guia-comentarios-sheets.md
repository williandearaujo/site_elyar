# Guia: Comentários no Google Sheets

Este guia contém o código definitivo e corrigido para conectar a seção de comentários do seu blog com a sua planilha do Google Sheets de forma segura e estável.

---

## 💻 Passo 1: Atualizar o Código no Apps Script
1. Abra a sua planilha `Elyar Blog - Comentários` no Google Drive.
2. Vá em **Extensões > Apps Script**.
3. Substitua todo o código existente no editor pelo código corrigido abaixo:

```javascript
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Busca a aba pelo nome exato, evitando ler a aba ativa errada do navegador
  var sheet = ss.getSheetByName("Comentarios") || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var pageId = e.parameter.pageId;
  
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

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Escreve obrigatoriamente na aba Comentarios
  var sheet = ss.getSheetByName("Comentarios") || ss.getSheets()[0];
  var pageId = e.parameter.pageId;
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

## 🚀 Passo 2: Criar uma Nova Versão da Implantação
Sempre que você edita o código do Apps Script, precisa implantá-lo novamente:
1. No canto superior direito, clique em **Implantar > Gerenciar implantações**.
2. Clique no ícone de **Lápis (Editar)** ao lado do Web App ativo.
3. No campo "Versão", selecione **Nova versão** (New version).
4. Clique no botão azul **Implantar**.
