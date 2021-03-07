import React from "react"
import {AuthCluster} from "./../src/auth-cluster"
import Math from './../src/scripts/math'

export default function App() {
  Math()
  return (
    <div>
      <AuthCluster />
    </div>
  )
}
