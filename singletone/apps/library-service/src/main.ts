import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3003;

app.listen(port, () => {
    console.log(`Library service listening on port ${port}`);
});