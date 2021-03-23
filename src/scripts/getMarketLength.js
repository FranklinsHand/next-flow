import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function GetMarketLength(address, marketCollectionAddress) {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.script`
      import HyptokensMarket from 0x0778a2af92b53a14

      // This script returns the size of an account's SaleOffer collection.

      pub fun main(account: Address, marketCollectionAddress: Address): Int {
          let acct = getAccount(account)
          let marketCollectionRef = getAccount(marketCollectionAddress)
              .getCapability<&HyptokensMarket.Collection{HyptokensMarket.CollectionPublic}>(
                   HyptokensMarket.CollectionPublicPath
              )
              .borrow()
              ?? panic("Could not borrow market collection from market address")

          return marketCollectionRef.getSaleOfferIDs().length
      }
      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(address, t.Address),
        fcl.arg(marketCollectionAddress, t.Address)
      ]),
    ])
  //decode the response from the server
  const data = await fcl.decode(response)
  console.log("Market Length", data)
}

export default GetMarketLength
