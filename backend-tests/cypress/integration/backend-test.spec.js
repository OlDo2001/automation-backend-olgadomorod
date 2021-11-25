
import * as clientHelpers from '../helpers/clientHelpers.js'
import * as billHelpers from '../helpers/billsHelpers.js'
import * as roomHelpers from '../helpers/roomsHelpers.js'

describe('Testing hotel page', function(){
    
    it ('Create a new client', function(){
        clientHelpers.createClientRequest(cy)
    })

    it ('Get list with all clients', function(){
        clientHelpers.getAllClientsRequest(cy)
    })
    it ('Create a client and delete it', function(){
        clientHelpers.createClientRequestAndDelete(cy)
    })
    it ('Create a new bill', function(){
        billHelpers.createBillRequest(cy)
    })
    it ('Get list with bills', function(){
        billHelpers.getAllBillsRequest(cy)
    })
    it ('Create a new bill and delete it', function(){
        billHelpers.createBillRequestAndDelete(cy)
    })
    it ('Create a new room', function(){
        roomHelpers.createNewRoomRequest(cy)
    })
    it ('Get list with all rooms', function(){
        roomHelpers.getAllRoomsRequest(cy)
    })
    it ('Create a new room and delete it', function(){
        roomHelpers.createRoomRequestAndDelete(cy)
    })

})

