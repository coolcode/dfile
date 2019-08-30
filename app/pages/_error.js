import React from 'react'
import PropTypes from 'prop-types'

import { withNamespaces } from '../i18n'
import Layout from "../components/layout"

class Error extends React.Component {
  static getInitialProps({ res, err }) {
    let statusCode = null
    if (res) {
      ({ statusCode } = res)
    } else if (err) {
      ({ statusCode } = err)
    }
    return {
      namespacesRequired: ['common'],
      statusCode,
    }
  }

  render() {
    const { statusCode, t } = this.props
    return (
      <Layout {...this.props}>
        {statusCode
          ? t('error-with-status', { statusCode })
          : t('error-without-status')}
      </Layout>
    )
  }
}

Error.defaultProps = {
  statusCode: null,
}

Error.propTypes = {
  statusCode: PropTypes.number,
  t: PropTypes.func.isRequired,
}

export default withNamespaces('common')(Error)