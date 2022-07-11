'use strict'

function Oven() {
    this.pageElementId = 'oven'
    this.cooking = false

    this.ding = function () {
        console.log('Ding!')
    }

    this.cookPizza = function (kitchen) {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/oven-closed.png')
        this.cooking = true
        kitchen.currentOrder.status = 'cooking'
        setTimeout(() => {
            this.ding()
            this.cooking = false
            kitchen.currentOrder.status = 'cooked'
        }, 1000)
    }
    this.takeOutPizza = function () {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/oven-open.png')
    }
}

export {Oven}
