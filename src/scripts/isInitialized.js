import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function IsiInitialized(address) {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.script`
      import FlowToken from 0x7e60df042a9c0868
      import Hyptokens from 0x0778a2af92b53a14
      import FungibleToken from 0x9a0766d93b6608b7
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import HyptokensMarket from 0x0778a2af92b53a14


      pub fun hasHyptokens(_ address: Address): Bool {
          let receiver: Bool = getAccount(address)
              .getCapability<&Hyptokens.Collection{NonFungibleToken.CollectionPublic}>(Hyptokens.CollectionPublicPath)
              .check()
          return receiver
      }

      pub fun hasHyptokensMarket(_ address: Address): Bool {
      return getAccount(address)
        .getCapability<&HyptokensMarket.Collection{HyptokensMarket.CollectionPublic}>(HyptokensMarket.CollectionPublicPath)
        .check()
      }

      pub fun main(address: Address): {String: Bool} {
        let ret: {String: Bool} = {}
        ret["Hyptokens"] = hasHyptokens(address)
        ret["HyptokensMarket"] = hasHyptokensMarket(address)
        return ret
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
  console.log(data)
  return data
}

export default IsiInitialized
