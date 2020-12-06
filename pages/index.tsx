import {
  FormControl, InputLabel,
  OutlinedInput, InputAdornment, CircularProgress, Typography, TextField, Input, Snackbar,
} from '@material-ui/core'
import {
  SearchOutlined,
} from '@material-ui/icons'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import _css from './index.module.scss'
import {
  useQuery, gql, useLazyQuery, ApolloError
} from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/router'
import { IconButton } from '@material-ui/core'
import {
  CloseOutlined as CloseIcon
} from '@material-ui/icons'

export interface IHomeProps {

}

const GITHUB_REPO_ID = gql`
query GetRepoid(
        $name:String!, $owner:String!, 
    ) {
    repository(name:$name, owner:$owner) {
        id
    }
  }
`;

const Home: React.FC<IHomeProps> = (props) => {
  const [repoOwner, setRepoOwner] = useState<string>("")
  const [repoName, setRepoName] = useState<string>("")
  const [
    owner
  ] = useDebounce(repoOwner, 1000)
  const [
    name
  ] = useDebounce(repoName, 1000)
  const [open, setOpen] = React.useState(false);
  const [
    errorMessage, setErrorMessage
  ] = useState<string>('')

  const router = useRouter()
  const [
    execute,
    {
      loading, error, data, fetchMore,
      updateQuery, called,
    }
  ] = useLazyQuery<any>(
    GITHUB_REPO_ID,
    {
      variables: {
        name: owner,
        owner: name,
      },
      onCompleted: () => {
        router.push(`/results/${owner}/${name}`)
      },
      onError: (_: ApolloError) => {
        setErrorMessage(_.message)
        setOpen(true);

      }
    }
  );

  useEffect(() => {
    if (
      !Boolean(owner) && !Boolean(name)
    ) { return }
    execute({
      variables: {
        name, owner,
      },
    })
  }, [owner, name])


  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };




  return (
    <div className={_css.container}>
      <Head>
        <title>Github repo viewer</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <InputLabel htmlFor="outlined-adornment-amount">
        <Typography variant="h4">
          Repository owner
        </Typography>
      </InputLabel>
      <FormControl
        margin="normal"
        fullWidth
        className={_css.searchfield}
        variant="outlined"
      >
        <Input
          id="outlined-adornment-amount"
          value={repoOwner}
          placeholder="[facebook,angular]"
          onChange={
            _ => setRepoOwner(_.target.value)
          }
          startAdornment={
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={14} />
              ) : (
                  <SearchOutlined />
                )}
            </InputAdornment>
          }        // labelWidth={60}
        />
      </FormControl>

      <InputLabel htmlFor="outlined-adornment-amount">
        <Typography variant="h4">
          Repository name
        </Typography>
      </InputLabel>
      <FormControl
        fullWidth
        margin="normal"
        className={_css.searchfield}
        variant="outlined"
      >
        <Input
          id="rteeggr-adornment-amount"
          value={repoName}
          placeholder={'[react,angular]'}
          onChange={
            _ => setRepoName(_.target.value)
          }
          startAdornment={
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={14} />
              ) : (
                  <SearchOutlined />
                )}
            </InputAdornment>
          }        // labelWidth={60}
        />
      </FormControl>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errorMessage}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  )
}

export const getStaticProps = () => {
  console.log('buiding')
  return {
    props: {
      buildTimestamp: Date.now()
    }
  }
}

export default Home;