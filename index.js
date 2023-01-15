const express = require("express");
const MercadoPago = require("mercadopago");
const app = express();

MercadoPago.configure({
    //sandbox true quer dizer que esta em desenvolvimento...
    //sandbox False ------------------ em produção!
    sandbox: true,
    access_token: "TEST-3440218005357569-011208-795395cb6dc10cb0ce280ac6ece493c2-1233562926"
});

//rota principal
app.get("/",(req, res) =>{
    res.send("Olá mundo!");
});

//rota responsavel por pagamente
app.get("/pagar", async(req, res) =>{

    var id = "" + Date.now();
    var emailPagador = "guidias773@gmail.com";


    const dados ={
        items: [
            item = {
                // para cada venda feita precisa ser um id diferente
                //posso passar o UUID que é um numero unico
                //posso ultilizar a data em que a venta foi gerada
                //se ultilizar data preciso converter para string
                id: id,
                title: "PS4",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(3000)
            }
        ],
     //pagador
        payer:{
            email: emailPagador,
        },
        external_reference: id
    }


    try {
        var pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
        return res.redirect(pagamento.body.init_point);
    
    } catch (err) {
        return res.send(err.message);
    }
 
});

app.post("/not",(req,res) => {
    var id = req.query.id;

    setTimeout(() => {

        var filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(data => {

            var pagamento = data.body.results[0];

            if(pagamento != undefined){
                console.log(pagamento);
                console.log(pagamento.external_reference);
                console.log(pagamento.status); //aprovado

            
            } else{
                console.log("Pagamento não existe!!")
            }

            console.log(data);
        }).catch(err => {
            console.log(err);
        })

    },20000)
    
    res.send("ok")
})



app.listen(3000,(req, res) => {
    console.log("Servidor Rodando!!");
})