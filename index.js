var express = require('express');
var axios = require('axios');
var { DataFrame } = require('dataframe-js');

var app = express();
var columns = ["numero", "candidato", "votos", "porcentagem"];

app.get('/', function (req, res) {

    const api = 'https://resultados.tse.jus.br/oficial/ele2022/545/dados-simplificados/br/br-c0001-e000545-r.json';

    let candidatos = [];

    setInterval(() => {
        axios({
            method: "get",
            url: api,
        })
        .then(function (response) {
            for (i = 0; i < response.data.cand.length; i++) {
    
                if (response.data.cand[i].n == 13 || response.data.cand[i].n == 22) {
                    
                    candidatos[i] = {
                        numero: response.data.cand[i].n,
                        candidato: response.data.cand[i].nm,
                        votos: response.data.cand[i].vap,
                        porcentagem: response.data.cand[i].pvap
                    };
                }
            }
            const df = new DataFrame(candidatos, columns);
    
            const filteredDf = df
                .filter(row => row.get("numero") == 13 || row.get("numero") == 22)
                .select("numero", "candidato", "votos", "porcentagem");
                
            filteredDf.show(3);
            res.setHeader("Content-Type", "text/json");

            res.status(200).json(candidatos);
            return;
        }).catch((err) => {
            
            console.log('Buscando resultados...');
        });
    }, 5000);
    return;
});


app.listen(8000, function () {
    console.log('Inicializando...');
})
