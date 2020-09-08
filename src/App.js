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
      byCountryData: [],
      globalData: {},
      countries: [],
      isSummaryLoaded: false,
      summaryError: {},
      isCountryDataLoaded: false,
      selectBoxValue: {},
      countryChoosen: false
    }
  }

  componentDidMount() {
    axios.get(`https://api.covid19api.com/summary`)
      .then(res => {
        const summary = res.data;
        const globalData = summary && summary.Global;
        const countries = summary && summary.Countries;
        this.setState({ summary, globalData, countries, isSummaryLoaded: true, summaryError: {} });
      })
      .catch(err => {
        this.setState({ isSummaryLoaded: false, summaryError: err });
      })
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
  }
  
  render() {
    const {countryChoosen, summary, globalData, countries, isSummaryLoaded, summaryError} = this.state;
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
            />
          }
          {!countryChoosen && isSummaryLoaded && globalData && isEmpty(summaryError) ?
            <Fragment>
              <Cards data={globalData} />
              <small className="mx">
                <strong>Last Updated:</strong> {moment(summary.Countries[0].Date).format('DD.MM.YYYY HH:mm')}
              </small>
            </Fragment>
            : (!isEmpty(summaryError) ? <PageNotFound /> : <Spinner />)
          }
        </section>
      </Fragment>
    );
  }
}

export default App;
