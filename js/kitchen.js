'use strict'
import {Chef, Customer} from './person.js'
import {Oven} from './oven.js'
import {Freezer} from './freezer.js'

const MS_PER_TICK = 10

const FOOTSTEPS = [
    './audio/sound-footsteps-2.wav',
    './audio/sound-footsteps-3.wav',
    './audio/sound-footsteps-4.wav',
]

let chefs = {
    counterChef: new Chef(FOOTSTEPS[1], 'counter'),
    logisticsChef: new Chef(FOOTSTEPS[2], 'logistics'),
    cookingChef: new Chef(FOOTSTEPS[3], 'cooking'),
}

function Kitchen(MS_PER_TICK, chefs) {
    this.MS_PER_TICK = MS_PER_TICK

    this.visitors = 0

    this.entities = {}
    this.entities.customer = undefined
    this.entities.chefs = chefs
    this.currentOrder = undefined

    this.locations = {
        entrance: [20, 170],
        counterCust: [260, 170],
        boxingStationCust: [240, 70],
        counterChef: [400, 175],
        pos: [550, 175],
        fridge: [1100, 175],
        ovenLogistics: [900, 100],
        ovenCooking: [800, 50],
        boxingStationChef: [450, 50],
    }

    this.kitchenInfo = function () {
        console.log(this)
    }

    // Create cust obj and page element if one isn't present.
    this.customerPresent = function () {
        if (this.entities.customer === undefined) {
            let newCust = this.createCustomer()
            this.createCustomerEl(newCust)
        }
    }

    this.createCustomer = function () {
        let customerId = this.visitors
        let newCust = new Customer(FOOTSTEPS[Math.floor(Math.random() * 3)])
        newCust.id = customerId
        newCust.pageElementId = 'customer' + customerId
        newCust.location = structuredClone(this.locations.entrance)
        this.entities.customer = newCust

        this.visitors += 1
        return newCust
    }

    this.createCustomerEl = function (customer) {
        let newCustEl = document.createElement('img')
        newCustEl.classList.add('customer')
        newCustEl.setAttribute('src', customer.custImg)
        newCustEl.id = customer.pageElementId

        document.getElementById('people').append(newCustEl)
        customer.initLocation()
    }

    this.customerOrder = function () {
        let customer = this.entities.customer
        let custAction = {}
        if (!customer.ordered) {
            if (customer.lastLocation !== this.locations.counterCust) {
                custAction = {
                    move: true,
                    end: this.locations.counterCust,
                    speed: 3,
                }
            } else {
                custAction = {move: false, order: true}
            }
        } else {
            if (!customer.hasPizza) {
                if (
                    customer.lastLocation === this.locations.boxingStationCust
                ) {
                    custAction = {move: false, pickUpPizza: true}
                } else {
                    custAction = {
                        move: true,
                        end: this.locations.boxingStationCust,
                        speed: 3,
                    }
                }
            } else {
                custAction = {
                    move: true,
                    end: this.locations.entrance,
                    speed: 3,
                }
            }
        }

        return custAction
    }

    this.handleOrder = function () {
        let chefActions = []
        // if (currentOrder) {
        // check status
        // Set chefs into motion based on status.
        // }
        return chefActions
    }

    this.moveEntities = function (custAction, chefActions) {
        if (custAction.move === true) {
            this.entities.customer.move(custAction.end, custAction.speed)
            console.log(this.locations.entrance)
        } else if (custAction.order === true) {
            this.entities.customer.order()
        } else if (custAction.pickUpPizza === true) {
            this.entities.customer.pickUpPizza()
        } else {
            console.error('Unexpected state of customer!')
        }
    }

    this.tick = function () {
        this.customerPresent()
        let custAction = this.customerOrder()
        let chefActions = this.handleOrder()
        this.moveEntities(custAction, chefActions)
    }

    this.loop = setInterval(() => {
        this.tick(this)
    }, MS_PER_TICK)
}

let myKitchen = new Kitchen(MS_PER_TICK, chefs)
console.log(myKitchen.kitchenInfo())
