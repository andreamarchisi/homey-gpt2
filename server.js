const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/trigger-homey-flow', async (req, res) => {
  const { deviceIds } = req.body;
  try {
    // URL del webhook di Homey
    const webhookUrl = 'https://webhook.site/293ddded-f194-4b9f-b8ea-6259c120eb52';
    
    // Log della richiesta inviata
    console.log('Invio richiesta a:', webhookUrl);
    console.log('Payload:', { deviceIds });
    
    // Invia la richiesta POST a Homey
    const response = await axios.post(webhookUrl, { deviceIds });
    
    // Log della risposta di successo
    console.log('Risposta da Homey:', response.data);
    
    res.status(200).json({ status: 'Flow triggered' });
  } catch (error) {
    // Log dell'errore
    console.error('Errore durante l\'invio del webhook a Homey:', error);
    
    // Log dei dettagli dell'errore se disponibili
    if (error.response) {
      console.error('Errore risposta:', error.response.data);
    }
    
    res.status(500).json({ status: 'Error triggering flow', error: error.message });
  }
});

// Porta su cui il server ascolterà le richieste
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
