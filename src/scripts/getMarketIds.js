import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function GetMarketIds(address) {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.script`
      import HyptokensMarket from 0x0778a2af92b53a14

      // This script returns an array of all the NFT IDs in an account's collection.

      pub fun main(address: Address): [UInt64] {
          let account = getAccount(address)

          let collectionRef = account.getCapability<&HyptokensMarket.Collection{HyptokensMarket.CollectionPublic}>(HyptokensMarket.CollectionPublicPath).borrow()
              ?? panic("Could not borrow capability from public collection")

          return collectionRef.getSaleOfferIDs()
      }
      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(address, t.Address)
      ]),
    ])
  //decode the response from the server
  const data = await fcl.decode(response)
  return data
}

export default GetMarketIds
