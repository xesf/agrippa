import React from 'react';
import PropTypes from 'prop-types';

import TabItem from './TabItem';

class Tab extends React.Component {
    constructor(props) {
        super(props);
        const itemActive = (Array.isArray(this.props.children)
            ? this.props.children
            : [this.props.children]
        ).indexOf(c => c.active === true);
        this.state = {
            selectedTabIndex:
                itemActive !== -1
                    ? itemActive
                    : props.selectedTabIndex
                        ? props.selectedTabIndex
                        : 0,
        };
    }

    render() {
        const { type, alwaysRendered } = this.props;
        const labels = [];
        const children = React.Children.map(this.props.children, (child, i) => {
            const active = this.state.selectedTabIndex === i;
            labels.push({
                label: child.props.label,
                icon: child.props.icon,
                flag: child.props.flag,
                header: child.props.header,
                alwaysRendered,
                active,
            });
            return React.cloneElement(child, {
                active,
                alwaysRendered,
                type,
            });
        });
        const tabHeaders = labels.length > 0 && (
            <div
                className={`ui ${
                    ['top', 'bottom'].indexOf(type) !== -1
                        ? `${type} attached`
                        : type === 'left'
                            ? 'vertical fluid'
                            : 'vertical fluid right'
                } secondary menu inverted`}
            >
                {labels.map((l, i) => (
                    (!l.header) ? (
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a
                            key={l.label}
                            className={`item${l.active ? ' active' : ''}`}
                            onClick={() => {
                                this.setState({ selectedTabIndex: i });
                            }}
                            aria-label={`Tab ${l.label}`}
                        >
                            {l.flag && <i className={`${l.flag} flag`} />}
                            {l.icon && <i className={`${l.icon} icon`} />}
                            {l.label}
                        </a>
                    ) : (
                        <div key={l.label} className="header item">
                            {l.label}
                        </div>
                    )
                ))}
            </div>
        );
        switch (type) {
            default:
            case 'top':
                return (
                    <React.Fragment>
                        {tabHeaders}
                        {children}
                    </React.Fragment>
                );
            case 'bottom':
                return (
                    <React.Fragment>
                        {children}
                        {tabHeaders}
                    </React.Fragment>
                );
            case 'left':
                return (
                    <div className="ui grid two">
                        <div style={{ flex: '0 0 300px', paddingRight: '0.5em' }}>{tabHeaders}</div>
                        <div style={{ flex: '1', padding: '0px'}}>
                            {children}
                        </div>
                    </div>
                );
            case 'right':
                return (
                    <div className="ui grid two">
                        <div style={{ flex: '1', padding: '0px'}}>
                            {children}
                        </div>
                        <div style={{ flex: '0 0 300px', paddingLeft: '0.5em'}}>{tabHeaders}</div>
                    </div>
                );
        }
    }
}

Tab.defaultProps = {
    children: undefined,
    selectedTabIndex: undefined,
    type: 'top',
    alwaysRendered: false,
};

const tabChildTypes = PropTypes.shape({
    type: PropTypes.oneOf([TabItem]),
});

Tab.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(tabChildTypes),
        tabChildTypes,
    ]),
    selectedTabIndex: PropTypes.number,
    type: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    alwaysRendered: PropTypes.bool,
};

export default Tab;
