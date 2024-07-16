const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/trigger-homey-flow', async (req, res) => {
  const { deviceIds } = req.body;
  try {
    // URL del webhook di Homey con il parametro event
    const eventName = 'trigger_device_flow'; // Sostituisci con il nome dell'evento corretto
    const webhookUrl = `https://webhooks.athom.com/webhook/648d9cdc3e7ea90bb080ab45?homey=5df781c9a4a24139f9a2dbfa&event=${eventName}`;
    
    // Log della richiesta inviata
    console.log('Invio richiesta a:', webhookUrl);
    console.log('Payload:', { deviceIds });
    
    // Invia la richiesta POST a Homey
    const response = await axios.post(webhookUrl, { deviceIds });
    
    // Log della risposta di successo
    console.log('Risposta da Homey:', response.data);
    
    res.status(200).json({ status: 'Flow triggered', response: response.data });
  } catch (error) {
    // Log dell'errore
    console.error('Errore durante l'invio del webhook a Homey:', error.message);
    
    // Log dei dettagli dell'errore se disponibili
    if (error.response) {
      console.error('Errore risposta:', error.response.data);
      res.status(error.response.status).json({ status: 'Error triggering flow', error: error.response.data });
    } else {
      res.status(500).json({ status: 'Error triggering flow', error: error.message });
    }
  }
});

app.get('/device-status', async (req, res) => {
  const { deviceId } = req.query;
  try {
    // Simula la risposta dello stato del dispositivo
    const deviceStatus = {
      deviceId: deviceId,
      status: 'online', // Può essere 'online', 'offline', ecc.
      batteryLevel: 80 // Percentuale della batteria
    };
    
    res.status(200).json(deviceStatus);
  } catch (error) {
    res.status(500).json({ status: 'Error getting device status', error: error.message });
  }
});

app.get('/gpt-endpoint', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.get('/', (req, res) => {
  res.send('Hello, this is the Homey Flow Trigger server!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
