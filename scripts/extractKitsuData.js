import fs from 'fs';
import fetch from 'node-fetch';

async function fetchKitsuData(category) {
  let results = [];
  let page = 0;
  let limit = 20;
  let hasMore = true;

  while (hasMore) {
    const url = `https://kitsu.io/api/edge/${category}?page[limit]=${limit}&page[offset]=${page}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.data.length === 0) {
      hasMore = false;
    } else {
      const formatted = data.data.map(item => ({
        id: item.id,
        title: item.attributes.titles.en_jp || item.attributes.canonicalTitle,
        type: item.type,
        subtype: item.attributes.subtype,
        status: item.attributes.status,
        start_date: item.attributes.startDate,
        end_date: item.attributes.endDate,
        synopsis: item.attributes.synopsis,
        poster: item.attributes.posterImage?.original
      }));

      results = results.concat(formatted);
      page += limit;
      console.log(`Fetched ${results.length} ${category}...`);
    }
  }

  return results;
}

async function main() {
  const anime = await fetchKitsuData('anime');
  const manga = await fetchKitsuData('manga');

  const allData = [...anime, ...manga];

  fs.writeFileSync('./data/kitsu_data.json', JSON.stringify(allData, null, 2));
  console.log(`Saved ${allData.length} entries to kitsu_data.json`);
}

main();
