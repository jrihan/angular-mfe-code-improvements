/* eslint-disable max-len */
const context = `{
  "gateway":"http://localhost:5000",
  "token":"",
  "segmento": "varejo",
  "apikey": "",
  "inputdata": {
    "mensagem" :  {
      "titulo" :"Primeira aplicação"
    }
  }
}`;

const tags = document.getElementsByTagName("mf-plataformaresseguro-mfe");

for (const tag of tags) {
  tag.setAttribute("context", context);
}
