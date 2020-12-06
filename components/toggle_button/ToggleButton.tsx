import React from 'react';
import _css from './ToggleButton.module.scss'
import MatToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { CircularProgress, Typography } from '@material-ui/core';
import {
    STRING_ALL, STRING_CLOSED,
    STRING_OPEN, STRING_PULL_REQUEST,
} from 'app_constants'

export interface IToggleButtonProps {
    readonly setFilter: (_: string) => void;
    readonly loading: boolean;
}

const ToggleButton: React.FC<IToggleButtonProps> = ({
    setFilter,
    loading,
}) => {
    const [view, setView] = React.useState(STRING_ALL);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        nextView: string,
    ) => {
        setView(nextView);
        setFilter(nextView);
    };

    const buttons = [
        {
            title: 'all',
            value: STRING_ALL,
        },
        {
            title: 'Open',
            value: STRING_OPEN,
        },
        {
            title: 'Closed',
            value: STRING_CLOSED,
        },
    ]

    return (
        <ToggleButtonGroup
            orientation="horizontal"
            className={_css.toggle_button}
            value={view} exclusive
            onChange={handleChange}
        >
            {buttons.map(_ => (
                <MatToggleButton
                    value={_.value}
                    aria-label={_.value}
                >
                    {_.title}
                    {
                        loading && view === _.value && (
                            <CircularProgress size={14} />
                        )
                    }
                </MatToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export { ToggleButton };