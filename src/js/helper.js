import { TIMEOUT_SEC } from './configure';
const waitTime = sec =>
  new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(new Error(`Request took too long! Timeout after ${sec} second`)),
      1000 * sec,
    ),
  );

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, waitTime(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.status} (${res.status})`);
    return data;
  } catch (err) {
    console.error(err);
    console.log(err);
    // throw err;
  }
};
