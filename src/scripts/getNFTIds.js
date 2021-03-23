import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function IsiInitialized(address) {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Hyptokens from 0x0778a2af92b53a14

      // This script returns an array of all the NFT IDs in an account's collection.

      pub fun main(address: Address): [UInt64] {
          let account = getAccount(address)

          let collectionRef = account.getCapability(Hyptokens.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()
              ?? panic("Could not borrow capability from public collection")

          return collectionRef.getIDs()
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

export default IsiInitialized
