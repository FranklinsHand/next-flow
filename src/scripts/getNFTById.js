import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function IsiInitialized(address, itemID) {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Hyptokens from 0x0778a2af92b53a14

      // This script returns the metadata for an NFT in an account's collection.

      pub fun main(address: Address, itemID: UInt64): &Hyptokens.NFT {

          // get the public account object for the token owner
          let owner = getAccount(address)

          let collectionBorrow = owner.getCapability(Hyptokens.CollectionPublicPath)
              .borrow<&{Hyptokens.HyptokensCollectionPublic}>()
              ?? panic("Could not borrow KittyItemsCollectionPublic")

          // borrow a reference to a specific NFT in the collection
          let Hyptoken = collectionBorrow.borrowHyptoken(id: itemID)
              ?? panic("No such itemID in that collection")

          return Hyptoken
      }
      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(address, t.Address),
        fcl.arg(itemID, t.UInt64)
      ]),
    ])
  //decode the response from the server
  const data = await fcl.decode(response)
  return data
}

export default IsiInitialized
