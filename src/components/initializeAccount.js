import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import InitializeAccount from './../scripts/initializeAccount'

export default function InitAccount() {
    return (
      <div>
        <button onClick={InitializeAccount}>Intitialize Account</button>
      </div>
    )
}
