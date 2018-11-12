import path from 'path'
import sm from 'sitemap'
import fs from 'fs'


const OUTPUT_FILE = path.resolve(__dirname, '..', '..', 'public', 'sitemap.xml')

const sitemap = sm.createSitemap({
    hostname: 'https://www.flashcardsfordevelopers.com',
    cacheTime: 600000, //600 sec (10 min) cache purge period
    urls: [
      { url: '/', changefreq: 'weekly', priority: 1 },
      { url: '/pages/about', changefreq: 'weekly', priority: 0.5 },
      { url: '/pages/terms-of-service', changefreq: 'weekly', priority: 0.5 },
      { url: '/pages/privacy-policy', changefreq: 'weekly', priority: 0.5 },
      { url: '/collections', changefreq: 'weekly', priority: 0.5 },
    ]
})

fs.writeFileSync(OUTPUT_FILE, sitemap.toString())

console.log(`Sitemap written at ${OUTPUT_FILE}`)