import { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import ReactStars from "react-rating-stars-component";



interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number;
}

interface ApiResponse {
  results: Movie[];
}


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [originalMovies, setOriginalMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [filter, setFilter] = useState("popular");
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
const [displayedComments, setDisplayedComments] = useState<{ [key: number]: string[] }>({});





  const fetchAllMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/top_rated?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
    let allMovies = [];
    let currentPage = 1;
    let totalPages = 1;
    while (currentPage <= totalPages) {
      const response = await fetch(`${url}&page=${currentPage}`);
      const data: ApiResponse = await response.json();
      allMovies = [...allMovies, ...data.results];
      currentPage++;
      totalPages = data.total_pages;
    }
    setMovies(allMovies);
    setOriginalMovies(allMovies);
  };

  useEffect(() => {
    const searchMovies = async () => {
      if (searchTerm) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=99d06e5123ffe6c04a6f37b79b9ca695&query=${searchTerm}`;
        const response = await fetch(url);
        const data: ApiResponse = await response.json();
        setMovies(data.results);
      }
    };
    searchMovies();
  }, [searchTerm]);

  useEffect(() => {
    const fetchMovies = async () => {
      let url = 'https://api.themoviedb.org/3/movie/popular?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
      if (filter === "recent") {
        url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
      } else if (filter === "rated") {
        url = 'https://api.themoviedb.org/3/movie/top_rated?api_key=99d06e5123ffe6c04a6f37b79b9ca695';
      }
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      setMovies(data.results);
      setOriginalMovies(data.results);
    };
    fetchMovies();
  }, [filter]);

  useEffect(() => {
    const filteredMovies = originalMovies.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(titleFilter.toLowerCase());
      const yearMatch = !yearFilter || movie.release_date.startsWith(yearFilter);
      const ratingMatch = !ratingFilter || movie.vote_average >= parseFloat(ratingFilter);
      return titleMatch && yearMatch && ratingMatch;
    });
    setMovies(filteredMovies);
  }, [originalMovies, titleFilter, yearFilter, ratingFilter]);

  

  
  

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

  useEffect(() => {
    const ratingsFromCookie = Cookies.get('ratings');
    if (ratingsFromCookie) {
      setRatings(JSON.parse(ratingsFromCookie));
    }
  
    // Récupérer les commentaires affichés à partir des cookies
    const displayedCommentsFromCookie = Cookies.get('displayedComments');
    if (displayedCommentsFromCookie) {
      setDisplayedComments(JSON.parse(displayedCommentsFromCookie));
    }
  }, []);
  
  

  const isFavorite = (id: number) => favorites.includes(id);
  const addFavorite = (id: number) => {
    if (!favorites.includes(id)) {
      const newFavorites = [...favorites, id];
      updateFavorites(newFavorites);
      addRating(id, 0, ''); // appel de la fonction addRating avec une note initiale de 0 et un commentaire vide
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

  const filteredMovies = originalMovies.filter((movie) => {
    const titleMatch = movie.title.toLowerCase().includes(titleFilter.toLowerCase());
    const yearMatch = !yearFilter || movie.release_date.startsWith(yearFilter);
    const ratingMatch = !ratingFilter || movie.vote_average >= parseFloat(ratingFilter);
    return titleMatch && yearMatch && ratingMatch;
  });

  const getAverageRating = (id: number): number | undefined => {
    const movieRatings = Object.entries(ratings)
      .filter(([tvShow]) => parseInt(tvShow) === id)
      .map(([, rating]) => rating);
    const total = movieRatings.reduce((acc, curr) => acc + curr, 0);
    const count = movieRatings.length;
    return count > 0 ? total / count : undefined;
  };

  const addRating = (id: number, rating: number, comment: string) => {
    const newRatings = { ...ratings, [id]: rating };
    const newComments = { ...comments, [id]: comment };
    setRatings(newRatings);
    setComments(newComments);
    updateRatings({ ...ratings, [id]: rating });
    updateComments({ ...comments, [id]: comment });
  };

  
  const updateRatings = (ratings: { [key: number]: number }) => {
    setRatings(ratings);
    Cookies.set('ratings', JSON.stringify(ratings));
  };
  
  const updateComments = (comments: { [key: number]: string }) => {
    setComments(comments);
    
  };
  
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, tvShow: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newDisplayedComments = { ...displayedComments };
      if (!newDisplayedComments[tvShow]) {
        newDisplayedComments[tvShow] = [];
      }
      newDisplayedComments[tvShow].push(comments[tvShow]);
      setDisplayedComments(newDisplayedComments);
  
      // Mettre à jour le cookie des commentaires affichés
      Cookies.set('displayedComments', JSON.stringify(newDisplayedComments));
  
      // Vider le contenu du textarea
      const newComments = { ...comments, [tvShow]: '' };
      setComments(newComments);
      updateComments(newComments);
    }
  };
  
  

  const deleteRatingAndComment = (id: number) => {
  const newRatings = { ...ratings };
  delete newRatings[id];
  setRatings(newRatings);
  updateRatings(newRatings);

  const newComments = { ...comments };
  delete newComments[id];
  setComments(newComments);
  updateComments(newComments);

  const newDisplayedComments = { ...displayedComments };
  delete newDisplayedComments[id];
  setDisplayedComments(newDisplayedComments);
  Cookies.set('displayedComments', JSON.stringify(newDisplayedComments));
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
              {movies
                .filter((movie) => favorites.includes(movie.id))
                .map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={"Poster for " + movie.title}
                      />
                      <Card.Body>
                        <Card.Title>{movie.title}</Card.Title>

                        <Button variant="primary" className="favret" onClick={() => removeFavorite(movie.id)}>
                          Retirer des favoris
                        </Button>
                        

                      </Card.Body>
                    </Card>
                  </div>
                ))}
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
      </div>

      <div className="movies-list">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Card>
              <Card.Img
                variant="top"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`Poster for ${movie.title}`}
              />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text className="descri">{movie.overview}</Card.Text>
                <div className="movie-info">
                  <p>Sorti en {movie.release_date}</p>
                  <p>Note : {movie.vote_average} / 10</p>
                  <p>Durée : {movie.runtime} minutes</p>
                </div>
                <Button variant="primary" className="add" onClick={() => addFavorite(movie.id)}>
                  {isFavorite(movie.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Button>
                <form>
  <div className="form-group">
    <label htmlFor={`rating-${movie.id}`}>Note :</label>
    <ReactStars
  id={`rating-${movie.id}`}
  count={5}
  size={24}
  activeColor="#ffd700"
  isHalf
  value={ratings[movie.id] || 0}
  edit={true}
  onChange={(newRating) => addRating(movie.id, newRating, comments[movie.id] || '')}
/>

  </div>
  <div className="form-group">
    <label htmlFor={`comment-${movie.id}`}>Commentaire :</label>
    <textarea
  id={`comment-${movie.id}`}
  className="form-control"
  value={comments[movie.id] || ''}
  onChange={(event) => addRating(movie.id, ratings[movie.id] || 0, event.target.value)}
  onKeyDown={(event) => handleKeyDown(event, movie.id)}
/>

{displayedComments[movie.id] && (
  <ul>
    <p> Commentaires : </p> 
    {displayedComments[movie.id].map((comment, index) => (
      <li key={index}>{comment}</li>
    ))}
  </ul>
)}
<Button variant="danger" className="favret" onClick={() => deleteRatingAndComment(movie.id)}>
  Supprimer la note et le commentaire
</Button>

  </div>
</form>

              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
