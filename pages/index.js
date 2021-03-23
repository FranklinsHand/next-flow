import React from "react"
import {AuthCluster} from "./../src/components/auth-cluster"
import Math from './../src/scripts/math'
import Minter from './../src/components/minter.js'
import InitializeAccount from "./../src/components/initializeAccount"
import CreateSaleOffer from './../src/components/createSaleOffer'
import RemoveFromMarket from './../src/components/removeFromMarket'
import BuyHyptoken from './../src/components/buyHyptoken'
import GetMarketByAddress from './../src/components/getMarketByAddress'
import GetNFTsByAddress from './../src/components/getNFTsByAddress'

export default function App() {
  return (
    <div>
      <AuthCluster />
      <h2>Alex's Market</h2>
      <GetMarketByAddress user={"0x0778a2af92b53a14"} />
      <h2>Alex's Collection</h2>
      <GetNFTsByAddress user={"0x0778a2af92b53a14"} />
      <Minter />
      <CreateSaleOffer />
      <RemoveFromMarket />
      <BuyHyptoken />
    </div>
  )
}
