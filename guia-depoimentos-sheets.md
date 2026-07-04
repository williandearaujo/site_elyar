# Guia: Banco de Dados de Depoimentos no Google Sheets (100% Gratuito)

Criamos uma página dedicada para avaliações de clientes em `depoimentos.html`. Assim como no blog, os depoimentos adicionais podem ser salvos de forma **global e persistentemente para todos os visitantes** utilizando uma planilha do **Google Sheets** como banco de dados.

Siga os passos abaixo para configurar:

---

## 📅 Passo 1: Criar a Planilha de Depoimentos
1. Acesse o seu [Google Drive](https://drive.google.com) e crie uma nova planilha com o nome: `Elyar Blog - Depoimentos`.
2. Opcional: Na primeira linha, defina os seguintes cabeçalhos para organizar os dados:
   * **Coluna A**: `name`
   * **Coluna B**: `service`
   * **Coluna C**: `rating`
   * **Coluna D**: `text`
   * **Coluna E**: `date`

---

## 💻 Passo 2: Vincular o Script do Google Apps Script
1. Na sua planilha de Depoimentos, vá ao menu superior e clique em **Extensões > Apps Script**.
2. Remova todo o código de exemplo e cole o seguinte script:

```javascript
function doGet(e) {
  return ContentService.createTextOutput("API ativa. Use POST para todas as operações.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var action = e.parameter.action; // "get_testimonials" ou "add_testimonial"
  
  // -------------------------------------------------------------
  // ACTION: GET_TESTIMONIALS (LEITURA DE DEPOIMENTOS DE FORMA SEGURA)
  // -------------------------------------------------------------
  if (action === "get_testimonials") {
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
  
  // -------------------------------------------------------------
  // ACTION: ADD_TESTIMONIAL (GRAVAÇÃO DE DEPOIMENTO - PADRÃO)
  // -------------------------------------------------------------
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

3. Clique em 💾 **Salvar projeto** no topo.

---

## 🚀 Passo 3: Publicar como Web App
1. Clique em **Implantar > Gerenciar implantações** (ou Nova implantação) no Apps Script.
2. Crie ou edite a implantação configurada como:
   * **Tipo**: Web app
   * **Descrição**: `API de Depoimentos Elyar`
   * **Executar como**: **Você** (seu e-mail)
   * **Quem tem acesso**: **Qualquer pessoa** (Anyone)
3. Clique em **Implantar**.
4. Copie a **URL do Web App** gerada (termina com `/exec`).

---

## 🔌 Passo 4: Ativar o Banco de Dados no Código
1. Abra o arquivo **`depoimentos.html`** na raiz do seu site.
2. Vá até a linha **~291** e localize a variável `DEPOIMENTOS_API_URL`:
   ```javascript
   var DEPOIMENTOS_API_URL = 'SUA_URL_AQUI';
   ```
3. Cole a sua URL copiada dentro das aspas.
4. Salve o arquivo e envie-o para o GitHub!
