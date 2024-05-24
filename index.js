//Importa il moudulo express(come http), dopo aver installato express nel terminale(npm i express)
const express = require('express')

//Invoca metodo express(funzione che contiene tutti i metodi per far funzionare express) e salvalo nella constante app(nome convenzionale)
const app = express()

//Importa  il modulo persone(tipo json)
const persone = require('./persone')

//Collegare la cartella public che conterrà tutti i file html da utilizzare nelle res(la sintassi della res è diversa ora...)
app.use(express.static('public'))
//Ora puoi gestire le varie richieste/risposte tramite app

//Home-pagina principale
app.get('/', (req,res)=>{
    // res.send("Benvenuto nel sito")
    res.sendFile('homepage.html', {root: __dirname + '/public'})
})
//Pagina about
app.get('/about', (req, res)=>{
    // res.send("Questa è la pagina about")
    res.sendFile('about.html', {root: __dirname + '/public'})
})
//Pagina contatti
app.get('/contacts', (req, res)=>{
    // res.send("Questa è la pagina contatti")
    res.sendFile('contacts.html',  {root: __dirname + '/public'})
})
//Pagina persone
app.get('/persone', (req, res)=>{
    //visualizza tutti i dati di ogni oggetto
    // res.json(persone)
    //visualizza solo alcune informazioni(fai un map dell'array ed estrai solo le proprietà che ti interessano)
    let nuovePersone = persone.map((persona)=>{
        let {nome, cognome, età} = persona
        //oppure
        // nome = persona.nome
        // cognome = persona.cognome
        // età = persona.età
        return {nome, cognome, età}//devi per forza ritornare come oggetto l'elenco delle proprietà, altrimenti ti visualizza solo l'ultima...
    })
    res.json(nuovePersone)

})
//Pagina singola persona
app.get('/persone/:personID', (req, res)=>{
        const personID = req.params.personID
        let persona = persone.find((persona)=>persona.id === personID)//o lasci il === e scrivi l'id come nell'oggetto(cioè in stringa)
        if(!persona){
            return res.status(404).send("ERRORE! Persona non trovata")
        }
        res.json(persona)

        //oppure, sempre per gestire persone non trovate perchè non c'è un id corrispondente a quella persona(dato che non esiste)
        // if(persona){
        //     res.json(persona)    
        // }else{
        //     return res.status(404).send("ERRORE! Persona non trovata")
        // }    
})
//Altrimenti ogni singola pagina sarebbe stata così...e così via(è impensabile per un sito con milioni di utenti)
// app.get('/persone/1', (req, res)=>{
//     const persona1 = persone.find((persona)=>persona.id === "1")//o lasci il === e scrivi l'id come nell'oggetto(cioè in stringa)
//     res.json(persona1)
// })
// app.get('/persone/2', (req, res)=>{
//     const persona2 = persone.find((persona)=>persona.id == 2)// o scrivi l'id come numero e metti solo ==
//     res.json(persona2)
// })
// app.get('/persone/3', (req, res)=>{
//     const persona3 = persone.find((persona)=>persona.id == 3)// o scrivi l'id come numero e metti solo ==
//     res.json(persona3)
// })

//Query string param
app.get('/people/search', (req,res)=>{
    const {query, limit} = req.query
    //Ci sono diversi metodi per copiare l'array...vedi sotto
    let personeFiltrate = [...persone]
    // let personeFiltrate = Array.from(persone)
    // let personeFiltrate = persone.map((persona)=>persona)
    //Condizione per gestire il numero se voglio visualizzare solo 5 persone, solo 3, ecc(tipo un impaginazione)
    if(limit){
        personeFiltrate = personeFiltrate.slice(0, Number(limit))
    }
    //Condizione per la query(sarà quindi l'iniziale dei nomi cercati)
    if(query){
        personeFiltrate = personeFiltrate.filter((persona)=>{
            return persona.nome.startsWith(query)
            //oppure ad es.
            // return persona.cognome.startsWith(query)
            //La query si fa in base al parametro(o meglio proprietà) che gli passi in persona.startsWith
        })
    }
    //Condizione per gestire ricerche per persone che non esistono
    //(nota come non sarà un errore 404, cioè la richiesta va a buon fine(status(200)), ma siccome in quell'endpoint non c'è niente allora visualizzerà un array vuoto)
    if(personeFiltrate.length == 0){
        return res.status(200).json({code:200, data:[]})
        //N.B.: quando c'è il res.send, o res.status, o res.json non ti serve il return nella funzione normalmente...cioè funziona già così
        //      nell'if ci va il return così il codice si blocca là e non va avanti, se così non fosse lui leggerebbe anche il res.json scritto sotto,
        //      e questo causerebbe dei problemi all'app perchè il server non può inviare più di una riposta...tieni a mente questo per evitare confusioni
    }
    res.json(personeFiltrate)
    //oppure scrivi
    // res.status(200).json(personeFiltrate)
})
//Pagine inesistenti
app.all('*', (req, res)=>{
    // res.send(`<h2>Error 404 - Not Found</h2>
    //             <p>Torna alla <a href='/'>homepage</a> </p>`)
    res.sendFile('error404.html',  {root: __dirname + '/public'})

})


//Manda il server in ascolto(probabilmente la funzione createserver vista con il modulo http è compresa quando invochiamo express() in app)
app.listen(3000)//porta generica di node(in php era tipo 8000)