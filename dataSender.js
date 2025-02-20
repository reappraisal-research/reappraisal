// dataSender.js
function sendExperimentData(experimentData, callback) {
  // Replace the URL below with your actual API Gateway endpoint URL.
  // In your case, it should be:
  // https://acm1fr3981.execute-api.us-east-2.amazonaws.com/stage/storeData
  const apiUrl = 'https://acm1fr3981.execute-api.us-east-2.amazonaws.com/stage/storeData';

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(experimentData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(result => {
      console.log('Data stored successfully:', result);
      if (callback) callback(null, result);
    })
    .catch(error => {
      console.error('Error storing data:', error);
      if (callback) callback(error);
    });
}
