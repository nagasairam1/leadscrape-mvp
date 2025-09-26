document.getElementById('run').addEventListener('click', async () => {
  const query = document.getElementById('query').value;
  const limit = parseInt(document.getElementById('limit').value) || 20;

  if (!query) return alert('Enter a search query');

  const { token } = await chrome.storage.local.get('token');
  if (!token) return alert('Please log in at leadscrape.dev');

  const res = await fetch('http://localhost:3000/api/v1/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      flowId: 'linkedin-scrape-v1',
      input: { searchQuery: query, maxProfiles: limit }
    })
  });

  if (res.ok) {
    const job = await res.json();
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon48.png',
      title: 'Job Submitted',
      message: `Job ${job.id} is running. Check your email for results.`
    });
  } else {
    const err = await res.text();
    alert('Error: ' + err);
  }
});
