const withPlugins = require('next-compose-plugins');
const withCSS = require("@zeit/next-css");

module.exports = withPlugins([
  	[withCSS, {
		publicRuntimeConfig: {
			localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
			? process.env.LOCALE_SUBPATHS
			: 'none',
		},
		exportPathMap: function() {

			const pages = {
                "/404": { page: "/404" },
				"/": { page: "/" },
				"/cn": { page: "/", query: {lang: "cn"} }
            };
			return pages; 
		},
  }],
  //[withTM, {transpileModules: ['gsap']}]
]);