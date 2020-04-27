const https = require('https');
const getTotalPages = s => {
    return new Promise((resolve, reject) => {
        https
            .get(
                `https://jsonmock.hackerrank.com/api/countries/search?name=${s}`,
                response => {
                    let data = '';
                    response.on('data', chunk => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        resolve(JSON.parse(data).total_pages);
                    });
                },
            )
            .on('error', err => reject(err));
    });
};

const getCountriesByPageNum = (s, pageNo) => {
    return new Promise((resolve, reject) => {
        https
            .get(
                `https://jsonmock.hackerrank.com/api/countries/search?name=${s}&page=${pageNo}`,
                response => {
                    let data = '';
                    response.on('data', chunk => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        resolve(JSON.parse(data).data);
                    });
                },
            )
            .on('error', err => reject(err));
    });
};
function getCountries(s, p) {
    // Get the total pages for the search string
    getTotalPages(s).then(async totalPages => {
        //Collect all promises
        const allPageRequests = Array.from(
            { length: totalPages },
            (x, i) => ++i,
        ).map(pageNum => {
            return getCountriesByPageNum(s, pageNum);
        });
        const countriesData = await Promise.all(allPageRequests);
        const countriesDataFlat = [].concat.apply([], countriesData);
        const uniqueCountriesArr = countriesDataFlat.reduce(
            (acc, country, index, arr) => {
                if (
                    index ===
                        arr.findIndex(
                            item => item.name === country.name,
                        ) &&
                    country.population > p
                ) {
                    acc.push(country.population);
                }
                return acc;
            },
            [],
        );
        console.log(uniqueCountriesArr.length);
    });
}
//Get the countries with the passed search string and min population.
getCountries('united', 200);

