export const apiRequest = async (url, method, data) => {
  let response;
  switch(method) {
    case 'GET':
      response = await fetch(url, {
        method,
        mode: 'cors',
      });
      break;
    case 'POST':
      response = await fetch(url, {
        method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    //more cases for CRUD operations later
  }
  return response.json();
}