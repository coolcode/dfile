import React from "react"
import NoSSR from 'react-no-ssr';
import dynamic from 'next/dynamic';
import Loading from './loading';

const withDynamic = (path) =>{ 
    const WrappedComponentWithoutSSR = dynamic( () => import(path),
        {
            loading: () => <Loading/>,
            ssr: false
        }
    );
  return class extends React.Component {
    render() { 
      return <WrappedComponentWithoutSSR {...this.props} />;
    }
  };
} 

export default withDynamic;