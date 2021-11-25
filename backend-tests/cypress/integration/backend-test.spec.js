
import * as clientHelpers from '../helpers/clientHelpers.js'


describe('Testing auth', function(){
    
    it ('Create a new client', function(){
        clientHelpers.createClientRequest(cy)
    })

    it ('Get list with all clients', function(){
        clientHelpers.getAllClientsRequest(cy)
    })
    it ('Create a client and delete it', function(){
        clientHelpers.createClientRequestAndDelete(cy)
    })
})

