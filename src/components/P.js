import React, {Fragment} from 'react';

const P = (props) => {
    return(
            <Fragment>
                <p style={{color: "red", fontSize: 12}}>{props.errors}</p>
            </Fragment>
            );
}

export default P;
