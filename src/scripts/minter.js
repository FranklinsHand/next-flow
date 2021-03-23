import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

async function Minter(recipient, name, creator, source, file) {
  const response = await fcl.send([
    //this is how we execute the blockchain script
      fcl.transaction`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Hyptokens from 0x0778a2af92b53a14

      // This transction uses the NFTMinter resource to mint a new NFT.
      //
      // It must be run with the account that has the minter resource
      // stored at path /storage/NFTMinter.

      transaction(recipient: Address, name: String, creator: String, source: String, file: String) {

          // local variable for storing the minter reference
          let minter: &Hyptokens.NFTMinter

          prepare(signer: AuthAccount) {

              // borrow a reference to the NFTMinter resource in storage
              self.minter = signer.borrow<&Hyptokens.NFTMinter>(from: Hyptokens.MinterStoragePath)
                  ?? panic("Could not borrow a reference to the NFT minter")
          }

          execute {
              // get the public account object for the recipient
              let recipient = getAccount(recipient)

              // borrow the recipient's public NFT collection reference
              let receiver = recipient
                  .getCapability(Hyptokens.CollectionPublicPath)
                  .borrow<&{NonFungibleToken.CollectionPublic}>()
                  ?? panic("Could not get receiver reference to the NFT Collection")

              // mint the NFT and deposit it to the recipient's collection
              self.minter.mintNFT(recipient: receiver,
                  name: name,
                  creator: creator,
                  source: source,
                  file: file)
          }
      }

      `,
      //we have to specify our arguments this way,
      //because technically the code above is Cadence, not js, so this allows us to pass in custom values through props
      fcl.args([
        fcl.arg(recipient, t.Address),
        fcl.arg(name, t.String),
        fcl.arg(creator, t.String),
        fcl.arg(source, t.String),
        fcl.arg(file, t.String)
      ]),
      fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(35), // set the compute limit
    ])
  //decode the response from the server
  const data = await fcl.decode(response)
  console.log(data)
}

export default Minter
