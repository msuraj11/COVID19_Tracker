import React, {Fragment} from 'react';
import notFound from '../images/notFound.gif';

export default () => {
    return <Fragment>
        <h1 className='text-center text-primary'>Oops...!! Something went wrong or the data not found.</h1>
        <img 
            src={notFound}
            style={{ width: '50%', margin: 'auto', display: 'block' }}
            alt='404-not-found'
        />
    </Fragment>;
};
