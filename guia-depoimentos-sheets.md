# Guia: Banco de Dados de Depoimentos no Google Sheets

Este guia contém o código definitivo e corrigido para conectar a página de depoimentos (`depoimentos.html`) com a sua planilha do Google Sheets de forma segura e estável.

---

## 💻 Passo 1: Atualizar o Código no Apps Script
1. Abra a sua planilha `Elyar Blog - Depoimentos` no Google Drive.
2. Vá em **Extensões > Apps Script**.
3. Substitua todo o código existente no editor pelo código corrigido abaixo:

```javascript
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Busca a aba pelo nome exato, evitando ler a aba ativa errada do navegador
  var sheet = ss.getSheetByName("Depoimentos") || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var testimonials = [];
  
  // Lê as linhas de depoimentos salvos (pulando a primeira linha de cabeçalho)
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) { // Se tiver nome
      testimonials.push({
        name: data[i][0],
        service: data[i][1],
        rating: parseFloat(data[i][2]) || 5,
        text: data[i][3],
        date: data[i][4]
      });
    }
  }
  
  // Retorna os dados invertidos (mais recentes primeiro)
  testimonials.reverse();
  
  return ContentService.createTextOutput(JSON.stringify(testimonials))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Escreve obrigatoriamente na aba Depoimentos
  var sheet = ss.getSheetByName("Depoimentos") || ss.getSheets()[0];
  
  // Recebe os parâmetros enviados pelo formulário
  var name = e.parameter.name;
  var service = e.parameter.service;
  var rating = e.parameter.rating;
  var text = e.parameter.text;
  var date = e.parameter.date;
  
  if (name && text) {
    sheet.appendRow([name, service, rating, text, date]);
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
