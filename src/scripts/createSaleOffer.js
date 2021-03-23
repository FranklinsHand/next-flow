import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function createSaleOffer(saleItemID, saleItemPrice) {
  const response = await fcl
  .send([
      fcl.transaction`
      import Hyptokens from 0x0778a2af92b53a14
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import HyptokensMarket from 0x0778a2af92b53a14
      import FungibleToken from 0x9a0766d93b6608b7
      import FlowToken from 0x7e60df042a9c0868

      transaction(saleItemID: UInt64, saleItemPrice: UFix64) {
          let flowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
          let HyptokensCollection: Capability<&Hyptokens.Collection{NonFungibleToken.Provider}>
          let marketCollection: &HyptokensMarket.Collection

          prepare(signer: AuthAccount) {
              // we need a provider capability, but one is not provided by default so we create one.
              let HyptokensCollectionProviderPrivatePath = /private/HyptokensCollectionProvider

              let ReceiverPublicPath = /public/flowTokenReceiver

              self.flowVault = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(ReceiverPublicPath)
              assert(self.flowVault.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")

              if !signer.getCapability<&Hyptokens.Collection{NonFungibleToken.Provider}>(HyptokensCollectionProviderPrivatePath).check() {
                  signer.link<&Hyptokens.Collection{NonFungibleToken.Provider}>(HyptokensCollectionProviderPrivatePath, target: Hyptokens.CollectionStoragePath)
              }

              self.HyptokensCollection = signer.getCapability<&Hyptokens.Collection{NonFungibleToken.Provider}>(HyptokensCollectionProviderPrivatePath)
              assert(self.HyptokensCollection.borrow() != nil, message: "Missing or mis-typed HyptokensCollection provider")

              self.marketCollection = signer.borrow<&HyptokensMarket.Collection>(from: HyptokensMarket.CollectionStoragePath)
                  ?? panic("Missing or mis-typed HyptokensMarket Collection")
          }

          execute {
              let offer <- HyptokensMarket.createSaleOffer (
                  sellerItemProvider: self.HyptokensCollection,
                  saleItemID: saleItemID,
                  sellerPaymentReceiver: self.flowVault,
                  salePrice: saleItemPrice
              )
              self.marketCollection.insert(offer: <-offer)
          }
      }

      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(saleItemID, t.UInt64),
        fcl.arg(saleItemPrice, t.UFix64)
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

export default createSaleOffer
