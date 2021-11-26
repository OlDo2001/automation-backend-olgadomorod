
const faker = require('faker')

const ENDPOINT_GET_ALL_BILLS = 'http://localhost:3000/api/bills'
const ENDPOINT_POST_NEW_BILL = 'http://localhost:3000/api/bill/new'
const ENDPOINT_GET_BILL = 'http://localhost:3000/api/bill/'

function createRandomBillUnique(){

    const fakeValue = faker.random.number({min:800, max:3000})
    //Array for paid
    const paidArray = ["true", "false"]
    const paid = Math.floor(Math.random()*paidArray.length)

    const value = {
        "value":fakeValue,
        "paid":paid
    }
    return value   
}
function getRequestAllBillsWithAssertion(cy, value, paid){
    //Get request to fetch all bills
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_BILLS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(value)
        expect(responseAsString).to.have.string(paid)

        cy.log(response.body[response.body.length-1].id)
        cy.log(response.body.length)
    }))

}

function getAllBillsRequest(cy){
    cy.authenticateSession().then((response =>{

        //Get request to fetch all bills
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ALL_BILLS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            cy.log(responseAsString)
     
        }))

    }))
}


function deleteBillRequestAfterGet(){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_BILLS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },

    }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_BILL+lastId,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response.body)
            cy.log(responseAsString)
            expect(responseAsString).to.have.string('true')
        }))
    }))
}

function createBillRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeBillValue = createRandomBillUnique()

        //Post request ro create a bill
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_NEW_BILL,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeBillValue
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeBillValue.value)
        }))

        //Get request to fetch all bills
        getRequestAllBillsWithAssertion(cy, fakeBillValue.value, fakeBillValue.paid)
    }))
}

function createBillRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        let fakeBillValue = createRandomBillUnique()

        //Post request ro create a bill
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_NEW_BILL,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeBillValue
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeBillValue.value)
        }))

        //Delete a bill
        deleteBillRequestAfterGet(cy)
    }))
}

module.exports = {
    createRandomBillUnique,
    createBillRequest,
    getAllBillsRequest,
    createBillRequestAndDelete
}


