'use strict'

function Oven() {
    this.pageElementId = 'oven'
    this.cooking = false
    this.bellSFX = this.pageElementId + '-bell'
    this.openSFX = this.pageElementId + '-open'
    this.closeSFX = this.pageElementId + '-close'

    this.playSound = function (soundEffect) {
        let audio = document.getElementById(soundEffect)
        audio.currentTime = 0
        audio.play()
    }

    this.cookPizza = function (kitchen) {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/oven-closed.png')
        this.cooking = true
        kitchen.currentOrder.status = 'cooking'
        this.playSound(this.closeSFX)
        setTimeout(() => {
            this.playSound(this.bellSFX)
            this.cooking = false
            kitchen.currentOrder.status = 'cooked'
        }, 2000)
    }
    this.removePizza = function () {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/oven-open.png')
        this.playSound(this.openSFX)
    }
}

export {Oven}
