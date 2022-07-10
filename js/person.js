'use strict'

function Person(footsteps, location) {
    this.walking = false
    this.footsteps = footsteps
    this.walk = function () {
        // play footsteps audio continuously
    }
    this.pageElementId = undefined
    this.location = location
    this.lastLocation = undefined

    // Call after creating an instance and a corresponding element
    // with pageElementId. Sets top/left (coordinate) styles on el so
    // move functions work.
    this.initLocation = function () {
        let element = document.getElementById(this.pageElementId)
        element.style.left = `${this.location[0]}px`
        element.style.top = `${this.location[1]}px`
    }

    this.turnable = false
    this.turn = function (person) {
        let element = document.getElementById(person.pageElementId)
        if (element.src === person.images.right) {
            element.src = person.images.left
        } else {
            element.src = person.images.right
        }
    }

    // Uses set coordinates on the page as "nodes" (start and end)
    // between which the function will attempt to move towards at a
    // given speed in pixels.
    this.move = function (person, end, speed) {
        let element = document.getElementById(person.pageElementId)
        let xDiff = person.location[0] - end[0]
        let yDiff = person.location[1] - end[1]
        if (Math.abs(xDiff) >= speed || Math.abs(yDiff) >= speed) {
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                let left = (element.style.left = parseInt(
                    element.style.left.replace('px', '')
                ))
                if (xDiff < 0) {
                    if (person.turnable) {
                        person.turn(person)
                    }
                    element.style.left = `${left + speed}px`
                    person.location[0] = left + speed
                } else {
                    if (person.turnable) {
                        person.turn(person)
                    }
                    element.style.left = `${left - speed}px`
                    person.location[0] = left - speed
                }
            } else {
                let top = (element.style.top = parseInt(
                    element.style.top.replace('px', '')
                ))
                if (yDiff < 0) {
                    element.style.top = `${top + speed}px`
                    person.location[1] = top + speed
                } else {
                    element.style.top = `${top - speed}px`
                    person.location[1] = top - speed
                }
            }
        } else {
            person.location = end
            person.lastLocation = person.location
        }
    }
}

function Chef(footsteps, job, location) {
    Person.call(this, footsteps, location)
    this.turnable = true
    this.job = job
    if (job === 'counter') {
        this.pageElementId = 'counter-chef'

        this.enterOrder = function (order) {
            order.status = 'submitted'
            this.callOrder()
        }
        this.callOrder = function () {
            console.log('Order up!')
        }
    } else if (job === 'logistics') {
        this.pageElementId = 'logistics-chef'

        this.openFridge = function (kitchen) {}
        this.closeFridge = function (kitchen) {}
        this.putPizzaInOven = function (kitchen) {}
    } else if (job === 'cooking') {
        this.pageElementId = 'cooking-chef'

        this.takeOutPizza = function (kitchen) {}
        this.boxPizza = function (kitchen) {}
    } else {
        console.error('Unexpected chef job!')
    }

    this.initLocation()
}
Chef.prototype.images = {
    left: './img/pizza-man-left.gif',
    right: './img/pizza-man-right.gif',
}

function Customer(footsteps, location) {
    Person.call(this, footsteps, location)
    this.orderItem = 'pizza'
    this.hasPizza = false

    // Select random customer image.
    function getRandImg(customer) {
        let randIndex = Math.floor(Math.random() * 5)
        return [Object.values(customer.images)[randIndex]]
    }

    this.custImg = getRandImg(this)

    this.order = function (kitchen) {
        kitchen.currentOrder = {
            orderItem: this.orderItem,
            status: 'needsSubmission',
        }
        this.ordered = true
    }
    this.pickUpPizza = function (kitchen) {
        this.hasPizza = true
        kitchen.currentOrder.status = 'fulfilled'
    }
}

Customer.prototype.images = {
    hipster: './img/person-hipster.png',
    oldMan: './img/person-old-man.png',
    oldWoman: './img/person-old-woman.png',
    student: './img/person-student.png',
    dad: './img/person-dad.png',
}

export {Chef, Customer}
