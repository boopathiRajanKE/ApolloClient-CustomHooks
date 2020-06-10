import * as React from "react"
import "./styles.scss"
import "./fonts.scss"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"
import { MainComponent } from "./components/ContinentsList"

const continentsAPI = new ApolloClient({
  uri: "https://countries.trevorblades.com/",
})

function App(props) {
  return (
    <ApolloProvider client={continentsAPI}>
      <div className={"sl_main_wrapper"}>
        <MainComponent />
      </div>
    </ApolloProvider>
  )
}
export default App
export { App }
