import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function BuyHyptokenFromAddress(saleItemID, marketCollectionAddress) {
  const response = await fcl
  .send([
      fcl.transaction`
      import Hyptokens from 0x0778a2af92b53a14
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import HyptokensMarket from 0x0778a2af92b53a14
      import FungibleToken from 0x9a0766d93b6608b7
      import FlowToken from 0x7e60df042a9c0868

      transaction(saleItemID: UInt64, marketCollectionAddress: Address) {
          let paymentVault: @FungibleToken.Vault
          let HyptokensCollection: &Hyptokens.Collection{NonFungibleToken.Receiver}
          let marketCollection: &HyptokensMarket.Collection{HyptokensMarket.CollectionPublic}

          prepare(signer: AuthAccount) {
              self.marketCollection = getAccount(marketCollectionAddress)
                  .getCapability<&HyptokensMarket.Collection{HyptokensMarket.CollectionPublic}>(
                      HyptokensMarket.CollectionPublicPath
                  )!
                  .borrow()
                  ?? panic("Could not borrow market collection from market address")

              let saleItem = self.marketCollection.borrowSaleItem(saleItemID: saleItemID)
                          ?? panic("No item with that ID")
              let price = saleItem.salePrice

              let mainFlowVault = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                  ?? panic("Cannot borrow Kibble vault from acct storage")
              self.paymentVault <- mainFlowVault.withdraw(amount: price)

              self.HyptokensCollection = signer.borrow<&Hyptokens.Collection{NonFungibleToken.Receiver}>(
                  from: Hyptokens.CollectionStoragePath
              ) ?? panic("Cannot borrow Hyptokens collection receiver from acct")
          }

          execute {
              self.marketCollection.purchase(
                  saleItemID: saleItemID,
                  buyerCollection: self.HyptokensCollection,
                  buyerPayment: <- self.paymentVault
              )
          }
      }

      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(saleItemID, t.UInt64),
        fcl.arg(marketCollectionAddress, t.Address)
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

export default BuyHyptokenFromAddress
