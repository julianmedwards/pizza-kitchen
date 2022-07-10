'use strict'

function Freezer() {
    this.pageElementId = 'freezer'

    this.open = function () {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/freezer-open.png')
    }
    this.close = function () {
        let element = document.getElementById(this.pageElementId)
        element.setAttribute('src', './img/freezer-closed.png')
    }
}

export {Freezer}
