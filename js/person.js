'use strict'

function Person(footsteps, location) {
    this.waiting = false
    this.walking = false
    this.footsteps = footsteps

    this.playSound = function (soundEffect) {
        let audio = document.getElementById(soundEffect)
        audio.currentTime = 0
        audio.play()
    }

    this.walk = function (person) {
        let audio = person.pageElementId + '-walk'
        person.playSound(audio)
        this.walking = true
    }
    this.stopWalk = function (person) {
        let audio = document.getElementById(`${person.pageElementId}-walk`)
        audio.pause()
        this.walking = false
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

    this.initAudio = function () {
        if (document.getElementById(`${this.pageElementId}-walk`)) {
            document.getElementById(`${this.pageElementId}-walk`).src =
                this.footsteps
        } else {
            let audio = document.createElement('audio')
            audio.setAttribute('id', `${this.pageElementId}-walk`)
            audio.src = this.footsteps
            document.getElementById('audio').append(audio)
        }
    }

    this.turnable = false
    this.turn = function (person) {
        let element = document.getElementById(person.pageElementId)
        if (element.getAttribute('data-facing') === 'right') {
            element.src = person.images.left
            element.setAttribute('data-facing', 'left')
        } else {
            element.src = person.images.right
            element.setAttribute('data-facing', 'right')
        }
    }

    // Uses set coordinates on the page as "nodes" (start and end)
    // between which the function will attempt to move towards at a
    // given speed in pixels.
    this.move = function (person, end, speed) {
        if (!person.walking) {
            person.walk(person)
        }

        let element = document.getElementById(person.pageElementId)
        let xDiff = person.location[0] - end[0]
        let yDiff = person.location[1] - end[1]
        if (Math.abs(xDiff) >= speed || Math.abs(yDiff) >= speed) {
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                let left = (element.style.left = parseInt(
                    element.style.left.replace('px', '')
                ))
                if (xDiff < 0) {
                    if (
                        person.turnable &&
                        element.getAttribute('data-facing') === 'left'
                    ) {
                        person.turn(person)
                    }
                    element.style.left = `${left + speed}px`
                    person.location[0] = left + speed
                } else {
                    if (
                        person.turnable &&
                        element.getAttribute('data-facing') === 'right'
                    ) {
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
            person.location = structuredClone(end)
            person.lastLocation = end
            person.stopWalk(person)
        }
    }
}

function Chef(footsteps, job, location) {
    Person.call(this, footsteps, location)
    this.turnable = true
    this.job = job
    if (job === 'counter') {
        this.pageElementId = 'counter-chef'
        this.orderUpSFX = 'order-up'
        this.keyboardSFX = this.pageElementId + '-keyboard'

        this.enterOrder = function (chef, order) {
            order.status = 'submitted'
            chef.playSound(chef.keyboardSFX)
            chef.waiting = true
            setTimeout(() => {
                chef.playSound(chef.orderUpSFX)
                chef.waiting = false
            }, 1000)
        }
    } else if (job === 'logistics') {
        this.pageElementId = 'logistics-chef'
        this.hasFrozenPizza = false

        this.getFrozenPizza = function (chef, kitchen) {
            chef.turnable = false
            chef.waiting = true

            kitchen.entities.freezer.open()

            setTimeout(() => {
                let element = document.getElementById(chef.pageElementId)
                element.src = './img/pizza-man-frozen.gif'
                chef.hasFrozenPizza = true

                setTimeout(() => {
                    kitchen.entities.freezer.close()
                    chef.waiting = false
                }, 500)
            }, 500)
        }
        this.putPizzaInOven = function (chef, kitchen) {
            chef.turn(chef)
            kitchen.entities.oven.cookPizza(kitchen)

            chef.waiting = true
            setTimeout(() => {
                chef.waiting = false
            }, 500)

            chef.hasFrozenPizza = false
            chef.turnable = true
        }
    } else if (job === 'cooking') {
        this.pageElementId = 'cooking-chef'
        this.hasFrozenPizza = false
        this.keyboardSFX = this.pageElementId + '-keyboard'

        this.takeOutPizza = function (chef, kitchen) {
            let element = document.getElementById(chef.pageElementId)
            element.src = './img/pizza-man-frozen.gif'
            chef.turnable = false
            chef.hasFrozenPizza = true
            kitchen.entities.oven.removePizza()

            chef.waiting = true
            setTimeout(() => {
                chef.waiting = false
            }, 500)
        }
        this.boxPizza = function (chef, kitchen) {
            chef.turn(chef)
            chef.playSound(chef.keyboardSFX)

            chef.waiting = true
            setTimeout(() => {
                chef.waiting = false
            }, 1000)

            kitchen.currentOrder.status = 'awaitingPickup'
            chef.hasFrozenPizza = false
            chef.turnable = true
        }
    } else {
        console.error('Unexpected chef job!')
    }

    this.initLocation()
    this.initAudio()
}
Chef.prototype.images = {
    left: './img/pizza-man-left.gif',
    right: './img/pizza-man-right.gif',
}

function Customer(footsteps, location, id) {
    Person.call(this, footsteps, location)
    this.orderItem = 'pizza'
    this.hasPizza = false
    this.pageElementId = 'customer' + id

    // Select random customer image.
    function getRandImg(customer) {
        let randIndex = Math.floor(Math.random() * 5)
        return [Object.values(customer.images)[randIndex]]
    }

    this.custImg = getRandImg(this)

    this.createCustomerEl = function () {
        let newCustEl = document.createElement('img')
        newCustEl.classList.add('customer')
        newCustEl.setAttribute('src', this.custImg)
        newCustEl.id = this.pageElementId

        document.getElementById('people').append(newCustEl)
    }

    this.order = function (customer, kitchen) {
        kitchen.currentOrder = {
            orderItem: customer.orderItem,
            status: 'needsSubmission',
        }
        customer.ordered = true
    }
    this.pickUpPizza = function (customer, kitchen) {
        if (kitchen.currentOrder.status === 'awaitingPickup') {
            customer.waiting = true
            setTimeout(() => {
                customer.hasPizza = true
                kitchen.currentOrder.status = 'fulfilled'
                customer.waiting = false
            }, 500)
        }
    }
    this.leave = function (customer, kitchen) {
        let element = document.getElementById(customer.pageElementId)
        element.remove()
        kitchen.entities.customer = undefined
    }

    this.createCustomerEl()
    this.initLocation()
    this.initAudio()
}

Customer.prototype.images = {
    hipster: './img/person-hipster.png',
    oldMan: './img/person-old-man.png',
    oldWoman: './img/person-old-woman.png',
    student: './img/person-student.png',
    dad: './img/person-dad.png',
}

export {Chef, Customer}
