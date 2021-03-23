import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
/*
transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&Hyptokens.Collection>(from: Hyptokens.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- Hyptokens.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: Hyptokens.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Hyptokens.Collection{NonFungibleToken.CollectionPublic, Hyptokens.HyptokensCollectionPublic}>
              (Hyptokens.CollectionPublicPath, target: Hyptokens.CollectionStoragePath)
        },
        if signer.brorrow<HyptokensMarket.Collection>(from HyptokensMarket.CollectionPublicPath) == nil {

          let collection <- HyptokensMarket.createEmptyCollection()

          signer.save(<-collection, to: HyptokensMarket.CollectionStoragePath)

          signer.link<&Hyptokens.Collection{HyptokensMarket.HyptokensCollectionPublic}>
            (HyptokensMarket.CollectionPublicPath, target: HyptokensMarket.CollectionStoragePath)
        }
      }
    }
}
*/
async function InitializeAccount() {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.transaction`
      import Hyptokens from 0x0778a2af92b53a14
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import HyptokensMarket from 0x0778a2af92b53a14

      // This transaction configures an account to hold Hyptokens.

      transaction {
          prepare(signer: AuthAccount) {
              // if the account doesn't already have a collection
              if signer.borrow<&Hyptokens.Collection>(from: Hyptokens.CollectionStoragePath) == nil {

                  // create a new empty collection
                  let collection <- Hyptokens.createEmptyCollection()

                  // save it to the account
                  signer.save(<-collection, to: Hyptokens.CollectionStoragePath)

                  // create a public capability for the collection
                  signer.link<&Hyptokens.Collection{NonFungibleToken.CollectionPublic, Hyptokens.HyptokensCollectionPublic}>
                    (Hyptokens.CollectionPublicPath, target: Hyptokens.CollectionStoragePath)
              }
              if signer.borrow<&HyptokensMarket.Collection>(from: HyptokensMarket.CollectionStoragePath) == nil {

                let collection <- HyptokensMarket.createEmptyCollection()

                signer.save(<-collection, to: HyptokensMarket.CollectionStoragePath)

                signer.link<&HyptokensMarket.Collection{HyptokensMarket.CollectionPublic}>
                  (HyptokensMarket.CollectionPublicPath, target: HyptokensMarket.CollectionStoragePath)
            }
          }
      }

      `,
        //we have to specify our arguments this way,
        //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
        fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
        fcl.proposer(fcl.authz), // current user acting as the nonce
        fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
        fcl.limit(35), // set the compute limit
    ])
  //decode the response from the server
  const data = await fcl.decode(response)
  return fcl.tx(data).onceSealed()
}

export default InitializeAccount
