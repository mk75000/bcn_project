import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/globals.css';

import initAuth from '../lib/auth'
import { Link } from 'react-router-dom';

initAuth()

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

{filteredMovies.map((movie) => (
  <div key={movie.id} className="movie-card">
    <Link to={`/movie/${movie.id}`}>
      <Card>
        ...
      </Card>
    </Link>
  </div>
))}

export default MyApp;



