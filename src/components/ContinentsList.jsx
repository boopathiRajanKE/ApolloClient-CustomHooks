import * as React from "react"
import { gql } from "apollo-boost"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"

function CountryList(props) {
  const { countryList = {}, setShowCountry = () => {} } = props

  const { continents: [continent = {}] = [] } = countryList

  const { name = "", countries = [] } = continent

  const renderCountryItem = (country, index) => {
    const { name = "" } = country
    return (
      <li key={`country_item_${index}`}>
        <div className="sl_country_item">{name}</div>
      </li>
    )
  }

  const onCloseClick = React.useCallback(() => {
    setShowCountry(false)
  }, [])

  return (
    <div className="sl_country_list_wrapper">
      <h1 className="sl_country_title">
        List of Countries in <strong>{name}</strong>
      </h1>
      <div className="sl_country_list_block">
        <ul>{countries.length > 0 && countries.map(renderCountryItem)}</ul>
        <div className="sl_close_element" onClick={onCloseClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            width="40px"
            height="40px"
            viewBox="0 0 357 357"
          >
            <g>
              <g id="close">
                <polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3     214.2,178.5   " />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

const continentsListQuery = gql`
  query Continent {
    continents {
      name
      code
    }
  }
`

function ContinentsList(props) {
  const {
    countryListData = {},
    getCountryName = () => {},
    setShowCountry = () => {},
  } = props

  const { loading, error, data: { continents = [] } = {} } = useQuery(
    continentsListQuery
  )

  const onContinentClick = (event) => {
    const continentCode =
      event.target &&
      event.target.parentNode &&
      event.target.parentNode.getAttribute("code")

    const { continents: [continent = {}] = [] } = countryListData

    const { code = "" } = continent

    if (code === continentCode) {
      setShowCountry(true)
    } else {
      getCountryName({ variables: { breed: continentCode } })
    }
  }

  if (error) return <p>Error :(</p>

  const renderContinentItem = (continent, index) => {
    const { name = "", code = "" } = continent
    return (
      <li key={`continent_item_${index}`} code={code}>
        <div className="sl_continent_item">{name}</div>
      </li>
    )
  }

  return (
    <div className="sl_continents_wrapper">
      <h1 className="sl_continents_title">List of continents</h1>
      {loading ? (
        <p className="sl_loading_element">Loading...</p>
      ) : (
        <ul onClick={onContinentClick}>
          {continents.length > 0 && continents.map(renderContinentItem)}
        </ul>
      )}
    </div>
  )
}

const countryListQuery = gql`
  query Country($breed: String!) {
    continents(filter: { code: { eq: $breed } }) {
      name
      code
      countries {
        name
        code
      }
    }
  }
`

function MainComponent() {
  const [showCountry, setShowCountry] = React.useState(false)

  const [
    getCountryName,
    { loading, data: countryListData = {} },
  ] = useLazyQuery(countryListQuery)

  React.useEffect(() => {
    if (JSON.stringify(countryListData) !== "{}") {
      setShowCountry(true)
    }
  }, [countryListData])

  return (
    <div className="sl_main_block">
      {!showCountry ? (
        <ContinentsList
          countryListData={countryListData}
          getCountryName={getCountryName}
          setShowCountry={setShowCountry}
        />
      ) : (
        <CountryList
          countryList={countryListData}
          setShowCountry={setShowCountry}
        />
      )}
    </div>
  )
}

export default ContinentsList
export { ContinentsList, CountryList, MainComponent }
