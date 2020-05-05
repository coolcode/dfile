import React from "react";
import Head from "next/head";
import {initGA, logPageView} from "./analytics";
import {ToastContainer, toast} from "react-toastify";
// webpack will take this css shit away!!!
//import "react-toastify/dist/ReactToastify.css";
import "./toasts.css";

export default class BaseLayout extends React.Component {
    componentDidMount() {
        if (!window.GA_INITIALIZED) {
            initGA();
            window.GA_INITIALIZED = true;
        }
        logPageView();
    }

    render() {
        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta property="og:title" content="DFile"/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:url" content="https://dfile.app"/>
                    <meta property="og:image" content="/static/img/icon.svg"/>
                    <meta property="og:site_name" content="dfile.app"/>
                    <meta
                        property="og:description"
                        content="DFile is a free and anonymous file-sharing platform. You can store and share data of all types (files, images, music, videos etc...). There is no limit, you download at the maximum speed of your connection and everything is free."
                    />
                    <title>DFile - Distributed file upload to S3 for 100% free | Blockchain</title>
                    <meta
                        name="keywords"
                        content="dfile,file,download,upload,free,s3,blockchain,host,storage,share,big,file,video,image,audio,opensource,ethereum "
                    />
                    <meta name="description" content="DFile is a free and anonymous file-sharing platform. You can store and share data of all types (files, images, music, videos etc...). There is no limit, you download at the maximum speed of your connection and everything is free." />

                    <link rel="icon" sizes="32x32" href="/static/img/favicon.ico"/>
                    <link rel="apple-touch-icon" href="/static/img/icon.svg"/>
                    {/*<link href="https://fonts.googleapis.com/css?family=Patrick+Hand|Roboto" rel="stylesheet"/>
					 <link
						rel="stylesheet"
						href="https://use.fontawesome.com/releases/v5.4.1/css/all.css"
						integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz"
						crossOrigin="anonymous"
					/> */}
                    <link rel="stylesheet" href="/static/theme.css"/>
                    <link rel="stylesheet" href="/static/style.css"/>
                    <script async defer src="/static/scripts/buttons.js"></script>
                </Head>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    newestOnTop
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                {this.props.children}
            </>
        );
    }
}
