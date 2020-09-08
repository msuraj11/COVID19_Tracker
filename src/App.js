import React, {Fragment, Component} from 'react';
import {isEmpty} from 'lodash';
import moment from 'moment';
import axios from 'axios';
import { Dropdown } from "semantic-ui-react";
import './App.css';
import Navbar from './components/Navbar';
import Cards from './components/Cards';
import Spinner from './components/Spinner';
import PageNotFound from './components/PageNotFound';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: {},
      countryDayWise: [],
      globalData: {},
      countries: [],
      isLodaing: true,
      error: {},
      totalCountryData: {}
    }
  }

  getWorldSummaryData = () => {
    axios.get(`https://api.covid19api.com/summary`)
      .then(res => {
        const summary = res.data;
        const globalData = summary && summary.Global;
        const countries = summary && summary.Countries;
        this.setState({ summary, globalData, countries, isLodaing: false, error: {} });
      })
      .catch(err => {
        this.setState({ isLodaing: false, error: err });
      })
  };

  getCountrySpecificData = (country) => {
    axios.get(`https://api.covid19api.com/total/country/${country}`)
      .then(res => {
        console.log(res.data);
        const countryDayWise = res.data;
        const lastObj = countryDayWise[countryDayWise.length - 1];
        const totalCountryData = !isEmpty(lastObj) ? {
          TotalConfirmed: lastObj.Confirmed,
          Active: lastObj.Active,
          TotalDeaths: lastObj.Deaths,
          Recovered: lastObj.Recovered
        } : {};
        this.setState({ countryDayWise, totalCountryData, isLodaing: false, error: {} });
      })
      .catch(err => {
        this.setState({ isLodaing: false, error: err });
      })
  }

  componentDidMount() {
    this.getWorldSummaryData();
  }

  getCountryOptions = (countries) => {
    const updatedCountriesList = countries.map(obj => ({
      flag: obj.CountryCode.toLowerCase(),
      value: obj.Slug,
      text: obj.Country,
      key: obj.CountryCode
    }));
    updatedCountriesList.unshift({icon: 'world', value: 'World', text: 'World', key: 0});
    return updatedCountriesList;
  };

  dropDownChangeHandler = (e, {value}) => {
    console.log(value);
    //this.setState({ isLodaing: true });
    this.setState({ isLodaing: true, summary: {}, globalData:{}, countryDayWise: [], totalCountryData:{} });
    if (value === 'World') { 
      this.getWorldSummaryData();
    } else {
      this.getCountrySpecificData(value);
    }
  }
  
  render() {
    const {globalData, countries, totalCountryData, isLodaing, error} = this.state;
    return (
      <Fragment>
        <Navbar />
        <section className="container">
          {!isEmpty(countries) &&
            <Dropdown
              placeholder="Select Country / World"
              fluid
              search
              selection
              options={this.getCountryOptions(countries)}
              onChange={this.dropDownChangeHandler}
            />
          }
          {isLodaing ?
            <Spinner /> : ((!isEmpty(globalData) || !isEmpty(totalCountryData)) && isEmpty(error) ?
              <Fragment>
                <Cards data={!isEmpty(globalData) ? globalData : totalCountryData} />
                <div className="m">
                  <strong>Last Updated:</strong>
                  {moment(countries[0].Date).format('DD.MM.YYYY HH:mm')}
                </div>
              </Fragment>
              :
              <PageNotFound />
            )
          }
        </section>
      </Fragment>
    );
  }
}

export default App;
