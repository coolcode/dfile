import React from 'react'
import App, { Container } from 'next/app'
import { appWithTranslation, withNamespaces  } from '../i18n'

class MyApp extends App {
  render() {
    const { Component, pageProps  } = this.props
    return (
      <Container>
          {/*<div>inject content here</div>*/}
          <Component {...pageProps} />
      </Container>
    )
  }
}

export default appWithTranslation(withNamespaces('common')(MyApp));