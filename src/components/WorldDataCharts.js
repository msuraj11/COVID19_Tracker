import React, { Fragment } from 'react';
import Charts from 'react-apexcharts';

const WorldDataCharts = ({overallBarChartOptions, overallBarChartSeries,
    overallDontOptions, overallDonutSeries}) => {
    return (
        <Fragment>
            <h3  className="mx py-1">Overall status</h3>
            <div className="charts">
                <Charts 
                    options={overallBarChartOptions}
                    series={overallBarChartSeries}
                    type="bar"
                    height={330}
                    width={700}
                />
                <Charts
                    options={overallDontOptions}
                    series={overallDonutSeries}
                    type="donut"
                    height={330}
                    width={700}
                />
            </div>
        </Fragment>
    )
};

export default WorldDataCharts;
