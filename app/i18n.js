const {localeSubpaths} = require('next/config').default().publicRuntimeConfig
const NextI18Next = require('next-i18next').default

const localeSubpathVariations = {
  none: {},
  foreign: {
    cn: 'cn',
  },
  all: {
    en: 'en',
    cn: 'cn',
  },
}


module.exports = new NextI18Next({
    defaultLanguage: 'en',
    otherLanguages: ['cn'],
    ns: ['common'],
    defaultNS: 'common',
    localeSubpaths: localeSubpathVariations[localeSubpaths],
})