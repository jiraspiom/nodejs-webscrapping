const pup = require('puppeteer');

const url = "https://www.mercadolivre.com.br/";
const pesquisa = "macbook";

let c = 1;
let list = [];

(async () => {
        const browser = await pup.launch({headless: true});
        const page = await browser.newPage();

        await page.goto(url);

        await page.waitForSelector("#cb1-edit");
        await page.type("#cb1-edit", pesquisa );

        await Promise.all([
            page.waitForNavigation(),
            page.click('.nav-search-btn')
        ])

        //document.queryselectall
        const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href));
        //console.log(links)

        for(const link  of links){
            if (c == 5) continue;

            console.log(`pagina ${c}`);
            await page.goto(link);
            await page.waitForSelector('.ui-pdp-title');

            const title = await page.$eval('.ui-pdp-title', el => el.innerText);
            const preco = await page.$eval('.andes-money-amount__fraction', el => el.innerText);

            const vendedor = await page.evaluate(()=>{
                const el = document.querySelector('.ui-pdp-seller__link-trigger');
                if(!el) return null;
                return el.innerText;
            });

            const obj = {};
            obj.title = title;
            obj.preco = preco;
            (vendedor ? obj.vendedor = vendedor : "");
            obj.link = link;

            //console.log(obj);
            list.push(obj);
            c++;
        }

        console.log(list)

        //await page.waitForTimeout(3000);
        await browser.close();
    }
)();