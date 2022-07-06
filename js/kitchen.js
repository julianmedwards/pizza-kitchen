'use strict'
import {Chef, Customer} from './person.js'
import {Oven} from './oven.js'
import {Freezer} from './freezer.js'

const MS_PER_TICK = 10

const FOOTSTEPS_1 = './audio/sound-footsteps-2.wav'
const FOOTSTEPS_2 = './audio/sound-footsteps-3.wav'
const FOOTSTEPS_3 = './audio/sound-footsteps-4.wav'

let chefs = {
    counterChef: new Chef(FOOTSTEPS_1, 'counter'),
    logisticsChef: new Chef(FOOTSTEPS_2, 'logistics'),
    cookingChef: new Chef(FOOTSTEPS_3, 'cooking'),
}

function Kitchen(MS_PER_TICK, chefs) {
    this.MS_PER_TICK = MS_PER_TICK

    this.visitors = 0

    this.entities = {}
    this.entities.customers = {}
    this.entities.chefs = chefs
    this.currentOrder = undefined

    this.customerImgs = {
        hipster: './img/person-hipster.png',
        oldMan: './img/person-old-man.png',
        oldWoman: './img/person-old-woman.png',
        student: './img/person-student.png',
        dad: './img/person-dad.png',
    }

    this.kitchenInfo = function () {
        console.log(this)
    }

    this.customerPresent = function () {
        // Spawn customer if one isn't present.
    }

    this.createCustomer = function () {
        let newCustomer = document.createElement('img')
        let randIndex = Math.floor(Math.random() * 5)
        newCustomer.classList.add('customer')
        newCustomer.setAttribute(
            'src',
            Object.values(this.customerImgs)[randIndex]
        )
        newCustomer.id = 'customer' + this.visitors

        document.getElementById('people').append(newCustomer)
        this.visitors += 1
    }

    this.customerOrder = function () {
        // Customer moves and orders when at counter
    }

    this.handleOrder = function () {
        // if currentOrder, check status.
        // Set chefs into motion based on status.
    }

    this.moveEntities = function () {
        // for entity in Kitchen.entities call their
        // move function. Move function checks
        // whether they need to move.
    }

    this.tick = function () {
        // customerPresent()
        // customerOrder()
        // handleOrder()
        // moveEntities()
    }

    this.loop = setInterval(this.tick, MS_PER_TICK)
}

let myKitchen = new Kitchen(MS_PER_TICK, chefs)
console.log(myKitchen.kitchenInfo())

myKitchen.createCustomer()
