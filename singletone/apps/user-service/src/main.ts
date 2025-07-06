import app from './app';

const PORT = process.env.PORT || 3000;
const INSTANCE_NAME = process.env.INSTANCE_NAME || 'default';

app.listen(PORT, () => {
  console.log(`🟢 User Service instancia "${INSTANCE_NAME}" corriendo en el puerto ${PORT}`);
});