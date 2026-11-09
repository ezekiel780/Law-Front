import { Country, State, City } from 'country-state-city'

const countries = () => Country.getAllCountries()
const states = (countryCode) => State.getStatesOfCountry(countryCode)
const cities = (countryCode, stateCode) =>
  City.getCitiesOfState(countryCode, stateCode)

const data = {
  countries,
  states,
  cities,
}
export default data
