import React, {Fragment, Component} from 'react';
import {isEmpty, omit} from 'lodash';
import moment from 'moment';
import axios from 'axios';
import { Dropdown } from "semantic-ui-react";
import './App.css';
import Navbar from './components/Navbar';
import Cards from './components/Cards';
import Spinner from './components/Spinner';
import PageNotFound from './components/PageNotFound';
import WorldDataCharts from './components/WorldDataCharts';
import {deafultBarChartOptionsObj, defaultDonutOptions} from './utils/helper';
import CountrySpecificCharts from './components/CountrySpecificCharts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: {},
      countryDayWise: [],
      globalData: {},
      countries: [],
      selectedCountry: '',
      euCountries: [],
      americas: [],
      asiaPacific: [],
      isLoading: true,
      error: {},
      totalCountryData: {},
      overallBarChartOptions: {...deafultBarChartOptionsObj},
      overallBarChartSeries: [],
      overallDontOptions: {...defaultDonutOptions},
      overallDonutSeries: [],
      countryTotalBarChartOptions: {...deafultBarChartOptionsObj},
      countryTotalBarChartSeries: [],
      countryTotalDontOptions: {...defaultDonutOptions},
      countryTotalDonutSeries: []
    }
  }

  getWorldSummaryData = () => {
    axios.get(`https://api.covid19api.com/summary`)
      .then(res => {
        const summary = res.data;
        const globalData = summary && summary.Global;
        const omitNewData = omit(globalData, ['NewConfirmed', 'NewDeaths', 'NewRecovered']);
        const countries = summary && summary.Countries;
        this.setState({ summary, globalData, countries, isLoading: false, error: {},
            overallBarChartOptions: {
              ...this.state.overallBarChartOptions,
              xaxis: {
                ...this.state.overallBarChartOptions.xaxis,
                categories: Object.keys(omitNewData)
              }
            },
            overallBarChartSeries: [{ data: Object.values(omitNewData) }],
            overallDonutSeries: Object.values(omitNewData)
        });
      })
      .catch(err => {
        this.setState({ isLoading: false, error: err });
      })
  };

  getCountrySpecificData = (country) => {
    axios.get(`https://api.covid19api.com/total/country/${country}`)
      .then(res => {
        const countryDayWise = res.data;
        const lastObj = countryDayWise[countryDayWise.length - 1];
        const totalCountryData = !isEmpty(lastObj) ? {
          TotalConfirmed: lastObj.Confirmed,
          Active: lastObj.Active,
          TotalDeaths: lastObj.Deaths,
          Recovered: lastObj.Recovered
        } : {};
        this.setState({ countryDayWise, totalCountryData, isLoading: false, error: {},
          countryTotalBarChartOptions: {
            ...this.state.countryTotalBarChartOptions,
            xaxis: {
              ...this.state.countryTotalBarChartOptions.xaxis,
              categories: Object.keys(totalCountryData)
            }
          },
          countryTotalBarChartSeries: [{ data: Object.values(totalCountryData) }],
          countryTotalDonutSeries: Object.values(totalCountryData)
        });
      })
      .catch(err => {
        this.setState({ isLoading: false, error: err });
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
    this.setState({ selectedCountry: value.toUpperCase(), isLoading: true, summary: {}, globalData:{},
      countryDayWise: [], totalCountryData:{} });
    if (value === 'World') { 
      this.getWorldSummaryData();
    } else {
      this.getCountrySpecificData(value);
    }
  }
  
  render() {
    const {globalData, countries, selectedCountry, totalCountryData, isLoading, error} = this.state;
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
          {isLoading ?
            <Spinner /> :
              ((!isEmpty(globalData) || !isEmpty(totalCountryData)) && isEmpty(error) ?
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
          {!isEmpty(globalData) ?
            <WorldDataCharts
              overallBarChartOptions={this.state.overallBarChartOptions}
              overallBarChartSeries={this.state.overallBarChartSeries}
              overallDontOptions={this.state.overallDontOptions}
              overallDonutSeries={this.state.overallDonutSeries}
            /> : null
          }
          {!isEmpty(totalCountryData) ?
            <CountrySpecificCharts
              selectedCountry={selectedCountry}
              countryTotalBarChartOptions={this.state.countryTotalBarChartOptions}
              countryTotalBarChartSeries={this.state.countryTotalBarChartSeries}
              countryTotalDontOptions={this.state.countryTotalDontOptions}
              countryTotalDonutSeries={this.state.countryTotalDonutSeries}
            /> : null
          }
        </section>
      </Fragment>
    );
  }
}

export default App;
