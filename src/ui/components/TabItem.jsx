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
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool,
    active: PropTypes.bool,
    alwaysRendered: PropTypes.bool,
    type: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

export default TabItem;
