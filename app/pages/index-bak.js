import React from "react"
import dynamic from 'next/dynamic'
import withLang from '../common/withLang';

// class Index extends React.Component {
//     render() {
//         let props = this.props;
//         //let path = "../components/_index";
//
//         const AppWithoutSSR = dynamic(
//             () => import("../components/_index"),
//             {ssr: false}
//         )
//
//         return <AppWithoutSSR {...props}/>
//     }
// }

import HomePage from '../components/_index';

class Index extends React.Component {
    render() {
        let props = this.props;

        return <HomePage {...props}/>
    }
}

export default withLang(Index);

 
