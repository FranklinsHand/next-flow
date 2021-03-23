import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function RemoveFromMarket(saleItemID) {
  const response = await fcl
  .send([
      fcl.transaction`
      import HyptokensMarket from 0x0778a2af92b53a14

      transaction(saleItemID: UInt64) {
          let marketCollection: &HyptokensMarket.Collection

          prepare(signer: AuthAccount) {
              self.marketCollection = signer.borrow<&HyptokensMarket.Collection>(from: HyptokensMarket.CollectionStoragePath)
                  ?? panic("Missing or mis-typed HyptokensMarket Collection")
          }

          execute {
              let offer <-self.marketCollection.remove(saleItemID: saleItemID)
              destroy offer
          }
      }

      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(saleItemID, t.UInt64)
      ]),
      fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(100), // set the compute limit
    ])
  //decode the response from the server
  .then(fcl.decode)
  console.log(fcl.tx(response).onceSealed())
}

export default RemoveFromMarket
