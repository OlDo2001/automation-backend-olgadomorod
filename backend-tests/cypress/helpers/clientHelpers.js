
const faker = require('faker')

const ENDPOINT_GET_ALL_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_POST_NEW_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'

function createRandomClientPayload(){

    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakeTelephone = faker.phone.phoneNumber()

    const payload = {
        "name":fakeName,
        "email":fakeEmail,
        "telephone":fakeTelephone
    }
    return payload   
}
function getRequestAllClientsWithAssertion(cy, name, email, telephone){
    //Get request to fetch all clients
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)

        cy.log(response.body[response.body.length-1].id)
        cy.log(response.body.length)
    }))

}

function getAllClientsRequest(cy){
    cy.authenticateSession().then((response =>{

        //Get request to fetch all clients
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ALL_CLIENTS,
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


function deleteRequestAfterGet(){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },

    }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_CLIENT+lastId,
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

function createClientRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload()

        //Post request ro create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_NEW_CLIENT,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeClientPayload
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))

        //Get request to fetch all clients
        getRequestAllClientsWithAssertion(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)
    }))
}

function createClientRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload()

        //Post request ro create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_NEW_CLIENT,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeClientPayload
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))

        //Delete a client
        deleteRequestAfterGet(cy)
    }))
}

module.exports = {
    createRandomClientPayload,
    createClientRequest,
    getAllClientsRequest,
    createClientRequestAndDelete
}


