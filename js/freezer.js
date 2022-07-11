'use strict'

function Freezer() {
    this.pageElementId = 'freezer'
    this.openSFX = this.pageElementId + '-open'
    this.closeSFX = this.pageElementId + '-close'
    this.pizza = document.getElementById('freezer-pizza')

    this.playSound = function (soundEffect) {
        let audio = document.getElementById(soundEffect)
        audio.currentTime = 0
        audio.play()
    }

    this.showPizza = function () {
        this.pizza.style.display = 'initial'
    }
    this.hidePizza = function () {
        this.pizza.style.display = 'none'
    }

    this.open = function () {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/freezer-open.png')
        this.playSound(this.openSFX)
        this.showPizza()
    }
    this.close = function () {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/freezer-closed.png')
        this.playSound(this.closeSFX)
    }
}

export {Freezer}
