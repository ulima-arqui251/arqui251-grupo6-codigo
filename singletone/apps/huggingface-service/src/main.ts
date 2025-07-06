import app from './app';

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
    console.log(`Huggingface Service running on port ${PORT}`);
});