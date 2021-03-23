import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function GetBalance(address) {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.script`
      import FungibleToken from 0x9a0766d93b6608b7
      import FlowToken from 0x7e60df042a9c0868
      pub fun main(address: Address): UFix64 {
          let account = getAccount(address)
          let unlockedVault = account
            .getCapability(/public/flowTokenBalance)!
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
              ?? panic("Could not borrow Balance reference to the Vault")
          let unlockedBalance = unlockedVault.balance

          return unlockedBalance
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

export default GetBalance
