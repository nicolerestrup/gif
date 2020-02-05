const fs = require('fs')

const axios = require('axios')
const prompts = require('prompts')

const apiKey = process.env.API_KEY;

const main = async () => {
  const res = await prompts({
    type: 'text',
    name: 'query',
    message: 'What gif do you want?'
  })
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${res.query}&limit=25&offset=0&rating=G&lang=en`
  const searchRes = await axios.get(url)
  const imgs = searchRes.data.data
  const result = imgs.map((gif, index) => {
    const gifUrl = gif.images.downsized_large.url
    return axios.get(gifUrl, {responseType: 'stream'})
      .then((streamRes) => {
        const fileName = `${res.query}-${index}.gif`
        const outputStream = fs.createWriteStream(fileName)
        console.log(`Writing to file: ${fileName}`)
        streamRes.data.pipe(outputStream)
    })
  })

  await Promise.all(result)
  console.log('All files are downloaded!')

  // img.forEach((gif, index) => {
  //   const gifUrl = gif.images.downsized_large.url
  //   axios.get(gifUrl, {responseType: 'stream'})
  //     .then((streamRes) => {
  //     const fileName = `${res.query}-${index}.gif`
  //     const outputStream = fs.createWriteStream(fileName)
  //     console.log(`Writing to file: ${fileName}`)
  //     streamRes.data.pipe(outputStream)
  //   })
  // });
}

main()