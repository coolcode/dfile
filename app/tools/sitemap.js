const fs = require('fs');
const getPages = () => {
    const fileObj = {};

    const walkSync = dir => {
        // Get all files of the current directory & iterate over them
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            // Construct whole file-path & retrieve file's stats
            const filePath = `${dir}${file}`;
            const fileStat = fs.statSync(filePath);

            if (fileStat.isDirectory()) {
                // Recurse one folder deeper
                walkSync(`${filePath}/`);
            } else {
                // Construct this file's pathname excluding the "pages" folder & its extension
                const cleanFileName = filePath
                    .substr(0, filePath.lastIndexOf("."))
                    .replace("pages/", "");

                // Add this file to `fileObj`
                fileObj[`/${cleanFileName}`] = {
                    page: `/${cleanFileName}`,
                    lastModified: fileStat.mtime
                };
            }
        });
    };

    // Start recursion to fill `fileObj`
    walkSync("pages/");

    return fileObj;
};

const formatDate = (date) => {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
};


const config = require("../config/config.json");

const domain = config["domain"];
console.log("domain:", domain);
const pages = getPages();

let xml = "";
Object.keys(pages).map(
    path => {
        xml += `<url>\n\t<loc>${domain}${path}</loc>\n\t<lastmod>${formatDate(new Date(pages[path].lastModified))}</lastmod>\n</url>\n`;
    }
);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
${xml}
</urlset>`;

fs.writeFileSync("out/sitemap.xml", sitemapXml);
console.log("sitemap:", sitemapXml);
const cname  = domain.replace("https://","").replace("http://","");

fs.writeFileSync("out/CNAME", cname);
console.log("CNAME:", cname);