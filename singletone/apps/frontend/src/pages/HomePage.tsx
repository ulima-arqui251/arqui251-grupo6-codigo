import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-container">
        <h1 className="home-title">Singletone</h1>
        <img 
            src="src/assets/singletone-logo-grey.svg" 
            alt="Singletone Icon" 
            className="home-icon"
        />
        </div>
    );
};

export default HomePage;