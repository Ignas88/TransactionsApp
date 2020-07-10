export const getConfig = async (url) => {
  return await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((resJSON) => {
      return resJSON;
    })
    .catch((err) => {
      console.log(`error while getting config from ${url}`)
      console.log(err)
    });
}