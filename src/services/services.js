export const getConfig = async (url) => {
  try {
    const res = await fetch(url)
    return res.json();
  } catch (e) {
    console.log(`error while getting config from ${url}`);
    console.log(e);
  }
}