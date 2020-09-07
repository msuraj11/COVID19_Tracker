import React from 'react';
import {map, startCase} from 'lodash';

const Card = props => {
    const {data, lastUpdated} = props;
    return map(data, (item, key) => {
            return (
                <div className={`card-data ${key}`}>
                    <h3>{startCase(key)}</h3>
                    <h2>{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(item)}</h2>
                    <small>{lastUpdated}</small>
                </div>
            )
        });
};

export default Card;
