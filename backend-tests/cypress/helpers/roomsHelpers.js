const faker = require('faker')

const ENDPOINT_GET_ALL_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_POST_NEW_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM = 'http://localhost:3000/api/room/'

function createRandomRoom(){

    const fakeRoomNumber = faker.random.number(1000)
    const fakePrice = faker.random.number(10000)
    const fakeFloorNumber = faker.random.number(9)

    //Array for Category
    const roomCategoryArray = ["Double", "Single", "Twin"]
    //Array for Features
    const roomFeaturesArray = ["Balcony", "Sea View", "Ensuite", "Penthouse"]
    //Array for Availability
    const availabilityArray = ["true", "false"]

    const roomCategory = Math.floor(Math.random()*roomCategoryArray.length)
    const roomFeatures = Math.floor(Math.random()*roomFeaturesArray.length)
    const availability = Math.floor(Math.random()*availabilityArray.length)

    const roomChoice = {
        "category":roomCategory,
        "number":fakeRoomNumber,
        "floor":fakeFloorNumber,
        "available":availability,
        "price":fakePrice,
        "features":roomFeatures
    }
    return roomChoice   
}
function getRequestAllRoomsWithAssertion(cy, category, number, floor, available, price, features){
    //Get request to fetch all rooms
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(category)
        expect(responseAsString).to.have.string(number)
        expect(responseAsString).to.have.string(floor)
        expect(responseAsString).to.have.string(available)
        expect(responseAsString).to.have.string(price)
        expect(responseAsString).to.have.string(features)

        cy.log(response.body[response.body.length-1].id)
        cy.log(response.body.length)
    }))

}

function getAllRoomsRequest(cy){
    cy.authenticateSession().then((response =>{

        //Get request to fetch all rooms
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ALL_ROOMS,
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


function deleteRoomRequestAfterGet(){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },

    }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_ROOM+lastId,
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

function createNewRoomRequest(cy){
    cy.authenticateSession().then((response =>{
        let roomChoice = createRandomRoom()

        //Post request ro create a room
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_NEW_ROOM,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:roomChoice
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(roomChoice.number)
        }))

        //Get request to fetch list with all rooms
        getRequestAllRoomsWithAssertion(cy, roomChoice.category, roomChoice.floor,
                                            roomChoice.number, roomChoice.available,
                                            roomChoice.price, roomChoice.features)
    }))
}

function createRoomRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        let fakeRoom = createRandomRoom()

        //Post request to create a room
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_NEW_ROOM,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeRoom
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeRoom.number)
        }))

        //Delete a room
        deleteRoomRequestAfterGet(cy)
    }))
}

module.exports = {
    createRandomRoom,
    createNewRoomRequest,
    getAllRoomsRequest,
    createRoomRequestAndDelete
}


