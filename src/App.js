import React, {Fragment, Component} from 'react';
import {isEmpty} from 'lodash';
import axios from 'axios';
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
      selectBoxValue: {}
    }
  }

  componentDidMount() {
    axios.get(`https://api.covid19api.com/summary`)
      .then(res => {
        const summary = res.data;
        const globalData = summary && summary.Global;
        this.setState({ summary, globalData, isSummaryLoaded: true, summaryError: {} });
      })
      .catch(err => {
        this.setState({ isSummaryLoaded: false, summaryError: err });
      })
  }
  
  render() {
    const {globalData, isSummaryLoaded, summaryError} = this.state;
    return (
      <Fragment>
        <Navbar />
        <section className="container">
          {isSummaryLoaded && globalData && isEmpty(summaryError) ?
            <Cards data={globalData} lastUpdated="today" />
            : (!isEmpty(summaryError) ? <PageNotFound /> : <Spinner />)
          }
        </section>
      </Fragment>
    );
  }
}

export default App;
