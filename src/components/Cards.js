import React from 'react';
import {map, startCase} from 'lodash';

const Card = props => {
    const {data} = props;
    data.DeathRate = ((data.TotalDeaths/data.TotalConfirmed)*100).toFixed(2);
    return map(data, (item, key) => {
        const colorValue = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        return (
            <div className="card-data" key={key} style={{backgroundColor: colorValue, opacity: '0.9', color: 'white'}}>
                <h4>{startCase(key)}</h4>
                <h2>{key === 'DeathRate' ?
                    `${item} %` :
                    new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(item)}
                </h2>
            </div>
        )
    });
};

export default Card;
