const express = require('express')
const redirects = require('../assets/json/redirects.json')

module.exports = (app) => {

    redirects.map(link => {
        app.get(link.path, (req, res) => {
            res.redirect(link.to)
        })
    })
}