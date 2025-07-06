import app from './src/app';

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`✅ Auth Service running on port ${PORT}`);
});