const express = require('express')
const router = express.Router()

const {persone} = require('../people')

router.get('/', (req,res)=>{
    res.status(200).json({success:true, data:persone})
})

router.get('/:personID', (req,res)=>{
    const personID = req.params.personID
    let persona = persone.find((persona)=>persona.id === personID)
    if(!persona){
        res.status(404).send("Attenzione! Persona inesistente...")
    }
    res.json(persona)
})

router.post('/', (req,res)=>{
    let persona = req.body
    persone.push(persona)
    res.status(200).json({success:true, data:persone})
})

router.put('/:personID', (req,res)=>{
    const personID = req.params.personID
    let personaIndex = persone.findIndex((persona)=>persona.id === personID)
    let persona = req.body
    persone[personaIndex] = persona
    res.json(persona)
})

router.delete('/:personID', (req,res)=>{
    const personID = req.params.personID
    let personaIndex = persone.findIndex((persona)=>persona.id === personID)
    persone.splice(personaIndex,1)
    res.status(200).json({success:true, data:persone})
})

module.exports = router