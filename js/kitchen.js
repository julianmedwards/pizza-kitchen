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

function Kitchen(MS_PER_TICK) {
    this.MS_PER_TICK = MS_PER_TICK

    this.currentOrder = undefined

    this.visitors = 0

    this.locations = {
        entrance: [20, 170],
        counterCust: [260, 170],
        boxingStationCust: [280, 40],
        counterChef: [400, 175],
        pos: [550, 175],
        fridge: [1100, 175],
        ovenLogistics: [900, 100],
        ovenCooking: [800, 50],
        boxingStationChef: [450, 50],
    }

    this.entities = {}
    this.entities.customer = undefined
    this.entities.chefs = {
        counterChef: new Chef(
            FOOTSTEPS[1],
            'counter',
            this.locations.counterChef
        ),
        logisticsChef: new Chef(
            FOOTSTEPS[2],
            'logistics',
            this.locations.fridge
        ),
        cookingChef: new Chef(
            FOOTSTEPS[3],
            'cooking',
            this.locations.ovenCooking
        ),
    }

    // this.initKitchen = function () {
    //     this.entities.chefs.counterChef.initLocation()
    //     this.entities.chefs.counterChef.location = this.locations.counterChef
    //     this.entities.chefs.logisticsChef.initLocation()
    //     this.entities.chefs.counterChef.location = this.locations.fridge
    //     this.entities.chefs.cookingChef.initLocation()
    //     this.entities.chefs.counterChef.location = this.locations.ovenCooking
    // }

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
        let newCust = new Customer(
            FOOTSTEPS[Math.floor(Math.random() * 3)],
            structuredClone(this.locations.entrance)
        )
        newCust.id = customerId
        newCust.pageElementId = 'customer' + customerId
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

    this.determineCustActions = function () {
        let customer = this.entities.customer
        let custAction = {}
        if (!customer.ordered) {
            if (customer.lastLocation !== this.locations.counterCust) {
                custAction = {
                    function: customer.move,
                    args: [customer, this.locations.counterCust, 3],
                }
            } else {
                custAction = {
                    function: customer.order,
                    args: [customer, this],
                }
            }
        } else {
            if (!customer.hasPizza) {
                if (
                    customer.lastLocation === this.locations.boxingStationCust
                ) {
                    custAction = {
                        function: customer.pickUpPizza,
                        args: [customer, this],
                    }
                } else {
                    custAction = {
                        function: customer.move,
                        args: [customer, this.locations.boxingStationCust, 3],
                    }
                }
            } else {
                custAction = {
                    function: customer.move,
                    args: [customer, this.locations.entrance, 3],
                }
            }
        }

        return custAction
    }

    this.determineChefActions = function () {
        let chefActions = []
        let counterChefAction = {}
        if (this.currentOrder) {
            switch (this.currentOrder.status) {
                case 'needsSubmission':
                    let counterChef = this.entities.chefs.counterChef
                    if (counterChef.lastLocation === this.locations.pos) {
                        counterChefAction = {
                            action: counterChef.enterOrder,
                            actionArgs: [this.currentOrder],
                        }
                        // counterChef.enterOrder(this.currentOrder)
                    } else {
                        counterChefAction = {
                            function: counterChef.move,
                            args: [counterChef, this.locations.pos, 3],
                        }
                        // counterChefAction = {
                        //     chef: counterChef,
                        //     move: true,
                        //     end: this.locations.pos,
                        //     speed: 3,
                        // }
                    }
                    chefActions.push(counterChefAction)
                    break
                case 'submitted':
                    this.entities.chefs.logisticsChef
                    break
                case 'cooking':
                    this.entities.chefs.cookingChef
                    break
                case 'cooked':
                    this.entities.chefs.cookingChef
                    break
                case 'awaitingPickup':
                    this.entities.chefs.cookingChef
                    break
            }
        }
        return chefActions
    }

    this.moveEntities = function (custAction, chefActions) {
        custAction.function(...custAction.args)

        for (let chefAction of chefActions) {
            chefAction.function(...chefAction.args)
        }
    }

    this.tick = function () {
        this.customerPresent()
        let custAction = this.determineCustActions()
        let chefActions = this.determineChefActions()
        this.moveEntities(custAction, chefActions)
    }

    this.loop = setInterval(() => {
        this.tick(this)
    }, MS_PER_TICK)
}

let myKitchen = new Kitchen(MS_PER_TICK)
console.log(myKitchen.kitchenInfo())
