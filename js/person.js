'use strict'

function Person(footsteps) {
    this.walking = false
    this.footsteps = footsteps
    this.walk = function () {
        // play footsteps audio continuously
    }
    this.pageElementId = undefined
    this.location = undefined
    this.lastLocation = undefined

    // Call after creating an instance and a corresponding element
    // with pageElementId.
    this.initLocation = function () {
        let element = document.getElementById(this.pageElementId)
        element.style.left = `${this.location[0]}px`
        element.style.top = `${this.location[1]}px`
    }

    // Uses set coordinates on the page as "nodes" (start and end)
    // between which the function will attempt to move towards at a
    // given speed in pixels.
    this.move = function (end, speed) {
        let element = document.getElementById(this.pageElementId)
        let xDiff = this.location[0] - end[0]
        let yDiff = this.location[1] - end[1]
        if (Math.abs(xDiff) >= speed || Math.abs(yDiff) >= speed) {
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                let left = (element.style.left = parseInt(
                    element.style.left.replace('px', '')
                ))
                if (xDiff < 0) {
                    element.style.left = `${left + speed}px`
                    this.location[0] = left + speed
                } else {
                    element.style.left = `${left - speed}px`
                    this.location[0] = left - speed
                }
            } else {
                let top = (element.style.top = parseInt(
                    element.style.top.replace('px', '')
                ))
                if (yDiff < 0) {
                    element.style.top = `${top + speed}px`
                    this.location[1] = top + speed
                } else {
                    element.style.top = `${top - speed}px`
                    this.location[1] = top - speed
                }
            }
        } else {
            this.location = end
            this.lastLocation = this.location
        }
    }
}

function Chef(footsteps, job) {
    Person.call(this, footsteps)
    this.job = job
    if (job === 'counter') {
        this.pageElementId = 'counter-chef'

        this.callOrder = function () {}
        this.enterOrder = function () {}
    } else if (job === 'logistics') {
        this.pageElementId = 'logistics-chef'

        this.openFridge = function () {}
        this.closeFridge = function () {}
        this.putPizzaInOven = function () {}
    } else if (job === 'cooking') {
        this.pageElementId = 'cooking-chef'

        this.takeOutPizza = function () {}
        this.boxPizza = function () {}
    } else {
        console.error('Unexpected chef job!')
    }
}

function Customer(footsteps) {
    Person.call(this, footsteps)
    this.order = 'pizza'
    this.hasPizza = false

    let customerImgs = {
        hipster: './img/person-hipster.png',
        oldMan: './img/person-old-man.png',
        oldWoman: './img/person-old-woman.png',
        student: './img/person-student.png',
        dad: './img/person-dad.png',
    }

    // Select random customer image.
    function getRandImg() {
        let randIndex = Math.floor(Math.random() * 5)
        return [Object.values(customerImgs)[randIndex]]
    }

    this.custImg = getRandImg()

    this.order = function () {
        this.ordered = true
    }
    this.pickUpPizza = function () {
        this.hasPizza = true
    }
}

export {Chef, Customer}
