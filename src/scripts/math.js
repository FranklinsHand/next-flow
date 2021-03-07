import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function Math() {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.script`
      //import the contract from the address
        import math from 0x0778a2af92b53a14
      //call the correct fucntion
        pub fun main(a: Int, b: Int): Int {
          return math.add(a: a, b: b)
        }
      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(5, t.Int), // a
        fcl.arg(4, t.Int), // b
      ]),
    ])
  //decode the response from the server
  const data = await fcl.decode(response)
  console.log(data)
}

export default Math
