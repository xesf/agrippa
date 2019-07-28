import React from 'react';
import { Input } from 'semantic-ui-react';

const PropertiesAnnotation = ({ annotations, style }) =>
    (Object.keys(annotations).map(key =>
        (
            <Input
                key={`${key}${annotations[key]}`}
                size="mini"
                label={key}
                placeholder={key}
                defaultValue={annotations[key]}
                style={style}
            />
        )
    ));

export default PropertiesAnnotation;
