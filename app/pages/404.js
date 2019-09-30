import React from "react"

import Layout from "../components/layout"
import {withNamespaces} from "../i18n";

class NotFoundPage extends React.Component {
    render(){
        return (
            <Layout {...this.props}>
                <h1>404 NOT FOUND</h1>
                <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
            </Layout>
        );
    }
}

export default withNamespaces('common')(NotFoundPage)
