import {
    AppBar, Typography,
    Toolbar as MatToolbar,
    IconButton,
} from '@material-ui/core'
import { ArrowBack, ArrowLeftRounded, KeyboardArrowLeft } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import _css from './Toolbar.module.scss'
import {
    useRouter,
} from 'next/router'

export interface IToolbarProps {
    title: string,
    sub_title: string,
}

const Toolbar: React.FC<IToolbarProps> = ({
    title, sub_title,
}) => {
    const router = useRouter()
    const handleBack = _ => {
        router.back()
    }

    return (
        <AppBar position="static">
            <MatToolbar className={_css.toolbar}>
                <IconButton
                    className={_css.icon_back}
                    onClick={handleBack}
                >
                    <ArrowBack />
                </IconButton>
                {/* <Typography className={_css.title} variant="h5" noWrap>
                    {title}
                </Typography> */}
                <Typography className={_css.title} variant="h5" noWrap>
                    {title}
                </Typography>
                <Typography className={_css.sub_title} variant="h5" noWrap>
                    {sub_title}
                </Typography>

            </MatToolbar>
        </AppBar>
    )
}

export {
    Toolbar,
}   