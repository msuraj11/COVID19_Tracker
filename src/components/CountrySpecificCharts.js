import React, { Fragment } from 'react';
import Charts from 'react-apexcharts';

const CountrySpecificCharts = ({countryTotalBarChartOptions, countryTotalBarChartSeries,
    countryTotalDontOptions, countryTotalDonutSeries, selectedCountry,
    CountryTimeSeriesChartOptions, CountryTimeSeriesChartSeries}) => {
    return (
        <Fragment>
            <h3  className="mx py-1"> {`${selectedCountry}'s overall status`}</h3>
            <div className="charts">
                <Charts 
                    options={countryTotalBarChartOptions}
                    series={countryTotalBarChartSeries}
                    type="bar"
                    height={330}
                    width={700}
                />
                <Charts
                    options={countryTotalDontOptions}
                    series={countryTotalDonutSeries}
                    type="donut"
                    height={330}
                    width={700}
                />
            </div>
            <div className="charts">
                <Charts
                    options={CountryTimeSeriesChartOptions}
                    series={CountryTimeSeriesChartSeries}
                    type="area"
                    height={350}
                />
            </div>
        </Fragment>
    )
};

export default CountrySpecificCharts;
