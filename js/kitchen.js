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
        freezer: [1100, 175],
        ovenLogistics: [950, 70],
        ovenCooking: [800, 50],
        boxingStationChef: [450, 50],
    }

    this.entities = {}
    this.entities.customer = undefined
    this.entities.chefs = {
        counterChef: new Chef(
            FOOTSTEPS[1],
            'counter',
            structuredClone(this.locations.counterChef)
        ),
        logisticsChef: new Chef(
            FOOTSTEPS[2],
            'logistics',
            structuredClone(this.locations.freezer)
        ),
        cookingChef: new Chef(
            FOOTSTEPS[3],
            'cooking',
            structuredClone(this.locations.ovenCooking)
        ),
    }
    this.entities.freezer = new Freezer()
    this.entities.oven = new Oven()

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
        let logisticsChefAction = []
        let cookingChefAction = []
        if (this.currentOrder) {
            let counterChef = this.entities.chefs.counterChef
            let logisticsChef = this.entities.chefs.logisticsChef
            let cookingChef = this.entities.chefs.cookingChef
            switch (this.currentOrder.status) {
                case 'needsSubmission':
                    if (counterChef.lastLocation === this.locations.pos) {
                        counterChefAction = {
                            function: counterChef.enterOrder,
                            args: [counterChef, this.currentOrder],
                        }
                    } else {
                        counterChefAction = {
                            function: counterChef.move,
                            args: [counterChef, this.locations.pos, 3],
                        }
                    }
                    chefActions.push(counterChefAction)
                    break
                case 'submitted':
                    if (
                        counterChef.lastLocation !== this.locations.counterChef
                    ) {
                        counterChefAction = {
                            function: counterChef.move,
                            args: [counterChef, this.locations.counterChef, 3],
                        }
                        chefActions.push(counterChefAction)
                    }
                    if (logisticsChef.waiting == false) {
                        if (!logisticsChef.hasFrozenPizza) {
                            logisticsChefAction = {
                                function: logisticsChef.getFrozenPizza,
                                args: [logisticsChef, this],
                            }
                            chefActions.push(logisticsChefAction)
                        } else if (
                            logisticsChef.lastLocation !==
                            this.locations.ovenLogistics
                        ) {
                            logisticsChefAction = {
                                function: logisticsChef.move,
                                args: [
                                    logisticsChef,
                                    this.locations.ovenLogistics,
                                    3,
                                ],
                            }
                            chefActions.push(logisticsChefAction)
                        } else {
                            logisticsChefAction = {
                                function: logisticsChef.putPizzaInOven,
                                args: [logisticsChef, this],
                            }
                            chefActions.push(logisticsChefAction)
                        }
                    }
                    break
                case 'cooking':
                    if (logisticsChef.lastLocation !== this.locations.freezer) {
                        logisticsChefAction = {
                            function: logisticsChef.move,
                            args: [logisticsChef, this.locations.freezer, 3],
                        }
                        chefActions.push(logisticsChefAction)
                    }
                    break
                case 'cooked':
                    if (!cookingChef.hasFrozenPizza) {
                        cookingChefAction = {
                            function: cookingChef.takeOutPizza,
                            args: [cookingChef, this],
                        }
                        chefActions.push(cookingChefAction)
                    } else if (
                        cookingChef.lastLocation !==
                        this.locations.boxingStationChef
                    ) {
                        cookingChefAction = {
                            function: cookingChef.move,
                            args: [
                                cookingChef,
                                this.locations.boxingStationChef,
                                3,
                            ],
                        }
                        chefActions.push(cookingChefAction)
                    } else {
                        cookingChefAction = {
                            function: cookingChef.boxPizza,
                            args: [cookingChef, this],
                        }
                        chefActions.push(cookingChefAction)
                    }
                    break
                case 'fulfilled':
                    if (
                        cookingChef.lastLocation ===
                        this.locations.boxingStationChef
                    ) {
                        cookingChefAction = {
                            function: cookingChef.move,
                            args: [cookingChef, this.locations.ovenCooking, 3],
                        }
                        chefActions.push(cookingChefAction)
                    }
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
