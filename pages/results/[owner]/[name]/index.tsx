import React, {
    useCallback, useEffect, useRef, useState
} from 'react';
import classes from 'classnames'
import _css from './url.module.scss'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import Chip from '@material-ui/core/Chip';
import {
    ToggleButton,
    Toolbar,
} from 'components';
import {
    STRING_ALL, STRING_CLOSED,
    STRING_OPEN,
} from 'app_constants';
import { motion, AnimatePresence } from "framer-motion"
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

export interface IPageProps {

}
const PAGE_SIZE = 75
const GITHUB_REPO_ISSUES = gql`
query GetRepositoryIssues(
    $first:Int!,$name:String!, $owner:String!, 
    $after:String, $filter:String
    ) {
    repository(name:$name, owner:$owner) {
      createdAt
      issues(first: $first, after: $after, filterBy: {states: $filter}) {
        totalCount
        nodes {
          activeLockReason
          title
          body
          state
          id
          assignees(first: 2) {
            nodes {
              name
            }
          }
        }
        pageInfo {
            hasNextPage
            endCursor
          }
      }
    }
  }
`;


const ResultPage: React.FC<IPageProps> = () => {
    const { owner, name } = useRouter().query

    const [
        issues, setIssues
    ] = useState<any[]>([])
    const [
        endCursor, setEndCursor
    ] = useState<string>()
    const [
        filter, setFilter
    ] = useState<string>(STRING_ALL)
    const triggerRef = useRef<HTMLSpanElement>(null)

    const
        {
            loading, error, data, fetchMore,
            updateQuery,
        } = useQuery<any>(
            GITHUB_REPO_ISSUES,
            {
                variables: {
                    name,
                    owner,
                    // after: endsCursor,
                    first: PAGE_SIZE,
                    // after: "Y3Vyc29yOnYyOpHOAOV_oA==",
                }
            }
        );

    useEffect(() => {
        let paramfilter = filter === STRING_ALL ? undefined : filter
        if (!Boolean(data)) { return; }
        fetchMore({
            // query: GITHUB_REPO_ISSUES,
            variables: {
                name,
                owner,
                first: PAGE_SIZE,
                filter: paramfilter,
            },
            updateQuery: (prev: any, { fetchMoreResult }) => {
                setIssues(
                    fetchMoreResult.repository.issues.nodes
                )
            }
        })
    }, [filter])

    useEffect(() => {
        if (
            issues.length < 1
            && data
        ) {
            setIssues(
                data.repository.issues.nodes
            )
            setEndCursor(
                data.repository.issues.pageInfo.endCursor
            )
            console.log({ data })
        }
    }, [data])

    const loadMore =
        useCallback(
            (entries: any) => {
                return;/**
                 * @TODO:complete infinite scroll here
                 */
                const target = entries[0]
                console.log('loading more start')
                if (
                    target.isIntersecting && !loading
                    && data.repository.issues.pageInfo.hasNextPage
                ) {
                    console.log('loading more middle', data, endCursor)
                    fetchMore(
                        {
                            // query: GITHUB_REPO_ISSUES,
                            variables: {
                                name,
                                owner,
                                first: PAGE_SIZE,
                                after: endCursor
                            },
                            updateQuery: (prev: any, { fetchMoreResult }) => {
                                setEndCursor(
                                    fetchMoreResult.repository.issues.pageInfo.endCursor
                                )
                                setIssues([
                                    ...issues,
                                    ...fetchMoreResult.repository.issues.nodes
                                ])
                            }
                        })
                }
                console.log('loading more end')
            }
            , [
                data, loading, endCursor,
                fetchMore, issues, setIssues,
            ])

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        }
        const observer = new IntersectionObserver(
            loadMore,
            options
        )
        if (triggerRef && triggerRef.current) {
            observer.unobserve(triggerRef.current)
            observer.observe(triggerRef.current)
            console.log('loading more')
        }
        return () => observer.unobserve(triggerRef.current)
    }, [triggerRef.current])

    return (
        <div className={_css.root}>
            <Toolbar
                title="React"
                sub_title="React/Facebook"
            />
            <ToggleButton
                loading={loading}
                setFilter={setFilter}
            />
            {loading ? (
                <ul className={_css.issues__list}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(_ => (
                        <span
                            key={_}
                            className={classes(
                                _css.loading_card,
                                // _css.issues__item,
                                _css.loading,
                            )}
                        ></span>
                    ))}
                </ul>
            ) : (
                    <>
                        {issues.length === 0 && (
                            <div className={_css.centered}>
                                <>
                                    <Typography variant="h1">
                                        Ooop!
                                </Typography>
                                    <Typography gutterBottom variant="subtitle1">
                                        No items found, please try differently!
                                    </Typography>
                                </>
                            </div>
                        )}
                    </>
                )}
            <ul className={_css.issues__list}>
                <AnimatePresence
                // exitBeforeEnter
                >
                    {issues.map(_ => (
                        <motion.li
                            key={_.title}
                            className={_css.issues__item}
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 200, }}
                        >
                            <Card className={_css.root}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {_.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {_.body.substr(0, 300)}...
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions className={_css.issue__actions}>
                                    <Chip
                                        // icon={<FaceIcon />}
                                        label={_.state}
                                        clickable
                                        color={
                                            _.state === STRING_CLOSED ? "secondary" : "primary"
                                        }
                                        // onDelete={handleDelete}
                                        deleteIcon={<DoneIcon />}
                                        variant="outlined"
                                    />
                                    {_.assignees.nodes.map(it => (
                                        <Chip
                                            label={"Assignee : " + it.name}
                                            key={it.name}
                                            clickable
                                            color="primary"
                                            deleteIcon={<DoneIcon />}
                                            variant="outlined"
                                        />
                                    ))}
                                </CardActions>
                            </Card>
                        </motion.li>
                    ))}
                    {
                        data
                        && data.repository.issues.pageInfo.hasNextPage
                        && (
                            <>
                                <span
                                    ref={triggerRef}
                                    className={classes(
                                        _css.loading_card,
                                        // _css.issues__item,
                                        _css.loading,
                                    )}
                                ></span>
                                {[1, 2, 4, 5,].map(_ => (
                                    <span
                                        key={_}
                                        className={classes(
                                            _css.loading_card,
                                            // _css.issues__item,
                                            _css.loading,
                                        )}
                                    ></span>
                                ))}
                            </>
                        )
                    }
                </AnimatePresence>
            </ul>
        </div>
    );
}

export default ResultPage