'use strict'

function Freezer() {
    this.pageElementId = 'freezer'
    this.openSFX = this.pageElementId + '-open'
    this.closeSFX = this.pageElementId + '-close'

    this.playSound = function (soundEffect) {
        let audio = document.getElementById(soundEffect)
        audio.currentTime = 0
        audio.play()
    }

    this.open = function () {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/freezer-open.png')
        this.playSound(this.openSFX)
    }
    this.close = function () {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/freezer-closed.png')
        this.playSound(this.closeSFX)
    }
}

export {Freezer}
