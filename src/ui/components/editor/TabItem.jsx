import React from 'react';
import PropTypes from 'prop-types';

const TabItem = ({ children, loading, active, type, alwaysRendered }) => {
    if (['top', 'bottom'].indexOf(type) !== -1) {
        return (
            (active || alwaysRendered) && (
                <div
                    className={`ui ${
                        type === 'top' ? 'bottom' : 'top'
                    } tab basic segment${active ? ' active' : ''}${
                        loading ? ' loading' : ''
                    }`}
                    style={{ height: '100%', margin: '0', padding: '0' }}
                >
                    {children}
                </div>
            )
        );
    }
    return (
        (active || alwaysRendered) && (
            <React.Fragment>{children}</React.Fragment>
        )
    );
};

TabItem.defaultProps = {
    loading: false,
    active: false,
    type: 'top',
    alwaysRendered: false,
};

TabItem.propTypes = {
    children: PropTypes.node,
    loading: PropTypes.bool,
    active: PropTypes.bool,
    alwaysRendered: PropTypes.bool,
    type: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

export default TabItem;
