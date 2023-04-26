import { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

interface TVShow {
    id: number;
    name: string;
    poster_path: string;
    overview: string;
    first_air_date: string;
    vote_average: number;
}

interface ApiResponse {
    results: TVShow[];
}


export default function App() {
    const [tvShows, setTVShows] = useState<TVShow[]>([]);
    const [originalTVShows, setOriginalTVShows] = useState<TVShow[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [titleFilter, setTitleFilter] = useState<string>('');
    const [yearFilter, setYearFilter] = useState<string>('');
    const [ratingFilter, setRatingFilter] = useState<string>('');
    const [filter, setFilter] = useState("popular");
  

    useEffect(() => {
        const fetchAllTVShows = async () => {
          const url = 'https://api.themoviedb.org/3/tv/popular?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
          const response = await fetch(url);
          const data: ApiResponse = await response.json();
          setTVShows(data.results);
          setOriginalTVShows(data.results);
          setTitleFilter('');
          setYearFilter('');
          setRatingFilter('');
        };
        fetchAllTVShows();
      }, []);     

    useEffect(() => {
        const filteredTVShows = originalTVShows.filter((tvShow) => {
            const titleMatch = tvShow.name.toLowerCase().includes(titleFilter.toLowerCase());
            const yearMatch = !yearFilter || tvShow.first_air_date.startsWith(yearFilter);
            const ratingMatch = !ratingFilter || tvShow.vote_average >= parseFloat(ratingFilter);
            return titleMatch && yearMatch && ratingMatch;
        });
        setTVShows(filteredTVShows);
    }, [tvShows, titleFilter, yearFilter, ratingFilter]);


    useEffect(() => {
        const fetchTVShows = async () => {
            let url = 'https://api.themoviedb.org/3/tv/popular?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
            if (filter === "recent") {
                url = 'https://api.themoviedb.org/3/tv/on_the_air?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
            } else if (filter === "rated") {
                url = 'https://api.themoviedb.org/3/tv/top_rated?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
            }
            const response = await fetch(url);
            const data: ApiResponse = await response.json();
            setTVShows(data.results);
            setOriginalTVShows(data.results);
        };
        fetchTVShows();
    }, [filter]);

    useEffect(() => {
        const fetchTVShows = async () => {
            const url = 'https://api.themoviedb.org/3/tv/popular?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
            const response = await fetch(url);
            const data: ApiResponse = await response.json();
            setTVShows(data.results);
            setOriginalTVShows(data.results);

        };
        fetchTVShows();
    }, []);

    useEffect(() => {
        const filteredTVShows = tvShows.filter((tvShow) => {
            const titleMatch = tvShow.name.toLowerCase().includes(titleFilter.toLowerCase());
            const yearMatch = !yearFilter || tvShow.first_air_date.startsWith(yearFilter);
            const ratingMatch = !ratingFilter || tvShow.vote_average >= parseFloat(ratingFilter);
            return titleMatch && yearMatch && ratingMatch;
        });
        setTVShows(filteredTVShows);
    }, [originalTVShows, titleFilter, yearFilter, ratingFilter]);

    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [comments, setComments] = useState<{ [key: number]: string }>({});

    const addRating = (id: number, rating: number, comment: string) => {
        const newRatings = { ...ratings, [id]: rating };
        const newComments = { ...comments, [id]: comment };
        setRatings(newRatings);
        setComments(newComments);
    };

    const updateFavorites = (favorites: number[]) => {
        setFavorites(favorites);
        Cookies.set('favorites', JSON.stringify(favorites));
    };


    useEffect(() => {
        const favoritesFromCookie = Cookies.get('favorites');
        if (favoritesFromCookie) {
            setFavorites(JSON.parse(favoritesFromCookie));
        }
    }, []);

    const isFavorite = (id: number) => favorites.includes(id);
    const addFavorite = (id: number) => {
        if (!favorites.includes(id)) {
            const newFavorites = [...favorites, id];
            updateFavorites(newFavorites);
        }
    };

    const removeFavorite = (id: number) => {
        const newFavorites = favorites.filter((favoriteId) => favoriteId !== id);
        updateFavorites(newFavorites);
    };

    const clearFavorites = () => {
        updateFavorites([]);
    };

    const favoritesCount = favorites.length;

    const filteredTVShows = originalTVShows.filter((tvShow) => {
        const titleMatch = tvShow.name.toLowerCase().includes(titleFilter.toLowerCase());
        const yearMatch = !yearFilter || tvShow.first_air_date.startsWith(yearFilter);
        const ratingMatch = !ratingFilter || tvShow.vote_average >= parseFloat(ratingFilter);
        return titleMatch && yearMatch && ratingMatch;
    });


    const getAverageRating = (id: number): number | undefined => {
        const tvShowRatings = Object.entries(ratings)
            .filter(([tvShowId]) => parseInt(tvShowId) === id)
            .map(([, rating]) => rating);
        const total = tvShowRatings.reduce((acc, curr) => acc + curr, 0);
        const count = tvShowRatings.length;
        return count > 0 ? total / count : undefined;
    };

    return (
        <div className="App">
            <div className="container">
                <div className="search-bar">
                    <div className="filters">
                        <input type="text" placeholder="Titre" value={titleFilter} onChange={(event) => setTitleFilter(event.target.value)} />
                    </div>
                    <div className="filters">
                        <input type="text" placeholder="Année" value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} />
                    </div>
                    <div className="filters">
                        <input type="text" placeholder="Note" value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)} />
                    </div>
                </div>

                {favoritesCount > 0 && (
                    <div className="favorites-section">
                        <h2> Favoris ({favoritesCount})</h2>
                        <div className="movies-list">
                            {tvShows.map((tvShow) => {
                                if (favorites.includes(tvShow.id)) {
                                    return (
                                        <div key={tvShow.id} className="movie-card">
                                            <Card>
                                                <Card.Img
                                                    variant="top"
                                                    src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                                                    alt={"Poster for " + tvShow.name}
                                                />
                                                <Card.Body>
                                                    <Card.Title>{tvShow.name}</Card.Title>
                                                    <Button variant="primary" className="favret" onClick={() => removeFavorite(tvShow.id)}>
                                                        Retirer des favoris
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                )}

                <div className="filters">
                    <button onClick={() => setFilter("popular")}>Populaires</button>
                </div>
                <div className="filters">
                    <button onClick={() => setFilter("recent")}>Récents</button>
                </div>
                <div className="filters">
                    <button onClick={() => setFilter("rated")}>Bien notés</button>
                </div>

                
                <div className="movies-list">
              
                    {filteredTVShows.map((tvShow) => (
                        <div key={tvShow.id} className="movie-card">
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                                    alt={"Poster for " + tvShow.name}
                                />
                                <Card.Body>
                                    <Card.Title>{tvShow.name}</Card.Title>
                                    <Card.Text className="descri">{tvShow.overview}</Card.Text>
                                    <div className="movie-info">
                                        <p>Première diffusion : {tvShow.first_air_date}</p>
                                        <p>Note : {tvShow.vote_average} / 10</p>
                                        {tvShow.number_of_seasons && <p>Saisons : {tvShow.number_of_seasons}</p>}
                                    </div>
                                    <Button variant="primary" className="add" onClick={() => addFavorite(tvShow.id)}>
                                        {isFavorite(tvShow.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};