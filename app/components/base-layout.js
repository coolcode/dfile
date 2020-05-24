import React, {useEffect} from "react";
import Head from "next/head";
import {initGA} from "./analytics";

import imgIcon from '../asserts/img/icon.svg'

export default ({children}) => {

    useEffect(() => {
        document.body.classList.add("bg-default")
        if (!window.GA_INITIALIZED) {
            initGA()
            window.GA_INITIALIZED = true
        }
    }, [])


    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta property="og:title" content="DFile"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://dfile.app"/>
                <meta property="og:image" content={imgIcon}/>
                <meta property="og:site_name" content="dfile.app"/>
                <meta
                    property="og:description"
                    content="DFile is a free and anonymous file-sharing platform. You can store and share data of all types (files, images, music, videos etc...). There is no limit, you download at the maximum speed of your connection and everything is free."
                />
                <title>DFile - Distributed file upload to S3 for 100% free | Blockchain</title>
                <meta name="keywords" content="dfile,file,download,upload,free,s3,blockchain,host,storage,share,big,file,video,image,audio,opensource,ethereum "/>
                <meta name="description"
                      content="DFile is a free and anonymous file-sharing platform. You can store and share data of all types (files, images, music, videos etc...). There is no limit, you download at the maximum speed of your connection and everything is free."/>

                <link rel="icon" sizes="32x32" href="/favicon.ico"/>
                <link rel="apple-touch-icon" href={imgIcon}/>
            </Head>
            {children}
        </>
    )
}
