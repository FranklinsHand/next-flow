import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function GetMarketIds(address, saleItemID) {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.script`
      import HyptokensMarket from 0x0778a2af92b53a14

      // This script returns an array of all the NFT IDs in an account's collection.

      pub fun main(address: Address, saleItemID: UInt64): {String: String} {
          let account = getAccount(address)

          let marketCollectionRef = account.getCapability<&HyptokensMarket.Collection{HyptokensMarket.CollectionPublic}>(HyptokensMarket.CollectionPublicPath).borrow()
              ?? panic("Could not borrow capability from public collection")

          let MarketItem = marketCollectionRef.borrowSaleItem(saleItemID: saleItemID)
            ?? panic("No such itemID in that collection")

          let price = MarketItem.salePrice
          let id = MarketItem.saleItemID
          let Item = {
              "id": id.toString(),
              "price": price.toString()
            }
          return Item
      }
      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(address, t.Address),
        fcl.arg(saleItemID, t.UInt64)
      ]),
    ])
  //decode the response from the server
  const data = await fcl.decode(response)
  return data
}

export default GetMarketIds
