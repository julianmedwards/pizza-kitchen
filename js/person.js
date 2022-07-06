'use strict'

function Person(footsteps) {
    this.walking = false
    this.footsteps = footsteps
    this.walk = function () {
        // play footsteps audio continuously
    }
    this.location = undefined
}

function Chef(footsteps, job) {
    Person.call(this, footsteps)
    this.job = job
    if (job === 'counter') {
        this.move = function () {
            if (location === 'travelling') {
                // Keep moving
            } else {
                if (location === 'counter') {
                    // Start moving to POS
                    this.location = 'travelling'
                    this.walking = true
                } else if (location === 'pos') {
                    // Start moving to counter
                    this.location = 'travelling'
                    this.walking = true
                }
            }
        }
        this.callOrder = function () {}
        this.enterOrder = function () {}
    } else if (job === 'logistics') {
        this.move = function () {
            if (location === 'travelling') {
                // Keep moving
            } else {
                if (location === 'fridge') {
                    // Start moving to oven
                    this.location = 'travelling'
                    this.walking = true
                } else if (location === 'grill') {
                    // Start moving to fridge
                    this.location = 'travelling'
                    this.walking = true
                }
            }
        }
        this.openFridge = function () {}
        this.closeFridge = function () {}
        this.placePizza = function () {}
    } else if (job === 'cooking') {
        this.move = function () {
            if (location === 'travelling') {
                // Keep moving
            } else {
                if (location === 'oven') {
                    // Start moving to boxing station
                    this.location = 'travelling'
                    this.walking = true
                } else if (location === 'boxing') {
                    // Start moving to oven
                    this.location = 'travelling'
                    this.walking = true
                }
            }
        }
        this.openOven = function () {}
        this.closeOven = function () {}
        this.boxPizza = function () {}
    } else {
        console.error('Unexpected chef job!')
    }
}

function Customer(footsteps) {
    Person.call(this, footsteps)
    this.location = 'entrance'
    this.order = 'pizza'
    this.custImg = function () {
        // Select random customer image.
    }
    this.createPersonElement = function () {
        // Create and place custImg in page.
    }
    this.move = function () {
        if (location === 'travelling') {
            // Keep moving
        } else {
            if (location === 'entrance') {
                // Start moving to counter
                this.location = 'travelling'
                this.walking = true
            } else if (location === 'counter') {
                // Order and leave
                this.location = 'travelling'
                this.walking = true
            }
        }
    }
}

export {Chef, Customer}
